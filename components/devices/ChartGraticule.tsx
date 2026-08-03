"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";

/**
 * D6 device: passage-chart plotting field behind STN 02. A sparse graticule
 * rendered as datum crosses (only two reference hairlines survive as full
 * lines), real Mumbai-station coordinate labels, scattered spot-depth
 * soundings, and one dashed plotted vessel track with waypoints and a course
 * label. Chart furniture, not a mesh: no closed loops (unlike ContourField)
 * and no uniform cartesian grid. Drifts slowly with scroll (parallax
 * translateY only, GSAP-owned); radially masked; decorative.
 */

/** implied graticule net; crosses render at intersections, not full lines */
const NET_COLS = [180, 420, 660, 900];
const NET_ROWS = [120, 300, 480];
/** the two intersections carried by real reference hairlines */
const REF_MERIDIAN = 660;
const REF_PARALLEL = 300;
const CROSS_ARM = 5;

/** chart-style spot depths, graded brighter toward the mask focus */
const SOUNDINGS: Array<{ x: number; y: number; depth: string; alpha: number }> = [
  { x: 265, y: 205, depth: "84", alpha: 0.32 },
  { x: 520, y: 150, depth: "102", alpha: 0.4 },
  { x: 735, y: 255, depth: "126", alpha: 0.45 },
  { x: 350, y: 345, depth: "97", alpha: 0.35 },
  { x: 815, y: 395, depth: "143", alpha: 0.3 },
  { x: 585, y: 465, depth: "118", alpha: 0.3 },
  { x: 140, y: 430, depth: "76", alpha: 0.25 },
];

export function ChartGraticule({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: "none",
          scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: 0.6 },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox="0 0 1000 560"
      preserveAspectRatio="xMidYMid slice"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full will-change-transform",
        "[mask-image:radial-gradient(80%_70%_at_55%_32%,black_30%,transparent_100%)]",
        className,
      )}
    >
      {/* reference hairlines: one parallel, one meridian */}
      <line
        x1="0"
        y1={REF_PARALLEL}
        x2="1000"
        y2={REF_PARALLEL}
        stroke="rgba(120,176,240,0.05)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={REF_MERIDIAN}
        y1="0"
        x2={REF_MERIDIAN}
        y2="560"
        stroke="rgba(120,176,240,0.05)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />

      {/* datum crosses at the remaining net intersections */}
      {NET_COLS.map((x) =>
        NET_ROWS.map((y) => {
          if (x === REF_MERIDIAN && y === REF_PARALLEL) return null;
          return (
            <g key={`${x}-${y}`} stroke="rgba(120,176,240,0.12)" strokeWidth="1">
              <line x1={x - CROSS_ARM} y1={y} x2={x + CROSS_ARM} y2={y} vectorEffect="non-scaling-stroke" />
              <line x1={x} y1={y - CROSS_ARM} x2={x} y2={y + CROSS_ARM} vectorEffect="non-scaling-stroke" />
            </g>
          );
        }),
      )}

      {/* station coordinates on the reference lines (LAT 19.20 N / LON 72.87 E) */}
      <text x="918" y="292" className="font-mono" fontSize="9" letterSpacing="1.5" fill="rgba(128,144,160,0.42)">
        19°12&apos;N
      </text>
      <text x="668" y="46" className="font-mono" fontSize="9" letterSpacing="1.5" fill="rgba(128,144,160,0.38)">
        72°52&apos;E
      </text>

      {/* spot soundings */}
      {SOUNDINGS.map((s) => (
        <text
          key={`${s.x}-${s.y}`}
          x={s.x}
          y={s.y}
          textAnchor="middle"
          className="font-mono"
          fontSize="10"
          letterSpacing="1"
          fill={`rgba(128,144,160,${s.alpha})`}
        >
          {s.depth}
        </text>
      ))}

      {/* plotted vessel track: three straight legs through four waypoints */}
      <path
        d="M 70 470 L 330 352 L 620 296 L 952 140"
        fill="none"
        stroke="rgba(120,176,240,0.16)"
        strokeWidth="1"
        strokeDasharray="6 8"
        vectorEffect="non-scaling-stroke"
      />
      {/* passed waypoint */}
      <circle cx="330" cy="352" r="3.5" fill="none" stroke="rgba(120,176,240,0.35)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      {/* active waypoint: the single accent moment, near the mask focus */}
      <circle cx="620" cy="296" r="4.5" fill="none" stroke="rgba(29,91,216,0.55)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <circle cx="620" cy="296" r="1.5" fill="rgba(29,91,216,0.7)" />
      {/* course label along leg 2 (screen bearing of the leg, chart voice) */}
      <text
        x="475"
        y="314"
        transform="rotate(-11 475 314)"
        className="font-mono"
        fontSize="8.5"
        letterSpacing="1.5"
        fill="rgba(128,144,160,0.4)"
      >
        CO 080°
      </text>
    </svg>
  );
}
