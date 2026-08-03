import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "steel" | "flare" | "meta";

const TONES: Record<Tone, string> = {
  steel: "border-steel/40 text-steel",
  flare: "border-flare/45 text-flare",
  meta: "border-white/15 text-meta",
};

/** Outlined monospace tag chip. */
export function TagChip({
  children,
  tone = "steel",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.18em]",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
