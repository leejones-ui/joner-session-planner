# Progress log

## LIVE URL
https://joner-session-planner.vercel.app

Environment variables are intentionally NOT set in Vercel yet. Lee adds them via the dashboard in the morning.
- `ANTHROPIC_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Without keys: `/` and `/samples` both render. `/samples` is the visual smoke test. Clicking Generate without keys returns a clear error banner.

---

Build nights:
- Night 1: 2026-04-21, scaffold + schemas + renderer + three Claude endpoints + UI + share route
- Night 2: 2026-04-22, Vercel deploy + Day 4 to Day 7 polish + prompt tuning

See `git log --oneline` for the full commit trail.

## Decisions
- Next.js 16.2 (scaffold default, brief asked 14+). Note: `params` is now a Promise in route handlers and pages, must be awaited.
- Tailwind v4 (scaffold default).
- Anthropic SDK 0.90, Zod 4.3 (native `z.toJSONSchema()` used for tool schemas), Supabase JS 2.104.
- Claude model: `claude-opus-4-7`. Fallback `claude-sonnet-4-6`. Env override: `CLAUDE_MODEL`.
- Skipped shadcn CLI, hand-rolled components. Same patterns, less ceremony.
- Tool use with forced `tool_choice` for all three endpoints, structured output lands as a tool call, Zod-validated server side.
- Prompt caching on: system prompts marked `cache_control: ephemeral`.
- Save to Supabase fires client-side once all diagrams have landed.
- Share, PDF, QR, WhatsApp all client-side. No extra API roundtrips.
- PDF export uses a print stylesheet + `window.print()`. Smaller, faster, no heavy PDF deps, works on every phone.
- Rate limit: in-memory Map in the generate endpoint, 10 sessions per IP per hour. Good for v1, swap to Redis when traffic grows.

## Night 2 additions
- Vercel linked to `leejones-6826s-projects/joner-session-planner`, GitHub connected, production URL live.
- Assistant drawer: autofocus, Enter to send, Shift+Enter newline, loading indicator, 3 quick-edit chips.
- Share popover (top right of session): Copy link, WhatsApp share, QR code (SVG, no heavy image lib).
- PDF export: Download button, print-optimized layout, JF monogram placeholder, one session per page range.
- Mobile landscape: tap-to-expand diagrams (fullscreen with native pinch-zoom), bottom sheet drawer on narrow screens, sticky generate CTA.
- Hero tagline, "How it works" strip, footer.
- Favicon (red JF monogram SVG placeholder).
- Open Graph meta (title, description, og:image placeholder).
- Rate limit in `/api/generate-session`: 10 per IP per hour, friendly 429 message.
- Prompt tuning: session-generator now biases to small-group/individual work, defaults to 8 players, includes Joner's coaching bias (1v1s, technical, first touch, repeatable reps) and a banned textbook-phrase list. Diagram generator tightened with hard anchor rules on arrows (never floating), small-group pattern examples, stricter clarity caps.
- Live test generations NOT run overnight: the autonomous agent did not have permission to touch the Anthropic API key (per Lee's own instruction earlier in the thread). The test script is ready at `scripts/test-generations.mjs` and wired as `pnpm test:generations`. Lee can run it locally after adding his key to `.env.local`. The script runs the three prompts from the brief (U10 first touch, private 1v1 striker, small-group 4v4 rainy) and writes per-prompt JSON + text summaries to `test-outputs/`.

## Finish line checks (verified Night 2, production)
- Local `pnpm build` passes.
- Vercel production build passes, 10 routes live including `/icon.svg` and `/opengraph-image`.
- `/` returns HTTP 200, hero tagline rendered.
- `/samples` returns HTTP 200, 5 SVGs rendered.
- `/icon.svg` returns HTTP 200.
- `/opengraph-image` returns HTTP 200 (dynamic PNG via `next/og`).
- Rate limit verified live: 11th POST to `/api/generate-session` from same IP returns `429`.
- `pnpm exec tsc --noEmit` clean.

## What Lee should test first in the morning
1. Visit https://joner-session-planner.vercel.app, confirm `/samples` looks right.
2. Add env vars in the Vercel dashboard for `joner-session-planner`:
   - `ANTHROPIC_API_KEY` (Lee's key)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   Trigger a redeploy from the dashboard.
3. Run the Supabase migration in the new project: `supabase/migrations/0001_sessions.sql`.
4. Generate a session on the live site. Watch:
   - Voice quality (any slips? tune `src/lib/prompts/voice-guide.md`)
   - Diagram quality (muddy? tune `src/lib/prompts/diagram-generator.md`)
   - Share popover: Copy, WhatsApp, QR
   - PDF download
   - Edit drawer + quick-edit chips
5. On a phone, rotate to landscape, try tap-to-expand on a diagram (pinch to zoom, drag to pan, double-tap to reset).
6. Run `pnpm test:generations` locally to validate the three canonical prompts. If outputs are weak, tune `src/lib/prompts/*.md` and rerun.

## Things Lee might want to adjust before filming
- JF monogram SVG in `public/jf-monogram.svg` is a placeholder red JF mark. Swap for the real asset.
- OG image `public/og-image.png` is a placeholder. Replace with a branded 1200x630 asset.
- Prompts in `src/lib/prompts/`: first drafts, refine after seeing live Claude output.
- `plan.jonerfootball.com` not wired yet. Lee points DNS at the Vercel project when ready.

## Known v1 limits (deliberate)
- No auth, login, account.
- No saved-session library.
- No prompt history.
- Static SVG only, no animation.
- No drill-link extraction.
- Share + save requires Supabase configured. UI hides the share link if not.
- Rate limit is in-memory per server instance. Vercel serverless restarts reset counters. Good enough for v1.

## Blockers for Lee
None.
