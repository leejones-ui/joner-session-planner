"use client";
import type { Block, Session } from "@/lib/schema/session";
import { BlockCard } from "./BlockCard";
import { SharePopover } from "./SharePopover";
import { Button } from "@/components/ui/Button";
import { SessionPrintable } from "./SessionPrintable";

type Props = {
  session: Session;
  diagramLoading?: Set<string>;
  onEditBlock?: (block: Block) => void;
  shareUrl?: string;
  onRequestSave?: () => Promise<string | undefined>;
};

export function SessionView({ session, diagramLoading, onEditBlock, shareUrl, onRequestSave }: Props) {
  function onPrint() {
    if (typeof window !== "undefined") window.print();
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between no-print">
        <div className="space-y-3 min-w-0">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-50">{session.title}</h2>
          <p className="text-lg text-zinc-300 max-w-3xl leading-relaxed">{session.objective}</p>
          <div className="flex items-center gap-4 text-sm text-zinc-400 flex-wrap">
            <span>{session.totalDuration} minutes total</span>
            <span className="text-zinc-700">|</span>
            <span>{session.blocks.length} blocks</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="secondary" size="sm" onClick={onPrint}>Download PDF</Button>
          <SharePopover shareUrl={shareUrl} title={session.title} onRequestSave={onRequestSave} />
        </div>
      </header>

      <div className="space-y-4 no-print">
        {session.blocks.map((block) => (
          <BlockCard
            key={block.id}
            block={block}
            diagramLoading={diagramLoading?.has(block.id)}
            onEdit={onEditBlock}
          />
        ))}
      </div>

      {/* Hidden on screen, shown only when printing. Ensures a clean print layout without dev chrome. */}
      <div className="hidden print:block">
        <SessionPrintable session={session} />
      </div>
    </div>
  );
}
