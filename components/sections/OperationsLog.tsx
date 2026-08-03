"use client";

import { useEffect, useRef } from "react";
import { StationHeader } from "@/components/devices/StationHeader";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { Decode } from "@/components/ui/Decode";
import { home } from "@/content/pages/home";
import { featuredProjects } from "@/content/data/projects";
import { registerGsap, gsap } from "@/lib/gsap";
import { DUR, EASE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * STN 03: the track record. Gauge-stat cluster on the left, the sounding-line
 * timeline of featured campaigns on the right (ring station markers on a
 * vertical hairline). GSAP refines the timeline: the hairline scaleY-draws
 * scrubbed with scroll with a glowing sounding weight riding its tip, each
 * ring marker fills accent with a one-shot ping ripple once its entry enters
 * the viewport, and the period labels decode in (Decode's own trigger).
 * Reveal keeps ownership of entry opacity/rise; GSAP owns only the line
 * timeline and ring fills. Under reduced motion no triggers mount: the line
 * renders fully drawn, the tip stays hidden, and the rings stay static.
 */
export function OperationsLog() {
  const { operations } = home;
  const reduced = useReducedMotion();
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = timelineRef.current;
    if (!root || reduced) return;
    registerGsap();

    const ctx = gsap.context(() => {
      // one scrubbed timeline drives the hairline draw and the sounding
      // weight riding its tip; starts no later than the first ring fill
      // (top 88%) so the line always leads its stations
      const draw = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 88%", end: "bottom 60%", scrub: 0.6 },
      });
      draw.fromTo("[data-timeline-line]", { scaleY: 0 }, { scaleY: 1, duration: 1, ease: EASE.mech }, 0);
      draw.fromTo(
        "[data-timeline-tip]",
        { top: "0%" },
        { top: "100%", duration: 1, ease: EASE.mech },
        0,
      );
      draw.fromTo("[data-timeline-tip]", { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0);
      draw.to("[data-timeline-tip]", { opacity: 0, duration: 0.08 }, 0.92);

      const accent = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim();
      root.querySelectorAll<HTMLElement>("[data-entry]").forEach((entry) => {
        const ring = entry.querySelector("[data-entry-ring]");
        const ping = entry.querySelector("[data-entry-ping]");
        if (!ring) return;
        gsap.to(ring, {
          backgroundColor: accent,
          duration: DUR.fast,
          ease: EASE.expo,
          scrollTrigger: { trigger: ring, start: "top 88%", once: true },
          onStart: () => {
            // sonar echo: a single expanding ring the moment the station fills
            if (ping) {
              gsap.fromTo(
                ping,
                { scale: 1, opacity: 0.6 },
                { scale: 2.8, opacity: 0, duration: 0.9, ease: "power2.out" },
              );
            }
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="operations" className="u-chart-border bg-ink">
      <div className="u-shell py-[clamp(4.5rem,10vh,8rem)]">
        <StationHeader eyebrow={operations.eyebrow} meta="LOG 2013-2029" />

        <div className="mt-12 grid gap-14 lg:grid-cols-12 lg:gap-20">
          {/* stats cluster */}
          <div className="flex flex-col gap-10 lg:col-span-5">
            <h2 className="font-sans text-[clamp(1.625rem,3.2vw,2.625rem)] font-medium leading-tight tracking-[-0.01em] text-white">
              <TextReveal text={operations.heading} />
            </h2>
            <Reveal>
              <p className="text-[0.9375rem] leading-[1.7] text-white/70">{operations.lede}</p>
            </Reveal>
            <Reveal selector="[data-stat]" className="flex flex-col gap-8">
              {operations.stats.map((stat) => (
                <div key={stat.label} data-stat className="flex items-baseline gap-5">
                  <span className="min-w-28 font-sans text-[clamp(2.25rem,4.5vw,3.75rem)] font-semibold tracking-tight text-accent">
                    <Counter value={stat.value} />
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-white">
                      {stat.label}
                    </span>
                    {stat.caption && (
                      <span className="font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-meta">
                        {stat.caption}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </Reveal>
          </div>

          {/* sounding-line timeline */}
          <div className="lg:col-span-7">
            <div ref={timelineRef} className="relative">
              <span
                aria-hidden
                data-timeline-line
                className="absolute inset-y-0 left-0 w-px origin-top bg-steel/16"
              />
              {/* sounding weight: glow dot riding the drawing tip (GSAP owns top/opacity) */}
              <span
                aria-hidden
                data-timeline-tip
                className="absolute left-[0.5px] top-0 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent opacity-0 shadow-[0_0_12px_2px_rgba(29,91,216,0.55)]"
              />
              <Reveal selector="[data-entry]" className="flex flex-col gap-10 pl-8">
                {featuredProjects.map((project) => (
                  <article key={project.title} data-entry className="relative">
                    <span
                      aria-hidden
                      data-entry-ring
                      className="absolute -left-[36px] top-1.5 h-2 w-2 rounded-full border-2 border-accent bg-ink"
                    />
                    {/* one-shot sonar echo spawned by the ring fill */}
                    <span
                      aria-hidden
                      data-entry-ping
                      className="absolute -left-[36px] top-1.5 h-2 w-2 rounded-full border border-accent opacity-0"
                    />
                    <Decode
                      text={project.period}
                      className="font-mono text-[0.625rem] uppercase tracking-[0.25em] text-steel"
                    />
                    <h3 className="mt-2 font-sans text-lg font-medium text-white">{project.title}</h3>
                    <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-white/60">
                      {project.body}
                    </p>
                  </article>
                ))}
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
