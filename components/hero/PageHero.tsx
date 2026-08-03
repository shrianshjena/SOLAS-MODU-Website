"use client";

import { StationHeader } from "@/components/devices/StationHeader";
import { ContourField } from "@/components/devices/ContourField";
import { DraftingPlan } from "@/components/devices/DraftingPlan";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Pic } from "@/components/ui/Pic";
import { Decode } from "@/components/ui/Decode";
import { ScrollCue } from "@/components/ui/ScrollCue";
import type { ImageKey } from "@/content/assets";

interface PageHeroProps {
  eyebrow: string;
  heading: string;
  lede: string;
  image?: ImageKey;
  imageAlt?: string;
  /** breadcrumb telegram, e.g. "HOME / SERVICES / ADVANCED NDT" */
  breadcrumb?: string;
  /**
   * LOG ENTRY line for the bottom instrument rail (service pages only).
   * When set, the hero appends a hairline rail with the animated scroll cue
   * and the fact decoding in the instrument voice; without it the hero is
   * unchanged (certificates / gallery / careers / legal).
   */
  fact?: string;
  /**
   * Background device for the image-less hero: "contour" keeps the bathymetric
   * field (legal pages), "plan" renders the naval drafting field (certificates
   * and gallery, client decision 2026-07-30 replacing the concentric ovals).
   */
  device?: "contour" | "plan";
  /**
   * Understated fine-print line under the lede (mono, low-alpha): the
   * gallery's imagery disclaimer. Rendered only when present.
   */
  note?: string;
}

/**
 * Subpage hero: dark band with the survey-graded image (or the contour field
 * when no image fits), breadcrumb telegram, decoding eyebrow, display heading
 * through masked word reveals, and the lede. Service pages add the bottom
 * instrument rail: scroll cue + a maritime LOG ENTRY fact.
 */
export function PageHero({
  eyebrow,
  heading,
  lede,
  image,
  imageAlt,
  breadcrumb,
  fact,
  device = "contour",
  note,
}: PageHeroProps) {
  return (
    <section data-nav-theme="hero" className="relative flex min-h-[62svh] flex-col justify-end overflow-hidden bg-ink">
      {image ? (
        <>
          {/* the wrapper owns the absolute fill: Pic's own .u-media utility
              computes position relative and outranks a passed `absolute`
              class, which silently put the image IN FLOW and stacked the
              whole copy column below the fold (the "must scroll to reach
              content" report) */}
          <div className="absolute inset-0">
            <Pic
              imageKey={image}
              alt={imageAlt ?? ""}
              sizes="100vw"
              grade="survey"
              priority
              className="h-full w-full"
            />
          </div>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(8,16,32,0.82) 0%, rgba(8,16,32,0.45) 55%, rgba(8,16,32,0.2))",
            }}
          />
          {/* top fade: the transparent hero-theme header needs contrast even
              over bright sky at the top edge of the image */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-24"
            style={{ background: "linear-gradient(to bottom, rgba(8,16,32,0.8), transparent)" }}
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/2"
            style={{ background: "linear-gradient(to top, #081020 8%, transparent)" }}
          />
        </>
      ) : device === "plan" ? (
        <DraftingPlan />
      ) : (
        <ContourField />
      )}

      <div className="u-shell relative z-10 flex flex-col gap-6 pb-16 pt-36">
        {breadcrumb && (
          <Decode
            text={breadcrumb}
            className="font-mono text-[0.5625rem] uppercase tracking-[0.28em] text-meta"
          />
        )}
        <StationHeader eyebrow={eyebrow} />
        <h1 className="max-w-3xl font-sans text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.015em] text-white">
          <TextReveal text={heading} />
        </h1>
        <Reveal>
          <p className="max-w-2xl text-[clamp(1rem,1.2vw,1.15rem)] leading-relaxed text-white/75">
            {lede}
          </p>
        </Reveal>

        {note && (
          /* deliberately understated: fine print in the instrument voice at
             low alpha (client request 2026-08-03) */
          <Reveal delay={0.4}>
            <p className="max-w-2xl font-mono text-[0.625rem] leading-[1.7] text-white/40">
              {note}
            </p>
          </Reveal>
        )}

        {fact && (
          /* bottom instrument rail: scroll cue + LOG ENTRY fact. Sits in the
             darkest zone of the bottom fade; mobile stacks fact first, cue at
             the bottom edge where the affordance belongs. */
          <div className="mt-2 flex flex-col gap-6 border-t border-steel/10 pt-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
            <Reveal delay={1.2} y={8} className="order-2 shrink-0 sm:order-none">
              <ScrollCue label="SCROLL" className="flex" />
            </Reveal>
            <div className="order-1 max-w-[26rem] sm:order-none">
              <span className="flex items-center gap-2">
                <span aria-hidden className="h-[5px] w-[5px] shrink-0 rounded-full border border-accent" />
                <Decode
                  text="LOG ENTRY"
                  delay={0.7}
                  className="font-mono text-[0.5625rem] uppercase tracking-[0.28em] text-steel"
                />
              </span>
              <Decode
                reserveLayout
                as="p"
                text={fact}
                delay={1.0}
                className="mt-2 font-mono text-[0.625rem] leading-[1.7] tracking-[0.02em] text-white/65 sm:text-[0.6875rem]"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
