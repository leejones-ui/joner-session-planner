@AGENTS.md

# Joner Session Planner

AI football session planner. Coach prompts, we generate a full session with diagrams, sharable by link.

Founded by Lee Jones, Joner Football. Built to beat Sports Session Planner.

## Who it's for
Private coaches, small-group coaches, academy coaches, technical coaches. Mobile-first. Coach on a phone, landscape, sideline.

## Demo moment (the only thing that matters in v1)
Prompt. Generate. Session with diagrams. Share link. PDF (stretch).

## Stack (locked)
- Next.js 16 App Router, TypeScript. Note: Next 16 has breaking changes, see AGENTS.md. Key gotcha: `params` and `searchParams` are promises, must be awaited.
- Tailwind CSS v4, hand-rolled components (no shadcn CLI, same patterns)
- Supabase for persistence (DB only, no auth in v1)
- Anthropic SDK, Claude Opus for all AI calls
- pnpm

## Philosophy (locked, do not drift)
1. Demo-first. Everything outside the demo path is v1.1.
2. No auth. Share by public ID.
3. Mobile-first. Phone landscape on the sideline.
4. Three Claude features in v1: session generator, diagram generator, assistant-edit chat.
5. Static SVG diagrams. No animation. No drill-link extraction. Both deferred.

## Voice and copy (strictly enforced)
Personal, direct, passionate. Short punchy sentences. Coach-to-coach tone.

- "Worldie" = amazing. "Levels" = progress. "Game changer" = genuine impact.
- Banned words: check out, don't miss, link in bio, unlock, elevate.
- CTAs must be specific.
- NEVER em dashes or en dashes. Anywhere. Use commas, colons, or full stops.
- Never mention prices anywhere.

This applies to UI copy, code comments, docs, AND AI system prompts.

## Diagram schema (LOCKED)
Normalized coordinates. x: 0 to 100, west to east. y: 0 to 60, north to south. Rendered deterministically at any size. See `src/lib/schema/diagram.ts`.

## Session schema
Session = { id, title, prompt, objective, blocks: Block[], totalDuration, createdAt }
Block = { id, name, type: warmup | main | game, description, durationMins, coachingPoints, equipment, diagram }

## Three API endpoints
1. POST `/api/generate-session` : prompt, ageGroup?, playerCount?, duration?, focus? returns Session
2. POST `/api/generate-diagram` : blockDescription returns Diagram
3. POST `/api/assistant-edit` : block, message returns modified Block

All endpoints use structured output and prompt-cached system prompts. Prompts live in `src/lib/prompts/` as markdown, loaded at request time.

## Supabase
Single table `sessions`. Public RLS (read + insert). No auth. Migration in `supabase/migrations/`.

## What is NOT in v1
No auth. No login. No accounts. No saved-session library. No prompt history. No animation. No drill-link extraction. No deploy (Lee deploys).

## Code style
- Simple over clever. No abstractions for things used once.
- Comment the WHY not the WHAT.
- Tailwind utilities over custom CSS.
- Never hardcode secrets. Env vars only.

## Commits
Imperative subjects. "Add SVG renderer" not "Added". Commit often.
