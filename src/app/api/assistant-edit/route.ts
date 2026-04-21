import { NextResponse } from "next/server";
import { getAnthropic, CLAUDE_MODEL } from "@/lib/anthropic";
import { buildSystemPrompt } from "@/lib/prompts/load";
import { zodToToolSchema } from "@/lib/zod-tool";
import { AssistantEditInput, Block } from "@/lib/schema/session";
import { stripDashes } from "@/lib/sanitize";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = AssistantEditInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }
  const { block, message } = parsed.data;

  let system: string;
  let client;
  try {
    system = await buildSystemPrompt("assistant-edit.md");
    client = getAnthropic();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server misconfigured";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const toolSchema = zodToToolSchema(Block);

  const userMessage = [
    "Current block JSON:",
    "```json",
    JSON.stringify(block, null, 2),
    "```",
    "",
    `Coach message: ${message}`,
    "",
    "Apply the change and call submit_block with the full updated block.",
  ].join("\n");

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
          name: "submit_block",
          description: "Submit the updated block JSON.",
          input_schema: toolSchema,
        },
      ],
      tool_choice: { type: "tool", name: "submit_block" },
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

  const blockParsed = Block.safeParse(toolBlock.input);
  if (!blockParsed.success) {
    return NextResponse.json({ error: "Model output failed schema validation", issues: blockParsed.error.issues }, { status: 502 });
  }

  const merged: Block = stripDashes({ ...blockParsed.data, id: block.id, type: block.type });
  return NextResponse.json({ block: merged });
}
