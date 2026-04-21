"use client";
import { useState } from "react";
import type { Block } from "@/lib/schema/session";
import { DiagramZoomable } from "@/components/pitch/DiagramZoomable";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

type Props = {
  block: Block;
  diagramLoading?: boolean;
  onEdit?: (block: Block) => void;
};

const TYPE_LABELS: Record<Block["type"], string> = {
  warmup: "Warm-up",
  main: "Main",
  game: "Game",
};

const TYPE_BADGE: Record<Block["type"], string> = {
  warmup: "bg-amber-400 text-amber-950",
  main: "bg-lime-400 text-lime-950",
  game: "bg-cyan-400 text-cyan-950",
};

export function BlockCard({ block, diagramLoading, onEdit }: Props) {
  const [showDetails, setShowDetails] = useState(true);
  return (
    <article className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
      <header className="flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("text-xs font-bold tracking-wide uppercase px-2 py-0.5 rounded-full", TYPE_BADGE[block.type])}>
              {TYPE_LABELS[block.type]}
            </span>
            <span className="text-sm text-zinc-400">{block.durationMins} min</span>
          </div>
          <h3 className="text-xl font-bold text-zinc-50 tracking-tight truncate">{block.name}</h3>
        </div>
        {onEdit && (
          <Button variant="secondary" size="sm" onClick={() => onEdit(block)}>
            Edit
          </Button>
        )}
      </header>

      <div className="relative bg-black">
        {diagramLoading ? (
          <div className="aspect-[100/60] w-full flex items-center justify-center bg-zinc-950">
            <div className="flex items-center gap-3 text-zinc-400">
              <span className="inline-block w-3 h-3 rounded-full bg-lime-400 animate-pulse" />
              <span>Drawing diagram</span>
            </div>
          </div>
        ) : (
          <DiagramZoomable diagram={block.diagram} title={block.name} />
        )}
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        <p className="text-zinc-200 leading-relaxed">{block.description}</p>

        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          className="text-sm font-medium text-lime-400 hover:text-lime-300"
        >
          {showDetails ? "Hide coaching details" : "Show coaching details"}
        </button>

        {showDetails && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Coaching points</h4>
              <ul className="space-y-1.5">
                {block.coachingPoints.map((p, i) => (
                  <li key={i} className="text-sm text-zinc-100 flex gap-2">
                    <span className="text-lime-400 mt-0.5">&bull;</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Equipment</h4>
              <ul className="space-y-1.5">
                {block.equipment.map((e, i) => (
                  <li key={i} className="text-sm text-zinc-100 flex gap-2">
                    <span className="text-zinc-500 mt-0.5">&bull;</span>
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
