"use client";

import { StationHeader } from "@/components/devices/StationHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Pic } from "@/components/ui/Pic";
import { SweepButton } from "@/components/ui/SweepButton";
import { home } from "@/content/pages/home";

/**
 * Four-up strip from the field: archive grade thumbnails (B&W at rest, colour
 * on hover), linking through to the full gallery.
 */
export function GalleryTeaser() {
  const { galleryTeaser } = home;

  return (
    <section className="u-chart-border bg-ink">
      <div className="u-shell py-[clamp(4.5rem,10vh,8rem)]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="min-w-0">
            <StationHeader eyebrow={galleryTeaser.eyebrow} />
            <h2 className="mt-8 font-sans text-[clamp(1.625rem,3.2vw,2.625rem)] font-medium leading-tight tracking-[-0.01em] text-white">
              {galleryTeaser.heading}
            </h2>
          </div>
          <SweepButton href={galleryTeaser.cta.href} variant="secondary">
            {galleryTeaser.cta.label}
          </SweepButton>
        </div>

        <Reveal
          selector="[data-shot]"
          className="mt-12 grid grid-cols-2 gap-px border border-steel/16 bg-steel/16 lg:grid-cols-4"
        >
          {galleryTeaser.images.map((img) => (
            <div key={img.key} data-shot className="bg-ink">
              <Pic
                imageKey={img.key}
                alt={img.alt}
                sizes="(min-width: 1024px) 25vw, 50vw"
                grade="archive"
                className="aspect-[4/5]"
              />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
