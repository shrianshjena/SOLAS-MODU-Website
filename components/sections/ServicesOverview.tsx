"use client";

import { StationHeader } from "@/components/devices/StationHeader";
import { ChartGraticule } from "@/components/devices/ChartGraticule";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { TickFrame } from "@/components/ui/TickFrame";
import { Icon, type IconName } from "@/components/ui/Icon";
import { TransitionLink } from "@/components/providers/TransitionProvider";
import { home } from "@/content/pages/home";
import { STAGGER } from "@/lib/motion";

/**
 * STN 02: the six division cards on dark ground over the passage-chart
 * plotting field. Each card is three drafting bands inside the hairline
 * lattice: index band (oversized mono numeral + ringed icon mount), body,
 * and action band, separated by internal hairlines. Hover/focus draws an
 * accent overlay across the index divider (CSS transitions only; entrance
 * cascade is GSAP via Reveal). Each card links to its service route through
 * the curtain transition.
 */
export function ServicesOverview() {
  const { services } = home;

  return (
    <section id="services" className="u-chart-border relative overflow-hidden bg-ink">
      <ChartGraticule />
      <div className="u-shell relative py-[clamp(4.5rem,10vh,8rem)]">
        <StationHeader eyebrow={services.eyebrow} meta="6 DIVISIONS" />

        <div className="mt-10 flex flex-col gap-4 lg:max-w-2xl">
          <h2 className="font-sans text-[clamp(1.625rem,3.2vw,2.625rem)] font-medium leading-tight tracking-[-0.01em] text-white">
            <TextReveal text={services.heading} />
          </h2>
          <Reveal>
            <p className="text-[0.9375rem] leading-[1.7] text-white/70">{services.lede}</p>
          </Reveal>
        </div>

        <Reveal
          selector="[data-card]"
          stagger={STAGGER.cards}
          className="mt-14 grid gap-px border border-steel/16 bg-steel/16 md:grid-cols-2 lg:grid-cols-3"
        >
          {services.items.map((item) => (
            <TransitionLink
              key={item.href}
              href={item.href}
              data-card
              className="group relative flex flex-col bg-ink-2 p-7 transition-colors duration-300 hover:bg-ink-2/60 focus-visible:bg-ink-2/60 lg:p-9"
            >
              <TickFrame />

              {/* index band: oversized mono numeral + polar icon mount */}
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-[clamp(1.875rem,2.6vw,2.375rem)] leading-none tracking-[0.06em] text-steel/40 transition-colors duration-300 group-hover:text-accent group-focus-visible:text-accent">
                  {item.no}
                </span>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-steel/16 transition-colors duration-300 group-hover:border-steel/40 group-focus-visible:border-steel/40">
                  <Icon
                    name={item.icon as IconName}
                    className="h-5 w-5 text-steel transition-colors duration-300 group-hover:text-white group-focus-visible:text-white"
                  />
                </span>
              </div>

              {/* divider: hairline with an accent draw on hover/focus */}
              <span aria-hidden className="relative mt-5 block h-px w-full bg-steel/16">
                <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-[450ms] ease-io group-hover:scale-x-100 group-focus-visible:scale-x-100" />
              </span>

              {/* body */}
              <h3 className="mt-5 font-sans text-[clamp(1.25rem,2vw,1.5rem)] font-medium leading-snug tracking-[-0.01em] text-white">
                {item.title}
              </h3>
              <p className="mb-7 mt-3 text-sm leading-relaxed text-white/60">{item.summary}</p>

              {/* action band */}
              <span className="mt-auto flex items-center justify-between gap-2 border-t border-steel/16 pt-4 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-steel transition-colors duration-300 group-hover:text-white group-focus-visible:text-white">
                View Division
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden
                  className="transition-transform duration-300 group-hover:-rotate-45 group-focus-visible:-rotate-45"
                >
                  <path d="M2 7h10M8 3l4 4-4 4" />
                </svg>
              </span>
            </TransitionLink>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
