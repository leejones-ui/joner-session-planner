"use client";
import { useEffect, useState } from "react";
import { DiagramSvg } from "./DiagramSvg";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import type { Diagram } from "@/lib/schema/diagram";

type Props = {
  diagram: Diagram;
  title?: string;
};

// Wraps a DiagramSvg with a tap-to-expand overlay. In the overlay, pinch/double-tap/pan work via react-zoom-pan-pinch.
export function DiagramZoomable({ diagram, title }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="relative w-full block group cursor-zoom-in"
        onClick={() => setOpen(true)}
        aria-label={title ? `Expand diagram, ${title}` : "Expand diagram"}
      >
        <DiagramSvg diagram={diagram} className="w-full h-auto block" ariaLabel={title} />
        <span className="absolute top-2 right-2 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Tap to expand
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex flex-col">
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/10">
            <p className="text-sm text-zinc-200 truncate">{title ?? "Diagram"}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-zinc-200 hover:text-white text-sm font-semibold px-3 h-9 rounded-lg bg-white/10 hover:bg-white/20"
            >
              Close
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <TransformWrapper
              initialScale={1}
              minScale={1}
              maxScale={4}
              doubleClick={{ mode: "toggle" }}
              wheel={{ step: 0.2 }}
            >
              <TransformComponent
                wrapperStyle={{ width: "100%", height: "100%" }}
                contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <div className="w-[95vw] max-w-6xl">
                  <DiagramSvg diagram={diagram} className="w-full h-auto block" ariaLabel={title} />
                </div>
              </TransformComponent>
            </TransformWrapper>
          </div>
          <p className="text-center text-xs text-zinc-400 py-2 border-t border-white/10">
            Pinch to zoom, drag to pan, double-tap to reset.
          </p>
        </div>
      )}
    </>
  );
}
