"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useLoaderGate } from "@/components/providers/LoaderGate";
import { cn } from "@/lib/cn";

/**
 * D2 signature device: a fixed depth-sounding rail in the left gutter
 * (xl screens only). Tick marks via CSS gradient; a mono readout counts the
 * scroll position as sounded depth in metres, and an accent tick tracks
 * progress. Replaces CARLTSOLAS's cartesian measurement grid. Decorative.
 */
export function FathomRail({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { revealed } = useLoaderGate();

  useEffect(() => {
    registerGsap();
    const root = rootRef.current;
    if (!root || reduced || !revealed) return;
    const readout = root.querySelector<HTMLElement>("[data-fathom-readout]");
    const marker = root.querySelector<HTMLElement>("[data-fathom-marker]");
    if (!readout || !marker) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 0,
        end: () => document.documentElement.scrollHeight - window.innerHeight,
        onUpdate: (self) => {
          const meters = Math.round(self.scroll() / 2);
          readout.textContent = `${String(meters).padStart(4, "0")} M`;
          gsap.set(marker, { top: `${(self.progress * 100).toFixed(2)}%` });
        },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced, revealed]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cn(
        "pointer-events-none fixed bottom-24 left-4 top-24 z-30 hidden w-6 xl:block",
        "opacity-0 transition-opacity duration-700",
        revealed && "opacity-100",
        className,
      )}
    >
      {/* rail line with ticks: short every 24px, longer every 96px */}
      <div className="absolute bottom-0 left-2 top-0 w-px bg-steel/16" />
      <div
        className="absolute bottom-0 left-2 top-0 w-2"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(120,176,240,0.28) 0 1px, transparent 1px 24px)",
        }}
      />
      {/* scroll progress marker */}
      <span
        data-fathom-marker
        className="absolute left-0 top-0 h-px w-4 bg-accent transition-none"
      />
      {/* depth readout */}
      <span
        data-fathom-readout
        className="absolute -left-1 top-full mt-3 block rotate-0 font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-meta"
      >
        0000 M
      </span>
    </div>
  );
}
