"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useMotionHold } from "@/components/providers/MotionHold";
import { cn } from "@/lib/cn";

interface MarqueeProps {
  children: ReactNode;
  /** seconds for one full track loop */
  duration?: number;
  className?: string;
  trackClassName?: string;
}

/**
 * Duplicated-track marquee driven ENTIRELY by a CSS keyframes animation
 * (`marquee-x`: translateX 0 to -50%, linear, infinite; utilities in
 * globals.css). No JS animation engine may ever target the track: a GSAP
 * scroll-skew tween on the same element carried `overwrite: true` and
 * KILLED the loop tween on the user's first scroll tick, which shipped a
 * frozen carousel through three production rounds. CSS animations have no
 * cross-tween kill semantics and run on the compositor, so the loop cannot
 * be stopped by any script state.
 *
 * Pause states: hover and focus-within are pure CSS on the `u-marquee`
 * root; the global motion hold and the offscreen gate toggle
 * `u-marquee-paused`. The offscreen gate is an IntersectionObserver, never
 * a ScrollTrigger window (stale reveal-time measurements froze the strip
 * in an earlier round), and it reads the NEWEST record because a fast
 * scroll out-and-back can batch [leave, enter] into one callback.
 * Reduced motion renders a static wrapped strip with no animation at all.
 */
export function Marquee({ children, duration = 32, className, trackClassName }: MarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { held } = useMotionHold();
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reduced) return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries[entries.length - 1].isIntersecting),
      { rootMargin: "120px 0px" },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [reduced]);

  if (reduced) {
    return (
      <div className={cn("flex flex-wrap gap-x-8 gap-y-2", className)}>{children}</div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={cn("u-marquee overflow-hidden", (held || !inView) && "u-marquee-paused", className)}
    >
      <div
        data-marquee-track
        className={cn("u-marquee-track flex w-max items-center", trackClassName)}
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
