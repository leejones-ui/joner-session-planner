"use client";
import { useEffect, useRef, useState } from "react";
import type { Block } from "@/lib/schema/session";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";

type Props = {
  block: Block | null;
  onClose: () => void;
  onApply: (updated: Block) => void;
};

const QUICK_EDITS = [
  "Make it harder",
  "Add a progression",
  "Adapt for fewer players",
];

export function AssistantDrawer({ block, onClose, onApply }: Props) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (block) {
      setMessage("");
      setError(null);
      // Autofocus after mount, with a small timer so the drawer finishes painting first on slower devices.
      const t = setTimeout(() => textareaRef.current?.focus(), 40);
      return () => clearTimeout(t);
    }
  }, [block?.id]);

  // Escape closes the drawer.
  useEffect(() => {
    if (!block) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [block, onClose]);

  if (!block) return null;

  async function submit(raw?: string) {
    if (!block) return;
    const text = (raw ?? message).trim();
    if (text.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/assistant-edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ block, message: text }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error ?? `Edit failed (${resp.status})`);
      }
      const data = await resp.json();
      if (data.block) {
        onApply(data.block);
        setMessage("");
        // Scroll the input back into view after the block updates (if drawer stayed open).
        textareaRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Edit failed");
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
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
      <aside
        className={cn(
          "absolute bg-zinc-950 flex flex-col",
          // Mobile: bottom sheet
          "left-0 right-0 bottom-0 max-h-[90vh] rounded-t-2xl border-t border-zinc-800",
          // Desktop: right side drawer
          "sm:top-0 sm:bottom-0 sm:right-0 sm:left-auto sm:max-h-none sm:w-full sm:max-w-md sm:rounded-none sm:border-t-0 sm:border-l sm:border-zinc-800"
        )}
      >
        {/* Drag handle, mobile only */}
        <div className="sm:hidden flex justify-center pt-2">
          <span className="block w-10 h-1 rounded-full bg-zinc-700" />
        </div>

        <header className="p-4 sm:p-5 border-b border-zinc-800 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Edit block</p>
            <h3 className="text-lg font-bold text-zinc-50 mt-0.5 truncate">{block.name}</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-5 space-y-4">
          <p className="text-sm text-zinc-400">
            Ask for anything. Enter to send, Shift+Enter for a new line.
          </p>

          <div className="flex flex-wrap gap-2">
            {QUICK_EDITS.map((q) => (
              <button
                key={q}
                type="button"
                disabled={loading}
                onClick={() => {
                  setMessage(q);
                  submit(q);
                }}
                className="px-3 h-9 rounded-full text-sm font-medium bg-zinc-800 text-zinc-200 border border-zinc-700 hover:border-lime-400 hover:text-lime-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {q}
              </button>
            ))}
          </div>

          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Make it tighter, drop to one touch only."
            rows={5}
            disabled={loading}
          />

          {loading && (
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-lime-400 animate-pulse" />
              <span>Rewriting the block</span>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}
        </div>

        <footer className="p-4 sm:p-5 border-t border-zinc-800 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={() => submit()} disabled={loading || message.trim().length === 0}>
            {loading ? "Applying" : "Apply change"}
          </Button>
        </footer>
      </aside>
    </div>
  );
}
