import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-tight transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-400",
  {
    variants: {
      variant: {
        primary: "bg-lime-400 text-zinc-950 hover:bg-lime-300",
        secondary: "bg-zinc-800 text-zinc-50 hover:bg-zinc-700 border border-zinc-700",
        ghost: "bg-transparent text-zinc-200 hover:bg-zinc-800",
        danger: "bg-red-500 text-white hover:bg-red-400",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5 text-base",
        lg: "h-14 px-7 text-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>;

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant, size, ...rest },
  ref
) {
  return <button ref={ref} className={cn(button({ variant, size }), className)} {...rest} />;
});
