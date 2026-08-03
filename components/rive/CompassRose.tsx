"use client";

import { RiveIcon } from "./RiveIcon";
import { useMotionHold } from "@/components/providers/MotionHold";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface CompassRoseProps {
  /** square box edge in px */
  size?: number;
  className?: string;
}

/**
 * Compass rose slot: plays /rive/compass.riv when the asset ships; until then
 * (public/rive is empty) it renders the static SVG twin below. Decorative,
 * polar-instrument language per DESIGN_SYSTEM.md: rings, star points,
 * half-point ticks, accent needle, mono cardinal letters.
 */
export function CompassRose({ size = 120, className }: CompassRoseProps) {
  return (
    <RiveIcon
      src="/rive/compass.riv"
      stateMachine="idle"
      size={size}
      className={className}
      fallback={<CompassSvg />}
    />
  );
}

/**
 * Static twin. The needle carries a CSS-only wobble (no other engine touches
 * this transform); it drops under reduced motion and pauses under the global
 * motion hold.
 */
function CompassSvg() {
  const reduced = useReducedMotion();
  const { held } = useMotionHold();

  return (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden className="h-full w-full">
      <style>{`@keyframes compass-wobble{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}`}</style>

      {/* rings, star, graticule ticks: steel hairline alphas */}
      <g stroke="currentColor" strokeWidth="1" className="text-steel">
        <circle cx="60" cy="60" r="57" strokeOpacity="0.28" />
        <circle cx="60" cy="60" r="44" strokeOpacity="0.16" />
        {/* 8 half-point ticks on the outer ring */}
        <path
          strokeOpacity="0.16"
          d="M80.28 11.03 81.81 7.34M108.97 39.72 112.66 38.19M108.97 80.28 112.66 81.81M80.28 108.97 81.81 112.66M39.72 108.97 38.19 112.66M11.03 80.28 7.34 81.81M11.03 39.72 7.34 38.19M39.72 11.03 38.19 7.34"
        />
        {/* cardinal star: outline only, points N E S W at r40 */}
        <path
          strokeOpacity="0.28"
          strokeLinejoin="round"
          d="M60 20 68.49 51.51 100 60 68.49 68.49 60 100 51.51 68.49 20 60 51.51 51.51Z"
        />
        {/* intercardinal star, shorter, points at r28 */}
        <path
          strokeOpacity="0.16"
          strokeLinejoin="round"
          d="M79.8 40.2 69 60 79.8 79.8 60 69 40.2 79.8 51 60 40.2 40.2 60 51Z"
        />
      </g>

      {/* north needle: the single sanctioned fill, accent */}
      <g
        className="text-accent"
        style={
          reduced
            ? undefined
            : {
                animation: "compass-wobble 6s ease-in-out infinite",
                animationPlayState: held ? "paused" : "running",
                transformOrigin: "60px 60px",
              }
        }
      >
        <path d="M60 16 64.2 60 55.8 60Z" fill="currentColor" fillOpacity="0.9" />
        <path d="M60 104 63 60 57 60Z" stroke="currentColor" strokeOpacity="0.45" />
        <circle cx="60" cy="60" r="3" stroke="currentColor" strokeWidth="1.5" />
      </g>

      {/* cardinal letters between the rings, mono micro */}
      <g
        fill="currentColor"
        className="text-meta"
        style={{ fontFamily: "var(--font-mono)", fontSize: "7px", fontWeight: 500 }}
        textAnchor="middle"
        dominantBaseline="central"
      >
        <text x="60" y="9.5" className="text-steel">
          N
        </text>
        <text x="110.5" y="60">
          E
        </text>
        <text x="60" y="110.5">
          S
        </text>
        <text x="9.5" y="60">
          W
        </text>
      </g>
    </svg>
  );
}
