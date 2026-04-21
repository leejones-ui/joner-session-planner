# test-outputs

Outputs from `scripts/test-generations.mjs`. Gitignored per-run so they don't clutter the repo.

## How to run
1. Ensure `.env.local` has `ANTHROPIC_API_KEY` set.
2. In one terminal: `pnpm dev` (server at http://localhost:3000 by default).
3. In another terminal: `pnpm test:generations`.

Each prompt writes two files:
- `<id>.json` : full session (blocks + diagrams) as returned by the API.
- `<id>.summary.txt` : quick text summary for reading without a JSON viewer.

## Default prompts
- `u10-first-touch` : "U10 first touch under pressure, 8 players, 45 mins"
- `private-1v1-striker` : "Private 1on1 session, 13 year old striker, finishing focus, 30 mins"
- `small-group-4v4` : "Small group 4v4, mixed ability, 60 mins, rainy"

Edit `scripts/test-generations.mjs` to change these.

## Why not run overnight?
The overnight autonomous build did not have permission to touch the Anthropic API key, so live test generations were deferred. Prompts were still tuned (see `src/lib/prompts/session-generator.md` and `src/lib/prompts/diagram-generator.md`).
