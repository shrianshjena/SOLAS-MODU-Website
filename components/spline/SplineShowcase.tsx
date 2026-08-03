import { StationHeader } from "@/components/devices/StationHeader";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { SplineScene } from "./SplineScene";
import type { ImageKey } from "@/content/assets";

export interface SplineShowcaseProps {
  /** StationHeader eyebrow, e.g. "OBJ 01 / EQUIPMENT MODEL" */
  eyebrow: string;
  heading: string;
  description: string;
  sceneUrl: string;
  poster: ImageKey;
  posterAlt: string;
  /** mono corner caption inside the scene frame */
  label?: string;
  /** optional right-aligned StationHeader meta */
  meta?: string;
}

/**
 * Dark showcase section for a Spline model: the 5/7 signature split with copy
 * left and the fallback-first SplineScene right. Rendered through the
 * ServicePageLayout children slot (between capabilities and proof).
 */
export function SplineShowcase({
  eyebrow,
  heading,
  description,
  sceneUrl,
  poster,
  posterAlt,
  label,
  meta,
}: SplineShowcaseProps) {
  return (
    <section className="u-chart-border relative overflow-hidden bg-ink">
      <div className="u-shell grid gap-12 py-[clamp(4.5rem,10vh,8rem)] lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-7 lg:col-span-5">
          <StationHeader eyebrow={eyebrow} meta={meta} />
          <h2 className="font-sans text-[clamp(1.5rem,2.8vw,2.25rem)] font-medium leading-tight tracking-[-0.01em] text-white">
            <TextReveal text={heading} />
          </h2>
          <Reveal>
            <p className="text-[0.9375rem] leading-[1.7] text-white/60">{description}</p>
          </Reveal>
        </div>
        <Reveal className="lg:col-span-7">
          <SplineScene
            sceneUrl={sceneUrl}
            poster={poster}
            posterAlt={posterAlt}
            label={label}
          />
        </Reveal>
      </div>
    </section>
  );
}
