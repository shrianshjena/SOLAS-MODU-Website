"use client";

import type { MouseEvent, ReactNode } from "react";
import type { Certificate } from "@/content/types";
import { cn } from "@/lib/cn";

/** Raster scan under /certs (jpg/png) that can render in the in-page viewer. */
export function certRasterFile(cert: Certificate): string | null {
  return cert.file && /\.(jpe?g|png)$/i.test(cert.file) ? cert.file : null;
}

/** True when the certificate expands into the shared-element viewer. */
export function isViewable(cert: Certificate): boolean {
  return Boolean(cert.image || certRasterFile(cert));
}

interface CertificateRowProps {
  cert: Certificate;
  /** 1-based position in the filtered ledger */
  index: number;
  /** open the viewer; receives the trigger element for focus return */
  onView: (cert: Certificate, trigger: HTMLElement) => void;
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-3.5 w-3.5 transition-transform duration-300 group-hover:-rotate-45", className)}
    >
      <path d="M5 12h14M14 7l5 5-5 5" />
    </svg>
  );
}

const ROW_CLASSES =
  "group flex w-full text-left transition-colors duration-300 hover:bg-white/60 focus-visible:bg-white/60";

/**
 * Ledger row for the certificate registry: mono index, title, issuer chip,
 * period in accent mono, and the view action. Image-backed entries render a
 * button that opens the viewer; PDF-only entries are plain anchors opening in
 * a new tab.
 */
export function CertificateRow({ cert, index, onView }: CertificateRowProps) {
  const viewable = isViewable(cert);

  const body: ReactNode = (
    <span className="grid w-full grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-x-4 px-2 py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:gap-x-6 sm:px-3">
      <span className="pt-1 font-mono text-[0.625rem] tracking-[0.25em] text-slate/50">
        {String(index).padStart(2, "0")}
      </span>

      <span className="flex min-w-0 flex-col gap-2.5">
        <span className="font-sans text-[clamp(0.9375rem,1.3vw,1.0625rem)] font-medium leading-snug text-navy">
          {cert.title}
        </span>
        <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="inline-flex min-w-0 max-w-full items-center gap-2 rounded-full border border-slate/25 px-3 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-slate">
            <span aria-hidden className="h-[5px] w-[5px] shrink-0 rounded-full border border-accent" />
            <span className="truncate">{cert.issuer}</span>
          </span>
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-accent">
            {cert.period}
          </span>
        </span>
      </span>

      <span className="col-start-2 mt-3 inline-flex min-h-6 items-center gap-2 self-center font-mono text-[0.625rem] uppercase tracking-[0.2em] text-slate transition-colors duration-300 group-hover:text-accent sm:col-start-3 sm:mt-0">
        {viewable ? "View" : "Open PDF"}
        {!viewable && <span className="sr-only">(opens in a new tab)</span>}
        <Arrow />
      </span>
    </span>
  );

  if (viewable) {
    return (
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={(e: MouseEvent<HTMLButtonElement>) => onView(cert, e.currentTarget)}
        className={ROW_CLASSES}
      >
        {body}
      </button>
    );
  }

  if (cert.file) {
    return (
      <a href={cert.file} target="_blank" rel="noopener noreferrer" className={ROW_CLASSES}>
        {body}
      </a>
    );
  }

  return <div className={ROW_CLASSES}>{body}</div>;
}
