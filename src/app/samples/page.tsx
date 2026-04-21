import { DiagramSvg } from "@/components/pitch/DiagramSvg";
import { SAMPLES } from "@/samples";

export const metadata = {
  title: "Sample diagrams, Joner Session Planner",
};

export default function SamplesPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 px-4 py-10 sm:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Sample diagrams</h1>
        <p className="text-zinc-400 mb-8">Hand-crafted references. Used to validate the SVG renderer.</p>
        <div className="grid grid-cols-1 gap-8">
          {SAMPLES.map((s) => (
            <section key={s.id} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <h2 className="text-lg font-semibold mb-3">{s.title}</h2>
              <div className="w-full rounded-lg overflow-hidden bg-black">
                <DiagramSvg diagram={s.diagram} className="w-full h-auto" ariaLabel={s.title} />
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
