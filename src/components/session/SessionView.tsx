"use client";
import type { Block, Session } from "@/lib/schema/session";
import { BlockCard } from "./BlockCard";

type Props = {
  session: Session;
  diagramLoading?: Set<string>;
  onEditBlock?: (block: Block) => void;
  shareUrl?: string;
};

export function SessionView({ session, diagramLoading, onEditBlock, shareUrl }: Props) {
  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-50">{session.title}</h2>
        <p className="text-lg text-zinc-300 max-w-3xl leading-relaxed">{session.objective}</p>
        <div className="flex items-center gap-4 text-sm text-zinc-400 flex-wrap">
          <span>{session.totalDuration} minutes total</span>
          <span className="text-zinc-700">|</span>
          <span>{session.blocks.length} blocks</span>
          {shareUrl && (
            <>
              <span className="text-zinc-700">|</span>
              <a href={shareUrl} className="text-lime-400 hover:text-lime-300 font-medium">Share link</a>
            </>
          )}
        </div>
      </header>

      <div className="space-y-4">
        {session.blocks.map((block) => (
          <BlockCard
            key={block.id}
            block={block}
            diagramLoading={diagramLoading?.has(block.id)}
            onEdit={onEditBlock}
          />
        ))}
      </div>
    </div>
  );
}
