import { notFound } from "next/navigation";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { Session } from "@/lib/schema/session";
import { BlockCard } from "@/components/session/BlockCard";

export const revalidate = 0;

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SharedSessionPage({ params }: Props) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-50 px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold">Sharing not configured</h1>
          <p className="text-zinc-400 mt-2">Set Supabase env vars to enable shared sessions.</p>
        </div>
      </main>
    );
  }

  const supabase = getSupabase();
  const { data, error } = await supabase.from("sessions").select("*").eq("id", id).maybeSingle();
  if (error || !data) notFound();

  const sessionRaw = {
    id: data.id,
    prompt: data.prompt ?? "",
    title: data.title ?? "Untitled session",
    objective: data.objective ?? "",
    blocks: data.blocks ?? [],
    totalDuration: data.total_duration ?? 0,
    createdAt: data.created_at,
  };
  const parsed = Session.safeParse(sessionRaw);
  if (!parsed.success) notFound();
  const session = parsed.data;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-lime-400" />
            <span className="text-sm font-semibold tracking-wider uppercase text-zinc-400">
              Joner Session Planner
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">{session.title}</h1>
          <p className="mt-3 text-lg text-zinc-300 max-w-3xl leading-relaxed">{session.objective}</p>
          <p className="mt-2 text-sm text-zinc-500">{session.totalDuration} minutes, {session.blocks.length} blocks</p>
        </header>

        <div className="space-y-4">
          {session.blocks.map((b) => (
            <BlockCard key={b.id} block={b} />
          ))}
        </div>

        <footer className="mt-10 pt-6 border-t border-zinc-800 text-sm text-zinc-500">
          <a className="text-lime-400 hover:text-lime-300 font-medium" href="/">Plan your own session</a>
        </footer>
      </div>
    </main>
  );
}
