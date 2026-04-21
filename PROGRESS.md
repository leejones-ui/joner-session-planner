# Progress log

Overnight build, 2026-04-21. Ready for morning review.

## Decisions
- Next.js 16.2 (scaffold default, brief asked 14+ so this is fine). Note: `params` is now a Promise in route handlers and pages, required `await`.
- Tailwind v4 (scaffold default).
- Anthropic SDK 0.90, Zod 4.3 (native `z.toJSONSchema()` used for tool schemas), Supabase JS 2.104.
- Claude model: `claude-opus-4-7` (latest Opus per harness). Fallback `claude-sonnet-4-6`. Env override: `CLAUDE_MODEL`.
- Skipped shadcn CLI to avoid interactive prompts overnight. Built lean components by hand with Tailwind + cva. Same patterns, less ceremony.
- Tool use with forced `tool_choice` for all three endpoints, structured output lands as a tool call and is Zod-validated server side.
- Prompt caching on: system prompts marked `cache_control: ephemeral`. Voice guide is prepended to every endpoint prompt.
- Save to Supabase fires client-side once all diagrams have landed, so the share link always includes diagrams.
- If Supabase env is missing, save endpoint returns 501 and the UI hides the share link gracefully.
- If Anthropic env is missing, generate endpoints return 500 with a clear message.

## Done, all Day 1 to Day 4 tasks
- Repo at https://github.com/leejones-ui/joner-session-planner
- Next.js 14+ app router + TS + Tailwind v4 scaffold
- Deps: `@anthropic-ai/sdk`, `@supabase/supabase-js`, `zod`, `clsx`, `tailwind-merge`, `cva`, `lucide-react`
- `CLAUDE.md` with full brief and `AGENTS.md` with Next 16 warning
- Zod schemas: `src/lib/schema/diagram.ts` and `src/lib/schema/session.ts`, matching the locked JSON schema in the brief
- SVG renderer: `src/components/pitch/DiagramSvg.tsx` handles every object type, grass-striped pitch, white markings, colored arrows
- 5 hand-crafted sample diagrams: `src/samples/index.ts`, rendered at `/samples`
- Prompt library: `src/lib/prompts/{voice-guide, session-generator, diagram-generator, assistant-edit}.md`
- Three Claude endpoints:
  - `POST /api/generate-session`
  - `POST /api/generate-diagram`
  - `POST /api/assistant-edit`
- Save + share: `POST /api/save-session` and `GET /s/[id]`
- Home route: hero, prompt box, four constraint chip rows (age, players, duration, focus), generate button
- Session display: hero, block cards by type with badge, duration, diagram, coaching points, equipment, show/hide toggle
- Diagram fan-out: after session lands, Promise.all per block, UI fills in as each diagram returns
- Assistant edit drawer: side sheet, textarea, posts to endpoint, replaces block in state

## Finish line checks (verified)
- `pnpm install` clean
- `pnpm build` succeeds, 8 routes
- `pnpm dev` boots, `/` and `/samples` return HTTP 200
- `/samples` server-renders 5 SVG diagrams with correct aria-labels
- `pnpm exec tsc --noEmit` clean

## What Lee should do in the morning
1. Fill `.env.local` with:
   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Run the Supabase migration in `supabase/migrations/0001_sessions.sql`.
3. `pnpm dev`, try a few prompts. Watch:
   - The session structure (warmup, mains, game)
   - Voice quality (any slips on em dashes or banned words? tune `src/lib/prompts/voice-guide.md`)
   - Diagram quality at each `/samples`-style level of fidelity. If diagrams are muddy, tune `src/lib/prompts/diagram-generator.md`.
4. Film the demo: prompt, generate, show block cards filling in, open the edit drawer, change something, show the share link working.

## Things Lee might want to adjust
- Prompt library in `src/lib/prompts/` : refine after seeing live Claude output. Especially the diagram prompt.
- Model: `CLAUDE_MODEL` env var overrides the default in `src/lib/anthropic.ts`.
- Brand: pitch uses a green stripe (`#0f5132` / `#146c43`). Swap in `DiagramSvg.tsx` if Lee wants JF green tokens.
- Typography: default Geist is fine. Swap in `layout.tsx` if a JF brand font is available.

## Known v1 limits (deliberately)
- No auth, no login, no account.
- No saved-session library.
- No prompt history.
- Static SVG only, no animation.
- No drill-link extraction.
- No PDF export yet (listed as demo stretch in brief).
- Sharing requires Supabase configured. The UI hides the share link if not.

## Commit log
See `git log --oneline`. Imperative subjects. Commits pushed after each meaningful chunk.

## Blockers for Lee
None encountered.
