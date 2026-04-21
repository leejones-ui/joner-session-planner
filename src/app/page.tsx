"use client";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { SessionView } from "@/components/session/SessionView";
import { AssistantDrawer } from "@/components/session/AssistantDrawer";
import type { Block, Session } from "@/lib/schema/session";

const DURATIONS = [30, 45, 60, 75, 90];
const AGE_GROUPS = ["U8", "U10", "U12", "U14", "U16", "Senior"];
const FOCUSES = [
  "Finishing",
  "Passing",
  "First touch",
  "Dribbling",
  "Pressing",
  "Defending",
  "Possession",
  "Counter attack",
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [ageGroup, setAgeGroup] = useState<string | undefined>();
  const [playerCount, setPlayerCount] = useState<number | undefined>();
  const [duration, setDuration] = useState<number | undefined>();
  const [focus, setFocus] = useState<string | undefined>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [diagramLoading, setDiagramLoading] = useState<Set<string>>(new Set());

  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const savedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!session) return;
    if (diagramLoading.size > 0) return;
    if (savedIdRef.current === session.id) return;
    savedIdRef.current = session.id;
    (async () => {
      try {
        const r = await fetch("/api/save-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(session),
        });
        if (r.ok) {
          setShareUrl(`/s/${session.id}`);
        }
      } catch {
        // ignore, share is best-effort
      }
    })();
  }, [session, diagramLoading]);

  async function generate() {
    if (prompt.trim().length < 3) {
      setError("Type a prompt first. Example: finishing under pressure for U12.");
      return;
    }
    setError(null);
    setLoading(true);
    setSession(null);
    setShareUrl(null);
    savedIdRef.current = null;
    setDiagramLoading(new Set());

    try {
      const resp = await fetch("/api/generate-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, ageGroup, playerCount, duration, focus }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${resp.status})`);
      }
      const s: Session = await resp.json();
      setSession(s);
      setDiagramLoading(new Set(s.blocks.map((b) => b.id)));

      // Fan out diagram calls. Update state as each lands, so the UI fills in progressively.
      s.blocks.forEach(async (block) => {
        try {
          const r = await fetch("/api/generate-diagram", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              blockDescription: `${block.name}. ${block.description}`,
              blockType: block.type,
              playerCount,
            }),
          });
          const data = await r.json();
          if (data.diagram) {
            setSession((curr) => {
              if (!curr) return curr;
              return {
                ...curr,
                blocks: curr.blocks.map((b) => (b.id === block.id ? { ...b, diagram: data.diagram } : b)),
              };
            });
          }
        } catch {
          // Leave empty diagram on failure, user can retry via edit.
        } finally {
          setDiagramLoading((curr) => {
            const next = new Set(curr);
            next.delete(block.id);
            return next;
          });
        }
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function applyEdit(updated: Block) {
    setSession((curr) => {
      if (!curr) return curr;
      return { ...curr, blocks: curr.blocks.map((b) => (b.id === updated.id ? updated : b)) };
    });
    setEditingBlock(null);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-8 sm:mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-lime-400" />
              <span className="text-sm font-semibold tracking-wider uppercase text-zinc-400">Joner Session Planner</span>
            </div>
            <a href="/samples" className="text-sm text-zinc-400 hover:text-zinc-200">Samples</a>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05]">
            Plan a session in <span className="text-lime-400">seconds</span>.
          </h1>
          <p className="mt-4 text-lg text-zinc-300 max-w-2xl">
            Tell us what you want to coach. We build the full session, diagrams and all.
          </p>
        </header>

        <section className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-6 space-y-5">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Finishing under pressure for U12s, 12 players, 60 minutes. Focus on first touch into a shot."
            rows={4}
            aria-label="Session prompt"
          />

          <div className="space-y-3">
            <ChipRow label="Age">
              {AGE_GROUPS.map((a) => (
                <Chip key={a} active={ageGroup === a} onClick={() => setAgeGroup(ageGroup === a ? undefined : a)}>
                  {a}
                </Chip>
              ))}
            </ChipRow>

            <ChipRow label="Players">
              {[6, 8, 10, 12, 14, 16, 18, 22].map((n) => (
                <Chip key={n} active={playerCount === n} onClick={() => setPlayerCount(playerCount === n ? undefined : n)}>
                  {n}
                </Chip>
              ))}
            </ChipRow>

            <ChipRow label="Duration">
              {DURATIONS.map((d) => (
                <Chip key={d} active={duration === d} onClick={() => setDuration(duration === d ? undefined : d)}>
                  {d} min
                </Chip>
              ))}
            </ChipRow>

            <ChipRow label="Focus">
              {FOCUSES.map((f) => (
                <Chip key={f} active={focus === f} onClick={() => setFocus(focus === f ? undefined : f)}>
                  {f}
                </Chip>
              ))}
            </ChipRow>
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-zinc-500">
              Chips are optional, use them to steer the plan.
            </p>
            <Button size="lg" onClick={generate} disabled={loading}>
              {loading ? "Planning your session" : "Generate session"}
            </Button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}
        </section>

        {session && (
          <section className="mt-10">
            <SessionView
              session={session}
              diagramLoading={diagramLoading}
              onEditBlock={(b) => setEditingBlock(b)}
              shareUrl={shareUrl ?? undefined}
            />
          </section>
        )}
      </div>

      <AssistantDrawer
        block={editingBlock}
        onClose={() => setEditingBlock(null)}
        onApply={applyEdit}
      />
    </main>
  );
}

function ChipRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 w-16 shrink-0">{label}</span>
      <div className="flex gap-2 flex-wrap">{children}</div>
    </div>
  );
}
