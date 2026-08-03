"use client";

import { StationHeader } from "@/components/devices/StationHeader";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { TickFrame } from "@/components/ui/TickFrame";
import { Pic } from "@/components/ui/Pic";
import { home } from "@/content/pages/home";

/**
 * STN 04: leadership on the light surface. Both leaders render as matching
 * text cards (TickFrame, credential chips, bios); the CEO portrait hangs
 * beside them in a reticle frame at archive grade (B&W at rest, colour on
 * hover).
 */
export function Leadership() {
  const { leadership } = home;
  const portrait = leadership.leaders.find((leader) => leader.image);

  return (
    <section id="leadership" data-nav-theme="light" className="bg-surface">
      <div className="u-shell py-[clamp(4.5rem,10vh,8rem)]">
        <StationHeader eyebrow={leadership.eyebrow} onLight />

        <h2 className="mt-10 max-w-2xl font-sans text-[clamp(1.625rem,3.2vw,2.625rem)] font-medium leading-tight tracking-[-0.01em] text-navy">
          <TextReveal text={leadership.heading} />
        </h2>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* portrait aside */}
          {portrait?.image && (
            <Reveal className="lg:col-span-4">
              <div className="group relative max-w-md">
                <TickFrame size={14} />
                {/* archive by explicit client decision 2026-08-03: THIS image
                    only is B&W at rest and colours on hover, an exception to
                    the light-plate rule (which otherwise keeps light-ground
                    images colour-at-rest) */}
                <Pic
                  imageKey={portrait.image}
                  alt={portrait.imageAlt ?? portrait.name}
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  grade="archive"
                  className="aspect-[3/4]"
                />
              </div>
            </Reveal>
          )}

          {/* matching leader cards */}
          <div className="flex flex-col gap-8 lg:col-span-8">
            {leadership.leaders.map((leader) => (
              <Reveal key={leader.name} className="group relative border border-slate/15 bg-white/40 p-7">
                <TickFrame />
                <h3 className="font-sans text-xl font-medium text-navy">{leader.name}</h3>
                <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.22em] text-accent">
                  {leader.role}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {leader.credentials.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-2 rounded-full border border-slate/20 px-3 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-slate"
                    >
                      <span aria-hidden className="h-[5px] w-[5px] rounded-full border border-accent" />
                      {c}
                    </span>
                  ))}
                </div>
                {leader.bio.map((p) => (
                  <p key={p.slice(0, 24)} className="mt-4 text-[0.9375rem] leading-[1.7] text-slate">
                    {p}
                  </p>
                ))}
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
