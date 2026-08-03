"use client";

import { useEffect, useId, useRef, type MouseEvent } from "react";
import { motion } from "motion/react";
import type Lenis from "lenis";
import { Pic } from "@/components/ui/Pic";
import { CUBIC, DUR } from "@/lib/motion";
import type { Certificate } from "@/content/types";
import { certRasterFile } from "./CertificateRow";

interface CertificateViewerProps {
  cert: Certificate;
  /** prefers-reduced-motion: no shared-element morph, instant appearance */
  reduced: boolean;
  onClose: () => void;
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Focus-trapped certificate viewer (Motion owns the modal): the ledger row
 * expands into this panel via a shared layoutId. Clean-grade rendition through
 * Pic for ImageKey entries, plain img for /certs raster scans; PDF source
 * offered as a new-tab anchor. ESC and backdrop close; Lenis is stopped while
 * open; focus returns to the trigger via the parent explorer.
 */
export function CertificateViewer({ cert, reduced, onClose }: CertificateViewerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const raster = certRasterFile(cert);
  const isPdf = Boolean(cert.file && /\.pdf$/i.test(cert.file));
  const fade = reduced ? { duration: 0 } : { duration: DUR.fast, ease: CUBIC.expo };

  useEffect(() => {
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
  }, [onClose]);

  const alt = `${cert.title}, issued by ${cert.issuer}`;

  return (
    <>
      <motion.div
        aria-hidden
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={fade}
        className="fixed inset-0 z-[80] bg-ink/85"
      />
      <div
        className="fixed inset-0 z-[81] flex items-center justify-center p-4 sm:p-8"
        onClick={(e: MouseEvent<HTMLDivElement>) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          layoutId={reduced ? undefined : `cert-${cert.slug}`}
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fade}
          className="flex max-h-[88svh] w-full max-w-3xl flex-col overflow-hidden border border-steel/28 bg-ink-2"
        >
          {/* header */}
          <div className="flex items-start justify-between gap-6 border-b border-steel/16 px-5 py-4 sm:px-7">
            <div className="flex min-w-0 flex-col gap-1.5">
              <h2 id={titleId} className="font-sans text-base font-medium leading-snug text-white">
                {cert.title}
              </h2>
              <p className="font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-meta">
                {cert.issuer} · {cert.period}
              </p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close certificate viewer"
              className="flex h-10 w-10 shrink-0 items-center justify-center border border-steel/28 text-steel transition-colors duration-300 hover:border-accent hover:text-white"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="h-4 w-4"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* document scan: clean grade per DESIGN_SYSTEM.md section 8 */}
          <div
            tabIndex={0}
            role="region"
            aria-label={`${cert.title} document scan`}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-ink"
          >
            {cert.image ? (
              <Pic
                imageKey={cert.image}
                alt={alt}
                sizes="(min-width: 832px) 768px, 92vw"
                grade="clean"
              />
            ) : raster ? (
              // raster scans under /certs bypass the pipeline; render ungraded
              // eslint-disable-next-line @next/next/no-img-element
              <img src={raster} alt={alt} decoding="async" className="block h-auto w-full" />
            ) : null}
          </div>

          {/* source document */}
          {isPdf && cert.file && (
            <div className="flex items-center justify-between gap-4 border-t border-steel/16 px-5 py-3 sm:px-7">
              <span className="font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-meta">
                Source document
              </span>
              <a
                href={cert.file}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-6 items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-steel transition-colors duration-300 hover:text-white"
              >
                Open PDF
                <span className="sr-only">(opens in a new tab)</span>
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                >
                  <path d="M7 17L17 7M9 7h8v8" />
                </svg>
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
