import { readFile } from "node:fs/promises";
import path from "node:path";

// Prompts are authored as markdown, loaded at request time, and combined with the voice guide.
// The entire system prompt is cached with ephemeral cache_control, so repeated reads on hot routes are cheap.
const cache = new Map<string, string>();

async function loadOne(name: string) {
  if (cache.has(name)) return cache.get(name)!;
  const p = path.join(process.cwd(), "src", "lib", "prompts", name);
  const body = await readFile(p, "utf8");
  cache.set(name, body);
  return body;
}

export async function buildSystemPrompt(specific: string) {
  const [voice, main] = await Promise.all([loadOne("voice-guide.md"), loadOne(specific)]);
  return `${voice}\n\n---\n\n${main}`;
}
