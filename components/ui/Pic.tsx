import { IMAGES, type ImageKey } from "@/content/assets";
import { cn } from "@/lib/cn";

type Grade = "survey" | "plate" | "archive" | "clean";

interface PicProps {
  imageKey: ImageKey;
  alt: string;
  /** sizes attribute for responsive selection, e.g. "(min-width: 1024px) 50vw, 100vw" */
  sizes?: string;
  /** photographic grade per DESIGN_SYSTEM.md section 8 */
  grade?: Grade;
  /** object-fit for the inner img; "contain" letterboxes inside the wrapper box */
  fit?: "cover" | "contain";
  /** above-the-fold images: eager + high fetch priority */
  priority?: boolean;
  /** eager-load at normal fetch priority (marquee copies that sit offscreen) */
  eager?: boolean;
  className?: string;
  imgClassName?: string;
}

/**
 * Deploy-agnostic responsive image: renders the pre-generated avif/webp width
 * variants from the build pipeline with intrinsic dimensions (CLS = 0).
 * Wrapper carries the grade treatment; the img itself stays clean.
 */
export function Pic({
  imageKey,
  alt,
  sizes = "100vw",
  grade = "survey",
  fit = "cover",
  priority = false,
  eager = false,
  className,
  imgClassName,
}: PicProps) {
  const entry = IMAGES[imageKey];
  const base = `/images/${entry.category}/${imageKey}`;
  const srcSet = (format: string) =>
    entry.widths.map((w) => `${base}-${w}.${format} ${w}w`).join(", ");
  const formats = entry.formats as readonly string[];
  const fallbackFormat = formats[formats.length - 1];
  const maxW = Math.max(...entry.widths);

  return (
    <span
      className={cn(
        "u-media block",
        grade === "survey" && "u-grade-survey",
        grade === "plate" && "u-grade-plate",
        grade === "archive" && "u-grade-archive",
        className,
      )}
    >
      <picture>
        {formats.includes("avif") && (
          <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
        )}
        {formats.includes("webp") && (
          <source type="image/webp" srcSet={srcSet("webp")} sizes={sizes} />
        )}
        <img
          src={`${base}-${maxW}.${fallbackFormat}`}
          alt={alt}
          width={entry.width}
          height={entry.height}
          loading={priority || eager ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className={cn(
            "block h-full w-full",
            fit === "contain" ? "object-contain" : "object-cover",
            imgClassName,
          )}
        />
      </picture>
    </span>
  );
}
