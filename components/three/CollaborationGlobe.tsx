"use client";

import dynamic from "next/dynamic";
import { StationHeader } from "@/components/devices/StationHeader";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { LazyMount } from "@/components/ui/LazyMount";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { STAGGER } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { collaboration } from "@/content/pages/collaboration";

/** One operating station on the globe: scene geometry only; display copy lives in content. */
export interface GlobeStation {
  id: string;
  lat: number;
  lon: number;
  /**
   * Satellite of the hub cluster: renders a smaller marker ONLY. Route-arc
   * suppression is geometric, not flag-driven: OpsGlobe skips arcs to any
   * station closer than ARC_MIN_ANGLE to the hub regardless of this flag.
   */
  minor?: boolean;
}

/**
 * Operating and project stations: numeric scene coordinates only (verified
 * 2026-07-30; geographic labels, never organisation names, per client
 * decision). Display names and coordinate strings live in
 * content/pages/collaboration.ts (globe.stations), merged BY INDEX; the two
 * arrays must stay in the same order. Index 0 is the hub (arcs originate
 * there); `minor` marks the Indian project cluster on the hub's doorstep.
 */
export const STATIONS: readonly GlobeStation[] = [
  { id: "mumbai", lat: 19.2, lon: 72.85 },
  { id: "uran", lat: 18.88, lon: 72.93, minor: true },
  { id: "mumbai-high", lat: 19.42, lon: 71.33, minor: true },
  { id: "pipavav", lat: 20.92, lon: 71.5, minor: true },
  { id: "tuticorin", lat: 8.76, lon: 78.13 },
  { id: "gulf", lat: 25.5, lon: 53.0 },
  { id: "zanzibar", lat: -6.16, lon: 39.19 },
  { id: "stkitts", lat: 17.3, lon: -62.72 },
];

/** Section copy from content/; the band is always authored with it. */
const globeCopy = collaboration.globe!;

const GLOBE_LABEL =
  "Rotating globe showing eight operating and project stations: Mumbai, Uran, the Mumbai High field, Pipavav, Thoothukudi, the Arabian Gulf, Zanzibar, and Basseterre";

/** three/R3F stay out of the shared bundle: loaded on demand, client only. */
const OpsGlobe = dynamic(() => import("./OpsGlobe").then((m) => m.OpsGlobe), {
  ssr: false,
  loading: () => <StaticGlobe />,
});

/**
 * Static orthographic globe: the permanent fallback for reduced motion and
 * missing WebGL, and the placeholder while the R3F chunk loads. Station dot
 * positions are precomputed orthographic projections centered on LAT 0 /
 * LON 5 E: x = 200 + 160 cos(lat) sin(lon - 5), y = 200 - 160 sin(lat).
 * Decorative only; the legend carries the accessible data.
 */
function StaticGlobe() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 400"
      className="h-full w-full"
      fill="none"
    >
      <circle cx="200" cy="200" r="160" stroke="rgba(120,176,240,0.28)" strokeWidth="1" />
      {/* meridians */}
      <ellipse cx="200" cy="200" rx="56" ry="160" stroke="rgba(120,176,240,0.16)" strokeWidth="1" />
      <ellipse cx="200" cy="200" rx="104" ry="160" stroke="rgba(120,176,240,0.16)" strokeWidth="1" />
      <ellipse cx="200" cy="200" rx="148" ry="160" stroke="rgba(120,176,240,0.16)" strokeWidth="1" />
      {/* latitudes */}
      <ellipse cx="200" cy="200" rx="160" ry="26" stroke="rgba(120,176,240,0.16)" strokeWidth="1" />
      <ellipse cx="200" cy="87" rx="113" ry="18" stroke="rgba(120,176,240,0.16)" strokeWidth="1" />
      <ellipse cx="200" cy="313" rx="113" ry="18" stroke="rgba(120,176,240,0.16)" strokeWidth="1" />
      {/* stations, same order as STATIONS: Mumbai hub, the Indian project
          cluster (Uran, Mumbai High, Pipavav), Thoothukudi, Arabian Gulf,
          Zanzibar, Basseterre */}
      <circle cx="340" cy="147" r="5.5" fill="#1d5bd8" />
      <circle cx="340" cy="148" r="2.5" fill="#1d5bd8" />
      <circle cx="338" cy="147" r="2.5" fill="#1d5bd8" />
      <circle cx="337" cy="143" r="2.5" fill="#1d5bd8" />
      <circle cx="351" cy="176" r="4" fill="#1d5bd8" />
      <circle cx="307" cy="131" r="4" fill="#1d5bd8" />
      <circle cx="289" cy="217" r="4" fill="#1d5bd8" />
      <circle cx="59" cy="152" r="4" fill="#1d5bd8" />
    </svg>
  );
}

/**
 * NET 01 signature moment on /collaboration: the wireframe operations globe
 * (drag to rotate, dashed great-circle routes out of Mumbai) beside an
 * accessible station legend that never depends on WebGL.
 */
export function CollaborationGlobe() {
  const reduced = useReducedMotion();

  return (
    <section className="u-chart-border relative overflow-hidden bg-ink">
      <div className="u-shell relative py-[clamp(4.5rem,10vh,8rem)]">
        <StationHeader eyebrow={globeCopy.eyebrow} meta="8 STATIONS · 4 REGIONS" />

        <h2 className="mt-10 max-w-2xl font-sans text-[clamp(1.5rem,2.8vw,2.25rem)] font-medium leading-tight tracking-[-0.01em] text-white">
          <TextReveal text={globeCopy.heading} />
        </h2>
        <Reveal>
          <p className="mt-6 max-w-xl text-[0.9375rem] leading-[1.7] text-white/70">
            {globeCopy.lede}
          </p>
        </Reveal>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* globe cell: canvas never mounts under reduced motion */}
          <div className="lg:col-span-7">
            <div className="relative mx-auto aspect-square w-full max-w-[520px]">
              {reduced ? (
                <StaticGlobe />
              ) : (
                <LazyMount rootMargin="200px" className="h-full w-full" placeholder={<StaticGlobe />}>
                  <OpsGlobe stations={STATIONS} label={GLOBE_LABEL} fallback={<StaticGlobe />} />
                </LazyMount>
              )}
            </div>
            {!reduced && (
              <p className="mt-4 text-center font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-meta">
                DRAG TO ROTATE · ARROW KEYS TO STEER
              </p>
            )}
          </div>

          {/* accessible legend: always rendered, no WebGL dependency */}
          <Reveal selector="[data-station]" stagger={STAGGER.cards} className="lg:col-span-5">
            <ul className="divide-y divide-steel/16 border-y border-steel/16">
              {STATIONS.map((station, i) => (
                <li key={station.id} data-station className="flex items-center gap-4 py-4">
                  <span
                    aria-hidden
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full border border-accent",
                      i === 0 && "bg-accent",
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <span className="block font-sans text-sm font-medium text-white">
                      {globeCopy.stations[i]?.name}
                    </span>
                    <span className="mt-1 block font-mono text-[0.625rem] uppercase tracking-[0.25em] text-meta">
                      {globeCopy.stations[i]?.coords}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
