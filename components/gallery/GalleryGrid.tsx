"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import { Pic } from "@/components/ui/Pic";
import { Lightbox } from "@/components/gallery/Lightbox";
import { CUBIC, DUR, STAGGER } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";
import type { GalleryItem } from "@/content/types";

type Category = GalleryItem["category"];
type Filter = Category | "all";

/** tiles per Reveal batch: each batch gets its own ScrollTrigger + stagger */
const BATCH_SIZE = 12;

/**
 * md+ editorial rhythm: every 12 tiles form five fully filled rows on a
 * 6-column grid (3+3 / 2+2+2 / 4+2 / 2+2+2 / 2+4). Aspect ratios are paired
 * per row so cells in the same row share a height.
 */
const PATTERN = [
  { span: "md:col-span-3", aspect: "md:aspect-[3/2]", sizes: "(min-width: 640px) 50vw, 100vw" },
  { span: "md:col-span-3", aspect: "md:aspect-[3/2]", sizes: "(min-width: 640px) 50vw, 100vw" },
  { span: "md:col-span-2", aspect: "md:aspect-[4/5]", sizes: "(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw" },
  { span: "md:col-span-2", aspect: "md:aspect-[4/5]", sizes: "(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw" },
  { span: "md:col-span-2", aspect: "md:aspect-[4/5]", sizes: "(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw" },
  { span: "md:col-span-4", aspect: "md:aspect-[16/9]", sizes: "(min-width: 768px) 66vw, (min-width: 640px) 50vw, 100vw" },
  { span: "md:col-span-2", aspect: "md:aspect-[8/9]", sizes: "(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw" },
  { span: "md:col-span-2", aspect: "md:aspect-[4/5]", sizes: "(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw" },
  { span: "md:col-span-2", aspect: "md:aspect-[4/5]", sizes: "(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw" },
  { span: "md:col-span-2", aspect: "md:aspect-[4/5]", sizes: "(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw" },
  { span: "md:col-span-2", aspect: "md:aspect-[8/9]", sizes: "(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw" },
  { span: "md:col-span-4", aspect: "md:aspect-[16/9]", sizes: "(min-width: 768px) 66vw, (min-width: 640px) 50vw, 100vw" },
] as const;

function labelFor(filter: Filter): string {
  return filter === "all" ? "ALL" : filter.replace(/-/g, " ").toUpperCase();
}

interface GalleryGridProps {
  items: GalleryItem[];
}

/**
 * Filterable field-log grid: category chips (Motion layoutId active pill),
 * hairline-gap masonry-ish grid of archive-graded thumbnails revealed in
 * viewport batches (one GSAP Reveal per batch, never all at once), mono
 * caption chips, and the spring-driven Lightbox on tile click.
 */
export function GalleryGrid({ items }: GalleryGridProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduced = useReducedMotion();

  const categories = useMemo<Filter[]>(() => {
    const seen = items.reduce<Category[]>(
      (acc, item) => (acc.includes(item.category) ? acc : [...acc, item.category]),
      [],
    );
    return ["all", ...seen];
  }, [items]);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((item) => item.category === filter)),
    [items, filter],
  );

  const batches = useMemo(
    () =>
      Array.from({ length: Math.ceil(filtered.length / BATCH_SIZE) }, (_, b) =>
        filtered.slice(b * BATCH_SIZE, (b + 1) * BATCH_SIZE),
      ),
    [filtered],
  );

  const selectFilter = (next: Filter) => {
    setFilter(next);
    setOpenIndex(null);
  };

  return (
    <section className="u-chart-border bg-ink">
      <div className="u-shell flex flex-col gap-10 py-[clamp(4.5rem,10vh,8rem)]">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <div role="group" aria-label="Filter photographs by category" className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const active = filter === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => selectFilter(category)}
                  aria-pressed={active}
                  className={cn(
                    "relative rounded-full border px-4 py-2 font-mono text-[0.625rem] uppercase tracking-[0.18em] transition-colors duration-300",
                    active
                      ? "border-accent text-white"
                      : "border-steel/28 text-steel hover:border-accent hover:text-white",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="gallery-filter-pill"
                      aria-hidden
                      transition={
                        reduced ? { duration: 0 } : { duration: DUR.fast, ease: CUBIC.expo }
                      }
                      className="absolute inset-0 rounded-full bg-accent"
                    />
                  )}
                  <span className="relative z-10">{labelFor(category)}</span>
                </button>
              );
            })}
          </div>
          <p
            aria-live="polite"
            className="font-mono text-[0.625rem] uppercase tracking-[0.28em] text-meta"
          >
            {String(filtered.length).padStart(2, "0")} FRAMES · {labelFor(filter)}
          </p>
        </div>

        {/* Motion fades the container on filter swap; GSAP owns the per-tile reveals */}
        <motion.div
          key={filter}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DUR.fast, ease: CUBIC.expo }}
          className="flex flex-col gap-px border border-steel/16 bg-steel/16"
        >
          {batches.map((batch, b) => (
            <Reveal
              key={b}
              selector="[data-shot]"
              stagger={STAGGER.cards}
              className="grid grid-cols-1 gap-px bg-steel/16 sm:grid-cols-2 md:grid-cols-6"
            >
              {batch.map((item, j) => {
                const globalIndex = b * BATCH_SIZE + j;
                const slot = PATTERN[j % PATTERN.length];
                return (
                  <figure
                    key={item.key}
                    data-shot
                    className={cn("flex flex-col bg-ink", slot.span)}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(globalIndex)}
                      aria-haspopup="dialog"
                      aria-label={`Open ${item.caption}`}
                      className="block w-full"
                    >
                      <Pic
                        imageKey={item.key}
                        alt={item.alt}
                        sizes={slot.sizes}
                        grade="archive"
                        className={cn("aspect-[4/3] w-full", slot.aspect)}
                      />
                    </button>
                    <figcaption className="flex min-w-0 flex-1 items-center gap-2 p-3">
                      <span className="shrink-0 font-mono text-[0.5625rem] tracking-[0.25em] text-meta">
                        {String(globalIndex + 1).padStart(2, "0")}
                      </span>
                      <span className="inline-flex min-w-0 items-center gap-2 rounded-full border border-steel/28 px-3 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-steel">
                        <span
                          aria-hidden
                          className="h-[5px] w-[5px] shrink-0 rounded-full border border-accent"
                        />
                        <span className="truncate">{item.caption}</span>
                      </span>
                    </figcaption>
                  </figure>
                );
              })}
            </Reveal>
          ))}
        </motion.div>
      </div>

      <Lightbox items={filtered} openIndex={openIndex} onClose={() => setOpenIndex(null)} />
    </section>
  );
}
