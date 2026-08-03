"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, type JSAnimation } from "animejs";
import { useMotionHold } from "@/components/providers/MotionHold";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { DUR, STAGGER } from "@/lib/motion";
import { cn } from "@/lib/cn";

interface AScanWaveProps {
  className?: string;
}

/** viewBox palette: steel/accent/meta at design-system hairline alphas */
const STROKE = {
  axis: "rgba(120,176,240,0.28)",
  baseline: "rgba(120,176,240,0.4)",
  echoStrong: "rgba(120,176,240,0.85)",
  echoSoft: "rgba(120,176,240,0.45)",
  label: "rgba(128,144,160,0.5)",
  accent: "#1d5bd8",
} as const;

/** bottom axis ticks every 48px across the 48..624 plot span */
const TICK_XS = Array.from({ length: 13 }, (_, i) => 48 + i * 48);

/** labeled distance ticks, inches along the pipe run */
const TICK_LABELS = [
  { x: 48, label: "0" },
  { x: 240, label: "24" },
  { x: 432, label: "48" },
  { x: 624, label: "72" },
] as const;

/** echo peaks in draw order (left to right); the defect peak is handled apart */
const SEGS = {
  pulse: "M56 240 L76 64 L96 240",
  noiseA: "M158 240 L170 216 L182 240",
  defect: "M296 240 L316 110 L336 240",
  noiseB: "M388 240 L400 215 L412 240",
  backwall: "M484 240 L504 72 L524 240",
} as const;

/** shared attrs for the Anime.js stroke draw-in (pathLength-normalized dash) */
const DRAW = {
  pathLength: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  fill: "none",
} as const;

/**
 * Ultrasonic A-scan trace instrument. Anime.js owns every animated property
 * here: staggered stroke draw-in of the echo peaks on first viewport entry,
 * then a mechanical scaleY oscillation loop on the defect peak (paused by the
 * global HOLD FEED control). Reduced motion renders the completed trace with
 * no animation. Decorative; described for assistive tech via sr-only text.
 */
export function AScanWave({ className }: AScanWaveProps) {
  const ref = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);
  const heldRef = useRef(false);
  const drawRef = useRef<JSAnimation | null>(null);
  const gateRef = useRef<JSAnimation | null>(null);
  const loopRef = useRef<JSAnimation | null>(null);
  const reduced = useReducedMotion();
  const { held } = useMotionHold();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const segs = root.querySelectorAll<SVGPathElement>("[data-ascan-seg]");
    const gate = root.querySelector<SVGGElement>("[data-ascan-gate]");
    const defect = root.querySelector<SVGGElement>("[data-defect]");

    if (reduced) {
      segs.forEach((seg) => seg.style.setProperty("stroke-dashoffset", "0"));
      gate?.style.setProperty("opacity", "1");
      return;
    }

    const play = () => {
      if (playedRef.current) return;
      playedRef.current = true;
      drawRef.current = animate(segs, {
        strokeDashoffset: [1, 0],
        duration: DUR.reveal * 1000,
        delay: stagger(STAGGER.ticks * 1000),
        ease: "outExpo",
        onComplete: () => {
          if (gate) {
            gateRef.current = animate(gate, {
              opacity: [0, 1],
              duration: DUR.fast * 1000,
              ease: "outExpo",
            });
          }
          if (defect) {
            loopRef.current = animate(defect, {
              scaleY: [1, 1.05],
              duration: DUR.slow * 1000,
              alternate: true,
              loop: true,
              ease: "linear",
            });
            if (heldRef.current) loopRef.current.pause();
          }
        },
      });
    };

    const cancelAnimations = () => {
      drawRef.current?.cancel();
      gateRef.current?.cancel();
      loopRef.current?.cancel();
      drawRef.current = null;
      gateRef.current = null;
      loopRef.current = null;
    };

    if (typeof IntersectionObserver === "undefined") {
      play();
      return cancelAnimations;
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
    return () => {
      io.disconnect();
      cancelAnimations();
    };
  }, [reduced]);

  // WCAG 2.2.2: the global HOLD FEED switch pauses the ambient oscillation
  useEffect(() => {
    heldRef.current = held;
    const loop = loopRef.current;
    if (!loop) return;
    if (held) loop.pause();
    else loop.play();
  }, [held]);

  return (
    <div ref={ref} className={cn("relative border border-steel/16 bg-ink-2 p-5", className)}>
      <div aria-hidden className="pointer-events-none">
        <div className="flex items-start justify-between font-mono text-[0.5625rem] uppercase tracking-[0.25em]">
          <span className="text-steel">{"GAIN 62 DB"}</span>
          <span className="text-meta">{'RANGE 2" TO 72"'}</span>
        </div>

        <svg viewBox="0 0 640 300" fill="none" className="mt-3 block w-full">
          {/* axes */}
          <line x1={48} y1={32} x2={48} y2={248} stroke={STROKE.axis} />
          <line x1={40} y1={248} x2={624} y2={248} stroke={STROKE.axis} />
          {TICK_XS.map((x) => (
            <line key={x} x1={x} y1={248} x2={x} y2={254} stroke={STROKE.axis} />
          ))}
          {TICK_LABELS.map(({ x, label }) => (
            <text
              key={x}
              x={x}
              y={268}
              textAnchor="middle"
              fill={STROKE.label}
              className="font-mono"
              style={{ fontSize: 9, letterSpacing: 1 }}
            >
              {label}
            </text>
          ))}

          {/* faint baseline trace */}
          <path d="M48 240 H624" stroke={STROKE.baseline} strokeWidth={1} />

          {/* echo peaks, staggered left-to-right draw-in */}
          <path data-ascan-seg d={SEGS.pulse} stroke={STROKE.echoStrong} strokeWidth={1.5} {...DRAW} />
          <path data-ascan-seg d={SEGS.noiseA} stroke={STROKE.echoSoft} strokeWidth={1} {...DRAW} />
          <g data-defect style={{ transformOrigin: "316px 240px" }}>
            <path data-ascan-seg d={SEGS.defect} stroke={STROKE.accent} strokeWidth={1.5} {...DRAW} />
          </g>
          <path data-ascan-seg d={SEGS.noiseB} stroke={STROKE.echoSoft} strokeWidth={1} {...DRAW} />
          <path data-ascan-seg d={SEGS.backwall} stroke={STROKE.echoStrong} strokeWidth={1.5} {...DRAW} />

          {/* dashed gate bracket + label above the defect peak (fades in after draw) */}
          <g data-ascan-gate style={{ opacity: 0 }}>
            <path d="M288 96 v6 M288 96 h56 M344 96 v6" stroke={STROKE.accent} strokeWidth={1} strokeDasharray="3 3" />
            <text
              x={316}
              y={88}
              textAnchor="middle"
              fill={STROKE.accent}
              className="font-mono"
              style={{ fontSize: 9, letterSpacing: 2 }}
            >
              GATE A
            </text>
          </g>
        </svg>

        <div className="flex justify-end font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-meta">
          <span>{"DEPTH · FT"}</span>
        </div>
      </div>

      <p className="sr-only">
        A-scan ultrasonic trace: initial pulse, two minor echoes, one highlighted defect echo at
        gate A, and the backwall echo plotted as amplitude against distance.
      </p>
    </div>
  );
}
