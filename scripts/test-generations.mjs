// Test generations. Run with: node scripts/test-generations.mjs
// Requires a local dev server at http://localhost:3000 with ANTHROPIC_API_KEY set.
// Writes one JSON file per prompt to test-outputs/.

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const HOST = process.env.HOST ?? "http://localhost:3000";

const PROMPTS = [
  {
    id: "u10-first-touch",
    body: { prompt: "U10 first touch under pressure, 8 players, 45 mins", ageGroup: "U10", playerCount: 8, duration: 45, focus: "First touch" },
  },
  {
    id: "private-1v1-striker",
    body: { prompt: "Private 1on1 session, 13 year old striker, finishing focus, 30 mins", playerCount: 1, duration: 30, focus: "Finishing" },
  },
  {
    id: "small-group-4v4",
    body: { prompt: "Small group 4v4, mixed ability, 60 mins, rainy", playerCount: 8, duration: 60 },
  },
];

async function run() {
  const outDir = path.join(process.cwd(), "test-outputs");
  await mkdir(outDir, { recursive: true });

  for (const t of PROMPTS) {
    console.log(`\n=== ${t.id} ===`);
    console.log("Prompt:", t.body.prompt);
    const start = Date.now();

    const sessResp = await fetch(`${HOST}/api/generate-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(t.body),
    });
    if (!sessResp.ok) {
      const err = await sessResp.text();
      console.error(`Session gen failed: ${sessResp.status} ${err}`);
      await writeFile(path.join(outDir, `${t.id}.error.txt`), `${sessResp.status}\n${err}`);
      continue;
    }
    const session = await sessResp.json();
    console.log(`Session: ${session.title}, ${session.blocks.length} blocks, ${session.totalDuration} min (${Date.now() - start}ms)`);

    // Fan out diagram calls
    const diagramStart = Date.now();
    const diagramed = await Promise.all(
      session.blocks.map(async (b) => {
        const r = await fetch(`${HOST}/api/generate-diagram`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            blockDescription: `${b.name}. ${b.description}`,
            blockType: b.type,
            playerCount: t.body.playerCount,
          }),
        });
        if (!r.ok) {
          const err = await r.text();
          console.warn(`Diagram failed for block ${b.id}: ${r.status} ${err}`);
          return b;
        }
        const data = await r.json();
        return data.diagram ? { ...b, diagram: data.diagram } : b;
      })
    );
    session.blocks = diagramed;
    console.log(`Diagrams done in ${Date.now() - diagramStart}ms`);

    const outPath = path.join(outDir, `${t.id}.json`);
    await writeFile(outPath, JSON.stringify(session, null, 2));
    console.log(`Saved: ${outPath}`);

    // Also log a summary for quick review.
    const summary = [
      `=== ${t.id} ===`,
      `Prompt: ${t.body.prompt}`,
      `Title: ${session.title}`,
      `Objective: ${session.objective}`,
      `Total: ${session.totalDuration} min across ${session.blocks.length} blocks`,
      "",
      ...session.blocks.flatMap((b) => [
        `--- ${b.type.toUpperCase()}: ${b.name} (${b.durationMins} min) ---`,
        b.description,
        "Coaching points:",
        ...b.coachingPoints.map((p) => `  - ${p}`),
        "Equipment:",
        ...b.equipment.map((e) => `  - ${e}`),
        `Diagram: pitch=${b.diagram?.pitch?.preset}, players=${b.diagram?.players?.length ?? 0}, arrows=${b.diagram?.arrows?.length ?? 0}, cones=${b.diagram?.cones?.length ?? 0}`,
        "",
      ]),
    ].join("\n");
    await writeFile(path.join(outDir, `${t.id}.summary.txt`), summary);
  }
  console.log("\nAll done.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
