"use client";

import { StationHeader } from "@/components/devices/StationHeader";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Marquee } from "@/components/ui/Marquee";
import { Pic } from "@/components/ui/Pic";
import { home } from "@/content/pages/home";
import { clients } from "@/content/data/clients";

/**
 * STN 05: the client and class-society logo marquee on the light surface.
 * Every logo sits on a uniform white plate (several marks are JPEGs without
 * alpha, so the plates make their boxes invisible), full colour, contain-fit,
 * drifting continuously, with the accreditation chip row beneath.
 */
export function TrustedBy() {
  const { trustedBy } = home;

  return (
    <section id="trusted-by" data-nav-theme="light" className="border-t border-slate/10 bg-surface">
      <div className="u-shell py-[clamp(4.5rem,10vh,8rem)]">
        <StationHeader eyebrow={trustedBy.eyebrow} meta={`${clients.length} ORGANISATIONS`} onLight />

        <h2 className="mt-10 max-w-2xl font-sans text-[clamp(1.625rem,3.2vw,2.625rem)] font-medium leading-tight tracking-[-0.01em] text-navy">
          <TextReveal text={trustedBy.heading} />
        </h2>

        <Marquee duration={45} className="mt-14 border-y border-slate/10 py-6">
          {clients.map((client) => (
            <div
              key={client.key}
              className="mx-4 flex h-20 w-44 shrink-0 items-center justify-center border border-slate/10 bg-white px-5 py-3 sm:mx-5"
            >
              <Pic
                imageKey={client.key}
                alt={`${client.name} logo`}
                sizes="160px"
                grade="clean"
                fit="contain"
                eager
                className="h-full w-full"
              />
            </div>
          ))}
        </Marquee>

        <Reveal className="mt-10 flex flex-wrap gap-2">
          {trustedBy.accreditations.map((a) => (
            <span
              key={a}
              className="inline-flex items-center gap-2 rounded-full border border-slate/20 px-3 py-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-slate"
            >
              <span aria-hidden className="h-[5px] w-[5px] rounded-full border border-accent" />
              {a}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
