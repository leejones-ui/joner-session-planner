# Joner Session Planner

AI football session planner by Joner Football.

Prompt a session. Get a full plan with diagrams. Share by link.

## Quickstart

```bash
pnpm install
cp .env.local.example .env.local
# fill in ANTHROPIC_API_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
pnpm dev
```

Open http://localhost:3000.

## Routes
- `/` home, prompt box, generate button
- `/samples` renders the hand-crafted sample diagrams to validate the renderer
- `/s/[id]` public share view for a saved session

## Supabase
Run the migration in `supabase/migrations/0001_sessions.sql` in your Supabase SQL editor.

## Structure
- `src/lib/schema/` Zod schemas for Diagram, Block, Session
- `src/lib/prompts/` system prompts for the three AI endpoints
- `src/components/pitch/` SVG renderer
- `src/app/api/` three AI endpoints
- `src/samples/` hand-crafted reference diagrams

## AI model
All three endpoints use Claude Opus via the Anthropic SDK, structured output, prompt-cached system prompts. See `src/lib/anthropic.ts`.

## Philosophy
Demo-first. No auth. Mobile-first. Static SVG. Three AI features.

See `CLAUDE.md` for the full brief.
