"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { animated, useSpring } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import { SPRING } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";

interface CompareSliderProps {
  className?: string;
}

const MIN = 5;
const MAX = 95;
const STEP = 5;
const INITIAL = 50;

const ACCENT = "#1d5bd8";
const FLARE = "#e8622c";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** deterministic LCG so the SSR markup and the client hydration match exactly */
function pseudoRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

interface Spike {
  x: number;
  h: number;
  w: number;
}

/** jagged raw-signal polyline: noise floor around `base` plus triangular spikes */
function tracePoints(seed: number, base: number, amp: number, spikes: readonly Spike[]): string {
  const rand = pseudoRandom(seed);
  const pts: string[] = [];
  for (let x = 0; x <= 640; x += 8) {
    let y = base - rand() * amp;
    for (const s of spikes) {
      const t = 1 - Math.abs(x - s.x) / s.w;
      if (t > 0) y -= s.h * t * (0.7 + rand() * 0.3);
    }
    pts.push(`${x},${Math.round(y * 10) / 10}`);
  }
  return pts.join(" ");
}

const RAW_SPIKES: readonly Spike[] = [
  { x: 96, h: 200, w: 36 },
  { x: 308, h: 122, w: 28 },
  { x: 352, h: 88, w: 24 },
  { x: 500, h: 176, w: 32 },
];

const RAW_MAIN = tracePoints(0x5eed, 332, 52, RAW_SPIKES);
const RAW_GHOST = tracePoints(0xbeef, 344, 34, []);

/** interpreted overlay: the same indications resolved as crisp peaks */
const CLEAN_TRACE =
  "M0 332 H80 L96 132 L112 332 H292 L308 212 L324 332 H338 L352 246 L366 332 H484 L500 156 L516 332 H640";

const BASELINE_TICK_XS = Array.from({ length: 9 }, (_, i) => 64 + i * 64);

/**
 * Before/after instrument: raw ultrasonic signal beneath, interpreted scan
 * wiped in from the left. React Spring + use-gesture own the clip-path wipe
 * and the handle position (SPRING.drag physics); no other engine touches
 * them. Keyboard operable via role="slider" (arrows, Home, End); reduced
 * motion disables the drag gesture and applies keyboard moves instantly.
 */
export function CompareSlider({ className }: CompareSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef(INITIAL);
  const [percent, setPercent] = useState(INITIAL);
  const reduced = useReducedMotion();

  const [{ p }, api] = useSpring(() => ({ p: INITIAL, config: SPRING.drag }));

  const bind = useGesture(
    {
      onDrag: ({ xy: [x], last }) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect || rect.width === 0) return;
        const target = clamp(((x - rect.left) / rect.width) * 100, MIN, MAX);
        api.start({ p: target, config: SPRING.drag });
        if (last) {
          const settled = Math.round(target);
          percentRef.current = settled;
          setPercent(settled);
        }
      },
    },
    { enabled: !reduced, drag: { filterTaps: true, pointer: { touch: true } } },
  );

  // reduced motion: freeze the wipe at its current split, gestures already off
  useEffect(() => {
    if (reduced) api.set({ p: percentRef.current });
  }, [reduced, api]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    let next: number;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        next = percentRef.current + STEP;
        break;
      case "ArrowLeft":
      case "ArrowDown":
        next = percentRef.current - STEP;
        break;
      case "Home":
        next = MIN;
        break;
      case "End":
        next = MAX;
        break;
      default:
        return;
    }
    e.preventDefault();
    const target = clamp(next, MIN, MAX);
    percentRef.current = target;
    setPercent(target);
    api.start({ p: target, immediate: reduced, config: SPRING.snap });
  };

  const clipPath = p.to((v) => `inset(0 ${100 - v}% 0 0)`);
  const left = p.to((v) => `${v}%`);

  return (
    <div
      ref={containerRef}
      {...bind()}
      style={{ touchAction: "none" }}
      className={cn(
        "relative aspect-[16/10] select-none overflow-hidden border border-steel/16 bg-ink-2",
        className,
      )}
    >
      {/* raw signal layer (always visible beneath the wipe) */}
      <svg
        aria-hidden
        viewBox="0 0 640 400"
        preserveAspectRatio="none"
        fill="none"
        className="absolute inset-0 h-full w-full"
      >
        {BASELINE_TICK_XS.map((x) => (
          <line key={x} x1={x} y1={332} x2={x} y2={340} stroke="rgba(120,176,240,0.16)" />
        ))}
        <polyline points={RAW_GHOST} fill="none" stroke="rgba(120,176,240,0.25)" strokeWidth={1} />
        <polyline points={RAW_MAIN} fill="none" stroke="rgba(128,144,160,0.6)" strokeWidth={1} />
      </svg>

      {/* interpreted scan layer, clip-path wiped by the spring */}
      <animated.div aria-hidden className="absolute inset-0 bg-ink-2" style={{ clipPath }}>
        <svg
          viewBox="0 0 640 400"
          preserveAspectRatio="none"
          fill="none"
          className="h-full w-full"
        >
          <line x1={0} y1={332} x2={640} y2={332} stroke="rgba(120,176,240,0.28)" />
          {BASELINE_TICK_XS.map((x) => (
            <line key={x} x1={x} y1={332} x2={x} y2={340} stroke="rgba(120,176,240,0.28)" />
          ))}
          <path
            d={CLEAN_TRACE}
            stroke="rgba(120,176,240,0.85)"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          {/* confirmed indication gates */}
          <line x1={308} y1={100} x2={308} y2={332} stroke={ACCENT} strokeWidth={1} strokeDasharray="4 4" />
          <line x1={352} y1={132} x2={352} y2={332} stroke={ACCENT} strokeWidth={1} strokeDasharray="4 4" />
          <path d="M346 122 L358 122 L352 132 Z" fill={ACCENT} />
          {/* the one sanctioned flare alert marker: critical indication */}
          <path d="M302 88 L314 88 L308 98 Z" fill={FLARE} />
        </svg>
      </animated.div>

      {/* corner labels sit above both layers, outside the clip */}
      <span className="pointer-events-none absolute left-4 top-4 z-10 font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-meta">
        RAW SIGNAL
      </span>
      <span className="pointer-events-none absolute right-4 top-4 z-10 font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-steel">
        INTERPRETED SCAN
      </span>

      {/* divider + grip (spring-owned left position) */}
      <animated.div className="absolute inset-y-0 z-20 w-0" style={{ left }}>
        <span aria-hidden className="absolute inset-y-0 w-px -translate-x-1/2 bg-accent" />
        <div
          role="slider"
          tabIndex={0}
          aria-label="Reveal interpreted scan"
          aria-orientation="horizontal"
          aria-valuemin={MIN}
          aria-valuemax={MAX}
          aria-valuenow={percent}
          aria-valuetext={`${percent}% interpreted`}
          onKeyDown={onKeyDown}
          className="absolute left-0 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-accent bg-ink/80 text-steel"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M9 7l-4 5 4 5M15 7l4 5-4 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </animated.div>

      <p className="sr-only">
        Comparison instrument: drag the divider or use the arrow keys to sweep between the raw
        ultrasonic signal and the interpreted scan with its confirmed indications.
      </p>
    </div>
  );
}
