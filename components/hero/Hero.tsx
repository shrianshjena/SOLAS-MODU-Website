"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useMotionHold } from "@/components/providers/MotionHold";
import { HeroLoopVideo } from "./HeroLoopVideo";
import { HeroContent } from "./HeroContent";
import { Marquee } from "@/components/ui/Marquee";
import { ScrollCue } from "@/components/ui/ScrollCue";
import { clients } from "@/content/data/clients";
import { home } from "@/content/pages/home";

/**
 * Home hero: full-background crossfade video under a surface-tinted light lift
 * (weighted to the top-left where the navy copy sits) and an outer edge
 * vignette, left-side brand-stack copy, HOLD FEED motion control (WCAG 2.2.2),
 * scroll cue, and the client-name marquee on the bottom edge. The section is
 * capped at exactly one viewport (100svh with a 560px short-viewport floor) so
 * nav, headline, CTAs, and the instrument bar fit without scrolling. Scroll
 * scrub drifts the copy up and dims the feed as the section leaves the
 * viewport.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { held, toggle } = useMotionHold();

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      gsap.to("[data-hero-copy]", {
        yPercent: -14,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 },
      });
      gsap.to("[data-hero-media]", {
        scale: 1.06,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 },
      });
      gsap.to("[data-hero-dim]", {
        opacity: 0.5,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 0.6 },
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={ref}
      data-nav-theme="hero-light"
      className="relative flex h-screen min-h-[560px] flex-col overflow-hidden bg-ink supports-[height:100svh]:h-[100svh]"
    >
      {/* media stack */}
      <div data-hero-media className="absolute inset-0 will-change-transform">
        <HeroLoopVideo />
        {/* light-lift scrims: surface wash raises the sky behind the navy copy */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(165deg, rgba(240,240,248,0.5) 0%, rgba(240,240,248,0.26) 38%, rgba(240,240,248,0) 62%), radial-gradient(80% 76% at 24% 42%, rgba(240,240,248,0.45) 0%, rgba(240,240,248,0.2) 55%, rgba(240,240,248,0) 80%)",
          }}
        />
        {/* deepened water fade: the white CTA labels and AIS line always sit
            on darkened ground even on sun-lit frames */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{
            background:
              "linear-gradient(to top, #081020 4%, rgba(8,16,32,0.45) 42%, transparent)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-24"
          style={{ background: "linear-gradient(to bottom, rgba(240,240,248,0.7), rgba(240,240,248,0))" }}
        />
        {/* outer edge vignette: grounds the frame edges; top-left dark radial removed for the dark-text hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(130% 110% at 50% 48%, transparent 52%, rgba(8,16,32,0.32) 88%, rgba(8,16,32,0.44) 100%)",
          }}
        />
        <div data-hero-dim aria-hidden className="absolute inset-0 bg-ink opacity-0" />
      </div>

      {/* copy */}
      <div
        className="u-shell relative z-10 flex min-h-0 flex-1 items-center pb-8 pt-20 sm:pb-10 sm:pt-24"
        data-hero-copy
      >
        <HeroContent />
      </div>

      {/* bottom instrument bar: scroll cue + hold control + client marquee */}
      <div data-hero-bar className="relative z-10 border-t border-steel/10 bg-ink/40 backdrop-blur-sm">
        <div className="u-shell flex items-center gap-6 py-3">
          <ScrollCue label={home.hero.scrollCue} className="hidden shrink-0 sm:flex" />
          <Marquee className="min-w-0 flex-1" duration={40}>
            {clients.map((c) => (
              <span
                key={c.name}
                className="mx-6 whitespace-nowrap font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-meta"
              >
                {c.name}
              </span>
            ))}
          </Marquee>
          <button
            type="button"
            onClick={toggle}
            aria-pressed={held}
            className="shrink-0 border border-steel/28 px-3 py-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-steel transition-colors hover:border-accent hover:text-white"
          >
            {held ? "Resume Feed" : "Hold Feed"}
          </button>
        </div>
      </div>
    </section>
  );
}
