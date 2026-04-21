import Anthropic from "@anthropic-ai/sdk";

// Latest Claude Opus is the model of record for all three Joner endpoints.
// If this string goes stale, swap it in one place.
export const CLAUDE_MODEL = process.env.CLAUDE_MODEL ?? "claude-opus-4-7";
export const CLAUDE_FALLBACK_MODEL = "claude-sonnet-4-6";

let client: Anthropic | null = null;

export function getAnthropic() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set. Copy .env.local.example to .env.local and fill it in.");
  }
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}
