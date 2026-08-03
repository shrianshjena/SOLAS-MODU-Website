"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";

interface CounterProps {
  /** display value, e.g. "25+", "2029", "45+" (leading integer animates) */
  value: string;
  className?: string;
  /** seconds */
  duration?: number;
}

/**
 * Stat tick-up: the leading integer counts from 0 with snapped values
 * (tabular-nums keeps digits steady); any prefix/suffix renders statically.
 * Non-numeric values render as-is.
 */
export function Counter({ value, className, duration = 1.6 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const match = value.match(/^(\D*)(\d+)([\s\S]*)$/);

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    // recompute inside the effect: the render-time match is a fresh object
    // every render and would retrigger the effect if listed as a dependency
    const effectMatch = value.match(/^(\D*)(\d+)([\s\S]*)$/);
    if (!el || !effectMatch || reduced) return;
    const target = Number(effectMatch[2]);
    const numEl = el.querySelector<HTMLElement>("[data-counter-num]");
    if (!numEl) return;

    const ctx = gsap.context(() => {
      const state = { n: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () =>
          gsap.to(state, {
            n: target,
            duration,
            ease: EASE.soft,
            snap: { n: 1 },
            onUpdate: () => {
              numEl.textContent = String(Math.round(state.n));
            },
          }),
      });
    }, el);
    return () => ctx.revert();
  }, [value, reduced, duration]);

  if (!match) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      <span className="sr-only">{value}</span>
      <span aria-hidden>
        {match[1]}
        <span data-counter-num>{reduced ? match[2] : "0"}</span>
        {match[3]}
      </span>
    </span>
  );
}
