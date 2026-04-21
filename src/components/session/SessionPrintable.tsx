import type { Session } from "@/lib/schema/session";
import { DiagramSvg } from "@/components/pitch/DiagramSvg";
import { JFMonogram } from "@/components/brand/JFMonogram";

const TYPE_LABELS: Record<Session["blocks"][number]["type"], string> = {
  warmup: "Warm-up",
  main: "Main",
  game: "Game",
};

// Print-only layout. Designed for browser "Save as PDF" via window.print().
// Uses explicit black-on-white styles, no dark mode, no shadows, clean breaks between blocks.
export function SessionPrintable({ session }: { session: Session }) {
  return (
    <div className="p-6" style={{ color: "#111", background: "#fff" }}>
      <header className="flex items-center justify-between pb-4 border-b border-black/20">
        <div className="flex items-center gap-3">
          <JFMonogram className="w-10 h-10" />
          <div>
            <p className="text-xs uppercase tracking-wider text-black/60">Joner Football</p>
            <h1 className="text-2xl font-bold">{session.title}</h1>
          </div>
        </div>
        <div className="text-right text-xs text-black/60">
          <p>{session.totalDuration} minutes</p>
          <p>{session.blocks.length} blocks</p>
        </div>
      </header>

      <p className="mt-4 text-base leading-relaxed">{session.objective}</p>

      <div className="mt-6 space-y-6">
        {session.blocks.map((b) => (
          <section key={b.id} className="pb-6" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
            <div className="flex items-baseline justify-between mb-2">
              <h2 className="text-xl font-bold">
                <span className="text-xs font-bold uppercase tracking-wider mr-2 px-2 py-0.5 rounded-full" style={{ background: "#111", color: "#fff" }}>
                  {TYPE_LABELS[b.type]}
                </span>
                {b.name}
              </h2>
              <span className="text-sm text-black/60">{b.durationMins} min</span>
            </div>
            <div className="w-full rounded border border-black/30 overflow-hidden mb-3" style={{ background: "#0f5132" }}>
              <DiagramSvg diagram={b.diagram} className="w-full h-auto block" ariaLabel={b.name} />
            </div>
            <p className="text-sm leading-relaxed mb-3">{b.description}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-black/60 mb-1">Coaching points</h3>
                <ul className="list-disc pl-5 text-sm space-y-0.5">
                  {b.coachingPoints.map((p, i) => (<li key={i}>{p}</li>))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-black/60 mb-1">Equipment</h3>
                <ul className="list-disc pl-5 text-sm space-y-0.5">
                  {b.equipment.map((e, i) => (<li key={i}>{e}</li>))}
                </ul>
              </div>
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-8 pt-4 border-t border-black/20 text-xs text-black/60">
        Made by Joner Football. Visit jonerfootball.com.
      </footer>
    </div>
  );
}
