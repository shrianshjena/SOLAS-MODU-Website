"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";

/**
 * D8 device: naval general-arrangement drafting field for the Certificates
 * and Gallery heroes (client direction 2026-07-30: replace the concentric
 * ovals with a straight-line treatment in the spirit of a small-craft GA
 * drawing). Pure drafting furniture: numbered frame stations, an angular
 * sheer line, a dash-dot design waterline over a solid baseline, dimension
 * lines with drafting slash ticks, a section cut marker (the single accent
 * moment), and a title block. Straight lines only, no closed curves, no
 * uniform mesh; distinct from ChartGraticule (no crosses, soundings, or
 * plotted track) and from ContourField (no loops). Drifts slowly with
 * scroll (parallax translateY only, GSAP-owned); radially masked;
 * decorative.
 */

/** frame station verticals, evenly spaced across the drafting band */
const STATIONS = [150, 240, 330, 420, 510, 600, 690, 780, 870];
/** the station carrying the section cut symbol */
const SECTION_STATION = 600;
const BAND_TOP = 165;
const BASELINE = 395;
const DWL = 245;

export function DraftingPlan({ className }: { className?: string }) {
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
        "[mask-image:radial-gradient(82%_75%_at_58%_42%,black_30%,transparent_100%)]",
        className,
      )}
    >
      {/* frame stations: the straight-line rhythm of the device */}
      {STATIONS.map((x, i) => (
        <g key={x}>
          <line
            x1={x}
            y1={BAND_TOP}
            x2={x}
            y2={BASELINE}
            stroke={`rgba(120,176,240,${x === SECTION_STATION ? 0.14 : 0.07})`}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <text
            x={x}
            y={BASELINE + 17}
            textAnchor="middle"
            className="font-mono"
            fontSize="8.5"
            letterSpacing="1"
            fill="rgba(128,144,160,0.28)"
          >
            {i}
          </text>
        </g>
      ))}

      {/* angular sheer line above the waterline, echoing the GA profile */}
      <path
        d="M 150 205 L 420 195 L 690 198 L 870 212"
        fill="none"
        stroke="rgba(120,176,240,0.09)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />

      {/* design waterline: classic dash-dot, labelled at the margin */}
      <line
        x1="110"
        y1={DWL}
        x2="910"
        y2={DWL}
        stroke="rgba(120,176,240,0.10)"
        strokeWidth="1"
        strokeDasharray="14 4 2 4"
        vectorEffect="non-scaling-stroke"
      />
      <text x="112" y={DWL - 8} className="font-mono" fontSize="9" letterSpacing="1.5" fill="rgba(128,144,160,0.35)">
        DWL
      </text>

      {/* baseline */}
      <line
        x1="110"
        y1={BASELINE}
        x2="910"
        y2={BASELINE}
        stroke="rgba(120,176,240,0.12)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <text x="112" y={BASELINE - 8} className="font-mono" fontSize="9" letterSpacing="1.5" fill="rgba(128,144,160,0.3)">
        BL
      </text>

      {/* horizontal dimension line with drafting slash ticks */}
      <line
        x1="150"
        y1="447"
        x2="870"
        y2="447"
        stroke="rgba(120,176,240,0.10)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <line x1="146" y1="451" x2="154" y2="443" stroke="rgba(120,176,240,0.28)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <line x1="866" y1="451" x2="874" y2="443" stroke="rgba(120,176,240,0.28)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <text
        x="510"
        y="440"
        textAnchor="middle"
        className="font-mono"
        fontSize="9"
        letterSpacing="1.5"
        fill="rgba(128,144,160,0.38)"
      >
        L.O.A. 26.00 M
      </text>

      {/* vertical depth dimension at the left margin */}
      <line
        x1="118"
        y1={DWL}
        x2="118"
        y2={BASELINE}
        stroke="rgba(120,176,240,0.08)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <line x1="114" y1={DWL + 4} x2="122" y2={DWL - 4} stroke="rgba(120,176,240,0.25)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <line x1="114" y1={BASELINE + 4} x2="122" y2={BASELINE - 4} stroke="rgba(120,176,240,0.25)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <text
        x="104"
        y="322"
        transform="rotate(-90 104 322)"
        textAnchor="middle"
        className="font-mono"
        fontSize="8.5"
        letterSpacing="1.5"
        fill="rgba(128,144,160,0.3)"
      >
        D 4.80
      </text>

      {/* section cut on the reference station: the single accent moment */}
      <circle
        cx={SECTION_STATION}
        cy={DWL}
        r="4.5"
        fill="none"
        stroke="rgba(29,91,216,0.55)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={SECTION_STATION} cy={DWL} r="1.5" fill="rgba(29,91,216,0.7)" />
      <text
        x={SECTION_STATION + 12}
        y={DWL - 8}
        className="font-mono"
        fontSize="8.5"
        letterSpacing="1.5"
        fill="rgba(128,144,160,0.4)"
      >
        SEC 5
      </text>

      {/* title block, bottom right */}
      <g stroke="rgba(120,176,240,0.14)" strokeWidth="1">
        <rect x="696" y="462" width="256" height="74" fill="none" vectorEffect="non-scaling-stroke" />
        <line x1="696" y1="486" x2="952" y2="486" strokeOpacity="0.6" vectorEffect="non-scaling-stroke" />
        <line x1="696" y1="510" x2="952" y2="510" strokeOpacity="0.6" vectorEffect="non-scaling-stroke" />
        <line x1="820" y1="462" x2="820" y2="510" strokeOpacity="0.6" vectorEffect="non-scaling-stroke" />
      </g>
      <g className="font-mono" letterSpacing="1.2" fill="rgba(128,144,160,0.4)">
        <text x="704" y="479" fontSize="8">
          GENERAL ARRANGEMENT
        </text>
        <text x="828" y="479" fontSize="8" fill="rgba(128,144,160,0.3)">
          SCALE 1:50
        </text>
        <text x="704" y="503" fontSize="8" fill="rgba(128,144,160,0.3)">
          PROFILE · STATIONS 0-8
        </text>
        <text x="828" y="503" fontSize="8" fill="rgba(128,144,160,0.25)">
          SHT 1/1
        </text>
        <text x="704" y="527" fontSize="8" fill="rgba(128,144,160,0.3)">
          DWG SM-2101
        </text>
      </g>
    </svg>
  );
}
