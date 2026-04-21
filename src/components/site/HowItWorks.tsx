const STEPS = [
  {
    n: 1,
    title: "Type what you want",
    body: "Age group, players, focus. One line is enough.",
  },
  {
    n: 2,
    title: "Get a full session",
    body: "Warm-up, mains, game. Diagrams, coaching points, equipment.",
  },
  {
    n: 3,
    title: "Edit, share, done",
    body: "Chat to refine any block. Share a link. Download a PDF.",
  },
];

export function HowItWorks() {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">How it works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {STEPS.map((s) => (
          <div key={s.n} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-lime-400 text-zinc-950 font-black text-sm mb-3">
              {s.n}
            </span>
            <h3 className="text-lg font-bold text-zinc-50 mb-1">{s.title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
