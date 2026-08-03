"use client";

import { TextReveal } from "@/components/ui/TextReveal";
import { SweepButton } from "@/components/ui/SweepButton";
import { Decode } from "@/components/ui/Decode";
import { AISReadout } from "@/components/devices/AISReadout";
import { useLoaderGate } from "@/components/providers/LoaderGate";
import { home } from "@/content/pages/home";

/**
 * Left-side hero copy: the three-line brand stack (company name, division,
 * registration) rises through masked word reveals once the loader hands off,
 * the tagline follows, CTAs sweep in, and the AIS telegram resolves last.
 * The copy is navy over the light-lifted feed, the division line carries the
 * accent, and both CTAs share the primary treatment. The full stack reads as
 * a single H1: "SOLAS MODU Marine Services Private Limited".
 */
export function HeroContent() {
  const { revealed } = useLoaderGate();
  const { hero } = home;

  return (
    <div className="relative z-10 flex max-w-3xl flex-col items-start gap-5">
      <h1 className="u-text-hero-halo text-navy">
        <TextReveal
          text={hero.title.primary}
          play={revealed}
          delay={0.05}
          className="block font-sans text-[clamp(2.75rem,7vw,6rem)] font-semibold uppercase leading-[0.98] tracking-[-0.02em]"
        />
        <TextReveal
          text={hero.title.secondary}
          play={revealed}
          delay={0.25}
          className="block font-sans text-[clamp(1.5rem,3.2vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.01em] text-accent"
        />
        {/* block wrapper: Decode hardcodes inline-block and cn has no tailwind-merge */}
        <span className="mt-1 block">
          <Decode
            text={hero.title.tertiary}
            play={revealed}
            delay={0.55}
            className="font-mono text-[clamp(0.6875rem,1vw,0.8125rem)] uppercase tracking-[0.3em] text-slate"
          />
        </span>
      </h1>
      <TextReveal
        text={hero.tagline}
        as="p"
        play={revealed}
        delay={0.65}
        className="u-text-hero-halo max-w-xl text-[clamp(1rem,1.2vw,1.15rem)] leading-relaxed text-slate"
      />
      <div className="mt-2 flex flex-wrap gap-4">
        <SweepButton href={hero.primary.href} variant="primary">
          {hero.primary.label}
        </SweepButton>
        <SweepButton href={hero.secondary.href} variant="primary">
          {hero.secondary.label}
        </SweepButton>
      </div>
      <AISReadout text={hero.ais} play={revealed} delay={1.2} tone="bright" className="mt-3 hidden sm:block" />
    </div>
  );
}
