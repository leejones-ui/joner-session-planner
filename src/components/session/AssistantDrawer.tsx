"use client";
import { useEffect, useState } from "react";
import type { Block } from "@/lib/schema/session";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";

type Props = {
  block: Block | null;
  onClose: () => void;
  onApply: (updated: Block) => void;
};

export function AssistantDrawer({ block, onClose, onApply }: Props) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (block) {
      setMessage("");
      setError(null);
    }
  }, [block?.id]);

  if (!block) return null;

  async function submit() {
    if (!block || message.trim().length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/assistant-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ block, message }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error ?? `Edit failed (${resp.status})`);
      }
      const data = await resp.json();
      if (data.block) onApply(data.block);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Edit failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close editor"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-zinc-950 border-l border-zinc-800 flex flex-col">
        <header className="p-4 sm:p-5 border-b border-zinc-800 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Edit block</p>
            <h3 className="text-lg font-bold text-zinc-50 mt-0.5">{block.name}</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-5 space-y-3">
          <p className="text-sm text-zinc-400">Ask for anything. Make it harder. Swap to a half pitch. Add a defender. Scale for 8 players.</p>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Make it tighter, drop to one touch only."
            rows={5}
          />
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}
        </div>

        <footer className="p-4 sm:p-5 border-t border-zinc-800 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={loading || message.trim().length === 0}>
            {loading ? "Applying" : "Apply change"}
          </Button>
        </footer>
      </aside>
    </div>
  );
}
