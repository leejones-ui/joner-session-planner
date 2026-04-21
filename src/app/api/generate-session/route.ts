import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getAnthropic, CLAUDE_MODEL } from "@/lib/anthropic";
import { buildSystemPrompt } from "@/lib/prompts/load";
import { zodToToolSchema } from "@/lib/zod-tool";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { stripDashes } from "@/lib/sanitize";
import {
  GenerateSessionInput,
  SessionDraft,
  type Block,
  type Session,
} from "@/lib/schema/session";
import { EMPTY_DIAGRAM } from "@/lib/schema/diagram";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    console.log(`[rate-limit] blocked ip=${ip}, retryAfter=${rl.retryAfterSeconds}s`);
    return NextResponse.json(
      { error: "You've hit tonight's limit, try again in an hour." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = GenerateSessionInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }
  const input = parsed.data;

  let system: string;
  let client;
  try {
    system = await buildSystemPrompt("session-generator.md");
    client = getAnthropic();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server misconfigured";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const userMessage = buildUserMessage(input);
  const toolSchema = zodToToolSchema(SessionDraft);

  let resp;
  try {
    resp = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      system: [
        { type: "text", text: system, cache_control: { type: "ephemeral" } },
      ],
      tools: [
        {
          name: "submit_session",
          description: "Submit the generated session plan.",
          input_schema: toolSchema,
        },
      ],
      tool_choice: { type: "tool", name: "submit_session" },
      messages: [{ role: "user", content: userMessage }],
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Model call failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const toolBlock = resp.content.find((c) => c.type === "tool_use");
  if (!toolBlock || toolBlock.type !== "tool_use") {
    return NextResponse.json({ error: "Model did not return a tool call" }, { status: 502 });
  }

  const draftParsed = SessionDraft.safeParse(toolBlock.input);
  if (!draftParsed.success) {
    return NextResponse.json({ error: "Model output failed schema validation", issues: draftParsed.error.issues }, { status: 502 });
  }
  const draft = stripDashes(draftParsed.data);

  const now = new Date().toISOString();
  const sessionId = crypto.randomUUID();
  const blocks: Block[] = draft.blocks.map((b, i) => ({
    ...b,
    id: `${sessionId.slice(0, 8)}-b${i + 1}`,
    diagram: EMPTY_DIAGRAM,
  }));

  const session: Session = {
    id: sessionId,
    title: draft.title,
    prompt: input.prompt,
    objective: draft.objective,
    blocks,
    totalDuration: draft.totalDuration,
    createdAt: now,
  };

  return NextResponse.json(session);
}

function buildUserMessage(input: GenerateSessionInput) {
  const lines = [`Coach request: ${input.prompt}`];
  if (input.ageGroup) lines.push(`Age group: ${input.ageGroup}`);
  if (input.playerCount) lines.push(`Players: ${input.playerCount}`);
  if (input.duration) lines.push(`Total duration: ${input.duration} minutes`);
  if (input.focus) lines.push(`Focus: ${input.focus}`);
  lines.push("");
  lines.push("Build the session. Call submit_session with the full plan.");
  return lines.join("\n");
}
