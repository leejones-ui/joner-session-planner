# Progress log

Overnight build, 2026-04-21.

## Decisions
- Next.js 16.2 (scaffold default, brief asked 14+ so this is fine).
- Tailwind v4 (scaffold default).
- Anthropic SDK 0.90, Zod 4.3, Supabase JS 2.104.
- Claude model: `claude-opus-4-7` (latest Opus per harness). Fallback `claude-sonnet-4-6`.
- Skipped shadcn CLI to avoid interactive prompts overnight. Built lean components by hand with Tailwind + cva. Still uses shadcn patterns.
- React 19 in use, so server actions and async components available.

## Done
- Repo scaffolded with Next.js 14+ app router + TS + Tailwind v4.
- Deps installed: @anthropic-ai/sdk, @supabase/supabase-js, zod, clsx, tailwind-merge, cva, lucide-react.
- CLAUDE.md with full brief at repo root.

## Next
See task list / git log.

## Blockers for Lee
(none yet, will update as things come up)

## Things for Lee to review in the morning
- Prompt library in `src/lib/prompts/` : voice-guide, session-generator, diagram-generator, assistant-edit. These are first drafts, refine after seeing live output.
- Sample diagrams at `/samples` route to validate renderer.
- Model choice: used `claude-opus-4-7`. Swap in one spot (`src/lib/anthropic.ts`) if a better one ships.
