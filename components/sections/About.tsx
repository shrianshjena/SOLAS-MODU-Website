"use client";

import { StationHeader } from "@/components/devices/StationHeader";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { TickFrame } from "@/components/ui/TickFrame";
import { Pic } from "@/components/ui/Pic";
import { home } from "@/content/pages/home";

/**
 * STN 01: light-surface introduction. Name-meaning heading, migrated intro
 * copy, evening-rig image in a reticle frame, and the company stat row.
 */
export function About() {
  const { intro } = home;

  return (
    <section id="about" data-nav-theme="light" className="bg-surface">
      <div className="u-shell py-[clamp(4.5rem,10vh,8rem)]">
        <StationHeader eyebrow={intro.eyebrow} meta="BRG 001° · MUMBAI" onLight />

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="flex flex-col gap-8 lg:col-span-5">
            <h2 className="font-sans text-[clamp(1.625rem,3.2vw,2.625rem)] font-medium leading-tight tracking-[-0.01em] text-navy">
              <TextReveal text={intro.heading} />
            </h2>
            {intro.paragraphs.map((p) => (
              <Reveal key={p.slice(0, 24)}>
                <p className="text-[0.9375rem] leading-[1.7] text-slate">{p}</p>
              </Reveal>
            ))}
          </div>

          <div className="lg:col-span-7">
            <Reveal className="group relative">
              <TickFrame size={14} />
              <Pic
                imageKey={intro.image}
                alt={intro.imageAlt}
                sizes="(min-width: 1024px) 55vw, 100vw"
                grade="survey"
                className="aspect-[16/10]"
              />
            </Reveal>
          </div>
        </div>

        {/* stat row */}
        <Reveal
          selector="[data-stat]"
          className="mt-16 grid grid-cols-2 gap-px border border-slate/10 bg-slate/10 lg:grid-cols-4"
        >
          {intro.stats.map((stat) => (
            <div key={stat.label} data-stat className="flex flex-col gap-2 bg-surface p-6 lg:p-8">
              <span className="font-sans text-[clamp(2rem,4vw,3.25rem)] font-semibold tracking-tight text-accent">
                <Counter value={stat.value} />
              </span>
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-navy">
                {stat.label}
              </span>
              {stat.caption && (
                <span className="font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-slate/70">
                  {stat.caption}
                </span>
              )}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
