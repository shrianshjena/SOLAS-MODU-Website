"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";

interface TickFrameProps {
  /** bracket arm length in px */
  size?: number;
  /** draw the ticks when the frame enters the viewport (default) or immediately */
  immediate?: boolean;
  className?: string;
}

const CORNERS = [
  "left-0 top-0",
  "right-0 top-0 -scale-x-100",
  "bottom-0 right-0 -scale-x-100 -scale-y-100",
  "bottom-0 left-0 -scale-y-100",
] as const;

/**
 * Reticle corner brackets (the SOLAS MODU card frame): four L-shaped corner
 * ticks that draw in with Anime.js when the element enters the viewport.
 * Purely decorative; hidden from assistive tech. Parent needs `relative`
 * (and `group` for the hover accent).
 */
export function TickFrame({ size = 12, immediate = false, className }: TickFrameProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const playedRef = useRef(false);
  const reduced = useReducedMotion();
  const box = size + 2;

  useEffect(() => {
    const root = ref.current;
    if (!root || playedRef.current) return;
    const lines = root.querySelectorAll("line");
    if (reduced) {
      lines.forEach((l) => l.style.setProperty("stroke-dashoffset", "0"));
      return;
    }

    const play = () => {
      if (playedRef.current) return;
      playedRef.current = true;
      animate(lines, {
        strokeDashoffset: [1, 0],
        duration: 600,
        delay: stagger(40),
        ease: "outExpo",
      });
    };

    if (immediate) {
      play();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          play();
          io.disconnect();
        }
      },
      { rootMargin: "-10% 0px" },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [immediate, reduced]);

  return (
    <span
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 block text-steel/30 transition-colors duration-300 group-hover:text-accent group-focus-visible:text-accent",
        className,
      )}
    >
      {CORNERS.map((pos) => (
        <svg
          key={pos}
          className={cn("absolute", pos)}
          width={box}
          height={box}
          viewBox={`0 0 ${box} ${box}`}
          fill="none"
        >
          <line
            x1="1"
            y1="1"
            x2={size}
            y2="1"
            stroke="currentColor"
            strokeWidth="2"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1}
          />
          <line
            x1="1"
            y1="1"
            x2="1"
            y2={size}
            stroke="currentColor"
            strokeWidth="2"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1}
          />
        </svg>
      ))}
    </span>
  );
}
