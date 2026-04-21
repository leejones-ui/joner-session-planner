import { NextResponse } from "next/server";
import { getAnthropic, CLAUDE_MODEL } from "@/lib/anthropic";
import { buildSystemPrompt } from "@/lib/prompts/load";
import { zodToToolSchema } from "@/lib/zod-tool";
import { GenerateDiagramInput } from "@/lib/schema/session";
import { Diagram, EMPTY_DIAGRAM } from "@/lib/schema/diagram";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = GenerateDiagramInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }
  const input = parsed.data;

  let system: string;
  let client;
  try {
    system = await buildSystemPrompt("diagram-generator.md");
    client = getAnthropic();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server misconfigured";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const lines = [`Block description: ${input.blockDescription}`];
  if (input.blockType) lines.push(`Block type: ${input.blockType}`);
  if (input.playerCount) lines.push(`Players in session: ${input.playerCount}`);
  lines.push("");
  lines.push("Call submit_diagram with a clean, readable diagram for this block.");
  const userMessage = lines.join("\n");

  const toolSchema = zodToToolSchema(Diagram);

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
          name: "submit_diagram",
          description: "Submit the diagram JSON for this block.",
          input_schema: toolSchema,
        },
      ],
      tool_choice: { type: "tool", name: "submit_diagram" },
      messages: [{ role: "user", content: userMessage }],
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Model call failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const toolBlock = resp.content.find((c) => c.type === "tool_use");
  if (!toolBlock || toolBlock.type !== "tool_use") {
    // Fail soft: return an empty diagram so the UI can still render the block.
    return NextResponse.json({ diagram: EMPTY_DIAGRAM, warning: "Model did not return a tool call" });
  }

  const diagramParsed = Diagram.safeParse(toolBlock.input);
  if (!diagramParsed.success) {
    return NextResponse.json({ diagram: EMPTY_DIAGRAM, warning: "Model output failed schema validation", issues: diagramParsed.error.issues });
  }

  return NextResponse.json({ diagram: diagramParsed.data });
}
