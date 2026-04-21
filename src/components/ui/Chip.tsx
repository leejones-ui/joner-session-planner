"use client";
import { cn } from "@/lib/utils";

type Props = {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
};

export function Chip({ active, onClick, children, className }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center px-3 h-9 rounded-full text-sm font-medium transition-colors border",
        active
          ? "bg-lime-400 text-zinc-950 border-lime-400"
          : "bg-transparent text-zinc-300 border-zinc-700 hover:border-zinc-500",
        className
      )}
    >
      {children}
    </button>
  );
}
