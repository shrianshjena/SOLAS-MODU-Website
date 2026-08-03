"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ContourField } from "@/components/devices/ContourField";
import { LazyMount } from "@/components/ui/LazyMount";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";

/** three/R3F stay out of the shared bundle: loaded on demand, client only. */
const OceanParticles = dynamic(
  () => import("@/components/three/OceanParticles").then((m) => m.OceanParticles),
  { ssr: false },
);

/**
 * Animated backdrop for the careers application band, mirroring the home
 * contact section treatment (client request 2026-07-30): the R3F particle
 * ocean behind the form, with ContourField as the reduced-motion / no-WebGL /
 * pre-mount fallback, cross-faded out once the canvas context is live and
 * restored if the context is lost. Renders absolutely positioned layers; the
 * parent section owns relative + overflow-hidden, and content above must sit
 * on a relative z layer.
 */
export function FormBackdrop() {
  const reduced = useReducedMotion();
  const [oceanLive, setOceanLive] = useState(false);

  return (
    <>
      <ContourField
        className={cn("transition-opacity duration-700", oceanLive && !reduced && "opacity-0")}
      />
      {!reduced && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-35 [mask-image:radial-gradient(80%_80%_at_45%_55%,black_30%,transparent_95%)]"
        >
          <LazyMount rootMargin="200px" className="h-full w-full">
            <OceanParticles
              onLive={() => setOceanLive(true)}
              onContextLost={() => setOceanLive(false)}
            />
          </LazyMount>
        </div>
      )}
    </>
  );
}
