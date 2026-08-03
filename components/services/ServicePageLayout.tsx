"use client";

import { PageHero } from "@/components/hero/PageHero";
import { StationHeader } from "@/components/devices/StationHeader";
import { ContourField } from "@/components/devices/ContourField";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { TickFrame } from "@/components/ui/TickFrame";
import { Pic } from "@/components/ui/Pic";
import { SweepButton } from "@/components/ui/SweepButton";
import { TransitionLink } from "@/components/providers/TransitionProvider";
import { EmergencyStrip } from "@/components/chrome/EmergencyStrip";
import { Footer } from "@/components/chrome/Footer";
import type { ServicePageContent } from "@/content/types";
import type { ReactNode } from "react";

interface ServicePageLayoutProps {
  content: ServicePageContent;
  /** page-specific signature moment rendered between capabilities and proof */
  children?: ReactNode;
}

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-steel/28 px-3 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-steel">
      <span aria-hidden className="h-[5px] w-[5px] rounded-full border border-accent" />
      {label}
    </span>
  );
}

/**
 * Shared template for the six service routes: PageHero, light intro (5/7 with
 * optional image + chips), capability rows on dark, the optional page-specific
 * signature slot, proof band, Why block, CTA band, emergency strip, footer.
 */
export function ServicePageLayout({ content, children }: ServicePageLayoutProps) {
  const crumbLabel = content.heading.toUpperCase();

  return (
    <>
      <main id="main">
        <PageHero
          eyebrow={content.eyebrow}
          heading={content.heading}
          lede={content.lede}
          image={content.heroImage}
          imageAlt={content.heroImageAlt}
          breadcrumb={`HOME / SERVICES / ${crumbLabel}`}
          fact={content.fact}
        />

        {/* intro: light surface, 5/7 split */}
        <section data-nav-theme="light" className="bg-surface">
          <div className="u-shell grid gap-12 py-[clamp(4.5rem,10vh,8rem)] lg:grid-cols-12 lg:gap-16">
            <div className="flex flex-col gap-7 lg:col-span-6">
              <h2 className="font-sans text-[clamp(1.5rem,2.8vw,2.25rem)] font-medium leading-tight tracking-[-0.01em] text-navy">
                <TextReveal text={content.intro.heading} />
              </h2>
              {content.intro.paragraphs.map((p) => (
                <Reveal key={p.slice(0, 24)}>
                  <p className="text-[0.9375rem] leading-[1.7] text-slate">{p}</p>
                </Reveal>
              ))}
              {content.intro.chips && (
                <Reveal className="flex flex-wrap gap-2">
                  {content.intro.chips.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-2 rounded-full border border-slate/20 px-3 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-slate"
                    >
                      <span aria-hidden className="h-[5px] w-[5px] rounded-full border border-accent" />
                      {c}
                    </span>
                  ))}
                </Reveal>
              )}
            </div>
            {content.intro.image && (
              <Reveal className="lg:col-span-6">
                <div className="group relative">
                  <TickFrame size={14} />
                  <Pic
                    imageKey={content.intro.image}
                    alt={content.intro.imageAlt ?? ""}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    grade="survey"
                    className="aspect-[16/11]"
                  />
                </div>
              </Reveal>
            )}
          </div>
        </section>

        {/* capabilities on dark */}
        <section className="u-chart-border relative overflow-hidden bg-ink">
          <ContourField />
          <div className="u-shell relative py-[clamp(4.5rem,10vh,8rem)]">
            <StationHeader
              eyebrow={content.capabilities.eyebrow}
              meta={`${content.capabilities.items.length} CAPABILITIES`}
            />
            <h2 className="mt-10 max-w-2xl font-sans text-[clamp(1.5rem,2.8vw,2.25rem)] font-medium leading-tight tracking-[-0.01em] text-white">
              <TextReveal text={content.capabilities.heading} />
            </h2>

            <div className="mt-14 flex flex-col gap-px border border-steel/16 bg-steel/16">
              {content.capabilities.items.map((item) => (
                <Reveal key={item.no} className="group relative bg-ink-2">
                  <TickFrame />
                  <div className="grid gap-6 p-7 lg:grid-cols-12 lg:gap-10 lg:p-9">
                    <span className="font-mono text-[0.625rem] tracking-[0.25em] text-meta lg:col-span-1">
                      {item.no}
                    </span>
                    <div className="flex flex-col gap-3 lg:col-span-7">
                      <h3 className="font-sans text-[clamp(1.125rem,1.8vw,1.375rem)] font-medium text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-white/60">{item.body}</p>
                      {item.chips && (
                        <div className="mt-1 flex flex-wrap gap-2">
                          {item.chips.map((c) => (
                            <Chip key={c} label={c} />
                          ))}
                        </div>
                      )}
                    </div>
                    {item.image && (
                      <div className="lg:col-span-4">
                        {/* archive: B&W at rest, colour on hover (client style
                            decision 2026-07-30); plate was the inverse */}
                        <Pic
                          imageKey={item.image}
                          alt={item.imageAlt ?? ""}
                          sizes="(min-width: 1024px) 30vw, 100vw"
                          grade="archive"
                          className="aspect-[16/10]"
                        />
                      </div>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* page-specific signature moment */}
        {children}

        {/* proof band */}
        {content.proof && (
          <section data-nav-theme="light" className="bg-surface">
            <div className="u-shell py-[clamp(4rem,9vh,7rem)]">
              <StationHeader eyebrow={content.proof.eyebrow} onLight />
              <h2 className="mt-8 max-w-2xl font-sans text-[clamp(1.5rem,2.8vw,2.25rem)] font-medium leading-tight tracking-[-0.01em] text-navy">
                <TextReveal text={content.proof.heading} />
              </h2>
              <Reveal selector="[data-proof]" className="mt-10 flex flex-col divide-y divide-slate/10 border-y border-slate/10">
                {content.proof.points.map((point) => {
                  const inner = (
                    <>
                      <div className="flex min-w-0 flex-col gap-1">
                        <span className="font-sans text-base font-medium text-navy">
                          {point.title}
                        </span>
                        <span className="text-sm leading-relaxed text-slate">{point.detail}</span>
                      </div>
                      <span className="shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-accent">
                        {point.period ?? ""}
                      </span>
                    </>
                  );
                  return point.href ? (
                    <TransitionLink
                      key={point.title}
                      href={point.href}
                      data-proof
                      className="flex items-center justify-between gap-6 py-5 transition-colors hover:bg-white/50"
                    >
                      {inner}
                    </TransitionLink>
                  ) : (
                    <div key={point.title} data-proof className="flex items-center justify-between gap-6 py-5">
                      {inner}
                    </div>
                  );
                })}
              </Reveal>
            </div>
          </section>
        )}

        {/* why + cta */}
        <section className="u-chart-border relative overflow-hidden bg-ink">
          <div className="u-shell grid gap-12 py-[clamp(4.5rem,10vh,8rem)] lg:grid-cols-2 lg:gap-20">
            <div className="flex flex-col gap-6">
              <h2 className="font-sans text-[clamp(1.5rem,2.8vw,2.25rem)] font-medium leading-tight tracking-[-0.01em] text-white">
                <TextReveal text={content.why.heading} />
              </h2>
              <Reveal>
                <p className="text-[0.9375rem] leading-[1.7] text-white/70">{content.why.body}</p>
              </Reveal>
            </div>
            <Reveal className="flex flex-col items-start justify-center gap-6">
              <h2 className="font-sans text-[clamp(1.25rem,2.2vw,1.75rem)] font-medium leading-snug text-white">
                {content.cta.heading}
              </h2>
              {content.cta.body && (
                <p className="text-sm leading-relaxed text-white/60">{content.cta.body}</p>
              )}
              <div className="flex flex-wrap gap-4">
                <SweepButton href={content.cta.primary.href} variant="primary">
                  {content.cta.primary.label}
                </SweepButton>
                {content.cta.secondary && (
                  <SweepButton href={content.cta.secondary.href} variant="secondary">
                    {content.cta.secondary.label}
                  </SweepButton>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <EmergencyStrip />
      <Footer />
    </>
  );
}
