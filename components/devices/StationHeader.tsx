"use client";

import { useEffect, useRef, useState } from "react";
import { Decode } from "@/components/ui/Decode";
import { cn } from "@/lib/cn";

interface StationHeaderProps {
  /** mono eyebrow, e.g. "STN 03 / ADVANCED NDT" */
  eyebrow: string;
  /** optional right-aligned mono meta, e.g. "BRG 045° · REV 2026.07" */
  meta?: string;
  /** light surface variant (slate text instead of steel) */
  onLight?: boolean;
  className?: string;
}

/**
 * D4 signature device: hollow ring marker + mono eyebrow + hairline running to
 * the container edge with a terminal tick. The ring fills accent once the
 * section is in view.
 */
export function StationHeader({ eyebrow, meta, onLight = false, className }: StationHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "-15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("flex items-center gap-3", className)}>
      <span
        aria-hidden
        className={cn(
          "h-3 w-3 shrink-0 rounded-full border-2 border-accent transition-colors duration-500",
          inView && "bg-accent",
        )}
      />
      <Decode
        text={eyebrow}
        className={cn(
          "shrink-0 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.22em]",
          onLight ? "text-slate" : "text-steel",
        )}
      />
      <span aria-hidden className="relative h-px min-w-8 flex-1 bg-steel/16">
        <span className="absolute right-0 top-1/2 h-[7px] w-px -translate-y-1/2 bg-steel/28" />
      </span>
      {meta && (
        <span
          className={cn(
            "hidden shrink-0 font-mono text-[0.5625rem] uppercase tracking-[0.25em] sm:block",
            onLight ? "text-slate/70" : "text-meta",
          )}
        >
          {meta}
        </span>
      )}
    </div>
  );
}
