"use client";

import { Decode } from "@/components/ui/Decode";
import { cn } from "@/lib/cn";

interface AISReadoutProps {
  /** middot-separated telegram, e.g. "SOLAS MODU · LAT 19.20 N · LON 72.87 E" */
  text: string;
  /** controlled trigger (hero handoff); default scroll-triggered */
  play?: boolean;
  delay?: number;
  /** ScrollTrigger start passthrough; bottom-of-page mounts need "top bottom" */
  start?: string;
  /** color voice: "meta" on dark chrome, "onLight" on surface, "bright" over the hero feed */
  tone?: "meta" | "onLight" | "bright";
  className?: string;
}

/**
 * D5 signature device: AIS-telegram metadata line in the instrument voice.
 * Resolves through the scramble decode on first reveal (the site's AI-inspired
 * motion signature). The tone prop picks the color voice for the surface the
 * readout sits on.
 */
export function AISReadout({ text, play, delay, start, tone = "meta", className }: AISReadoutProps) {
  return (
    <Decode
      text={text}
      play={play}
      delay={delay}
      start={start}
      className={cn(
        "font-mono text-[0.625rem] uppercase tracking-[0.28em]",
        tone === "bright" ? "text-white/90" : tone === "onLight" ? "text-slate" : "text-meta",
        className,
      )}
    />
  );
}
