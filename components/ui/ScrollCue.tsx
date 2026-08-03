import { cn } from "@/lib/cn";

/**
 * Sounding-line scroll cue: mono label beside an accent tick that grows from
 * the top and drains from the bottom (the `scroll-cue` keyframes in
 * globals.css; the global reduced-motion rule collapses it to a static tick).
 * The caller owns the display class (`flex`, or a responsive pair like
 * `hidden sm:flex`) so breakpoint visibility stays at the call site.
 */
export function ScrollCue({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "items-center gap-2 font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-meta",
        className,
      )}
    >
      {label}
      <span
        aria-hidden
        className="block h-6 w-px origin-top bg-accent"
        style={{ animation: "scroll-cue 2.2s ease-in-out infinite" }}
      />
    </span>
  );
}
