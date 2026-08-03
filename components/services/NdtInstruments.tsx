import { StationHeader } from "@/components/devices/StationHeader";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { AScanWave } from "@/components/services/AScanWave";
import { CompareSlider } from "@/components/services/CompareSlider";
import { ndtStats } from "@/content/data/stats";
import { ndt } from "@/content/pages/ndt";

/**
 * LAB 01 / SIGNAL ROOM: the /ndt signature moment, slotted between the
 * capabilities and proof sections via ServicePageLayout children. Section copy
 * (eyebrow, heading, lede) lives in content/pages/ndt.ts (instruments); the
 * strings below are component-scoped instrument chrome (figure labels and the
 * station meta readout), device annotations rather than page copy.
 */
const CHROME = {
  meta: "GW SCREENING · LRUT",
  figA: "FIG 01 · A-SCAN TRACE · GAIN 62 DB",
  figB: "FIG 02 · RAW VS INTERPRETED · DRAG TO COMPARE",
} as const;

/** Section copy from content/; the band is always authored with it. */
const copy = ndt.instruments!;

export function NdtInstruments() {
  return (
    <section className="u-chart-border relative overflow-hidden bg-ink">
      <div className="u-shell py-[clamp(4.5rem,10vh,8rem)]">
        <StationHeader eyebrow={copy.eyebrow} meta={CHROME.meta} />

        <h2 className="mt-10 max-w-2xl font-sans text-[clamp(1.5rem,2.8vw,2.25rem)] font-medium leading-tight tracking-[-0.01em] text-white">
          <TextReveal text={copy.heading} />
        </h2>
        <Reveal>
          <p className="mt-6 max-w-2xl text-[0.9375rem] leading-[1.7] text-white/70">
            {copy.lede}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-12">
          <Reveal>
            <AScanWave />
            <p className="mt-3 font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-meta">
              {CHROME.figA}
            </p>
          </Reveal>
          <Reveal>
            <CompareSlider />
            <p className="mt-3 font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-meta">
              {CHROME.figB}
            </p>
          </Reveal>
        </div>

        {/* division figures, tick-up counters as in the home operations log */}
        <Reveal
          selector="[data-stat]"
          className="mt-14 grid gap-8 border-t border-steel/16 pt-10 sm:grid-cols-3"
        >
          {ndtStats.map((stat) => (
            <div key={stat.label} data-stat className="flex flex-col gap-2">
              <span className="font-sans text-[clamp(2rem,3.5vw,2.75rem)] font-semibold tracking-tight text-accent">
                <Counter value={stat.value} />
              </span>
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-white">
                {stat.label}
              </span>
              {stat.caption && (
                <span className="font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-meta">
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
