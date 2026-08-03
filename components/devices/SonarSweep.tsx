"use client";

import { useMemo } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useMotionHold } from "@/components/providers/MotionHold";
import { cn } from "@/lib/cn";

interface Blip {
  /** bearing in degrees (0 = north, clockwise) */
  bearing: number;
  /** distance from center, 0..1 of the outer radius */
  range: number;
  /** the single sanctioned flare blip */
  flare?: boolean;
  /** seconds offset into the pulse cycle */
  delay?: number;
}

interface SonarSweepProps {
  /** css size (width = height) */
  size?: number | string;
  /** show the rotating sweep wedge + pulsing blips */
  active?: boolean;
  blips?: Blip[];
  className?: string;
}

const DEFAULT_BLIPS: Blip[] = [
  { bearing: 35, range: 0.55, delay: 0.4 },
  { bearing: 120, range: 0.82, delay: 2.1 },
  { bearing: 210, range: 0.38, delay: 3.6 },
  { bearing: 285, range: 0.68, delay: 5.2, flare: true },
];

/**
 * D1 signature device: polar instrument with concentric range rings, radial
 * ticks, crosshairs, a rotating conic sweep wedge, and pulsing echo blips.
 * Decorative (aria-hidden). Static rings under reduced motion or motion hold.
 */
export function SonarSweep({ size = 640, active = true, blips = DEFAULT_BLIPS, className }: SonarSweepProps) {
  const reduced = useReducedMotion();
  const { held } = useMotionHold();
  const animating = active && !reduced && !held;

  const ticks = useMemo(() => Array.from({ length: 24 }, (_, i) => i * 15), []);

  return (
    <div
      aria-hidden
      className={cn("relative aspect-square", className)}
      style={{ width: typeof size === "number" ? `${size}px` : size }}
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
        {/* range rings at 25/50/75/100% */}
        {[25, 50, 75, 100].map((r, i) => (
          <circle
            key={r}
            cx="100"
            cy="100"
            r={r * 0.98}
            fill="none"
            stroke={i === 3 ? "rgba(120,176,240,0.28)" : "rgba(120,176,240,0.16)"}
            strokeWidth="0.6"
          />
        ))}
        {/* crosshair diameters */}
        <line x1="100" y1="2" x2="100" y2="198" stroke="rgba(120,176,240,0.16)" strokeWidth="0.6" />
        <line x1="2" y1="100" x2="198" y2="100" stroke="rgba(120,176,240,0.16)" strokeWidth="0.6" />
        {/* 24 radial ticks on the outer ring */}
        {ticks.map((deg) => (
          <line
            key={deg}
            x1="100"
            y1="4"
            x2="100"
            y2="10"
            stroke="rgba(120,176,240,0.28)"
            strokeWidth="0.8"
            transform={`rotate(${deg} 100 100)`}
          />
        ))}
        {/* center origin */}
        <circle cx="100" cy="100" r="1.6" fill="rgba(29,91,216,0.9)" />
      </svg>

      {/* rotating sweep wedge (conic gradient, mechanical rotation) */}
      {animating && (
        <div
          className="absolute inset-[1%] rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(29,91,216,0.22), rgba(29,91,216,0.05) 45deg, transparent 60deg)",
            animation: "sweep-rotate 8s linear infinite",
          }}
        />
      )}

      {/* echo blips at fixed polar positions */}
      {blips.map((b, i) => {
        const rad = ((b.bearing - 90) * Math.PI) / 180;
        const x = 50 + Math.cos(rad) * 49 * b.range;
        const y = 50 + Math.sin(rad) * 49 * b.range;
        return (
          <span
            key={i}
            className="absolute h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              background: b.flare ? "var(--flare)" : "var(--accent)",
            }}
          >
            {animating && (
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background: "inherit",
                  animation: `ping-ring 2.4s ease-out ${b.delay ?? 0}s infinite`,
                }}
              />
            )}
          </span>
        );
      })}
    </div>
  );
}
