import { cn } from "@/lib/utils";
import { forwardRef, type TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { className, ...rest },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-50 placeholder:text-zinc-500 px-4 py-3 text-base leading-relaxed resize-none focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/30 transition-colors",
        className
      )}
      {...rest}
    />
  );
});
