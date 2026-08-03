"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Certificate } from "@/content/types";
import { CUBIC, DUR } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";
import { CertificateRow, isViewable } from "./CertificateRow";
import { CertificateViewer } from "./CertificateViewer";

interface FilterOption {
  key: string;
  label: string;
}

interface CertificateExplorerProps {
  filters: FilterOption[];
  certificates: Certificate[];
}

/**
 * The document registry on the light surface. Motion is the engine here:
 * the active filter chip carries a layoutId pill, filtering reflows the
 * ledger with layout animations (popLayout exits), and image-backed rows
 * expand into the focus-trapped CertificateViewer via a shared layoutId.
 * Reduced motion: instant swaps, no layout animation, no morph.
 */
export function CertificateExplorer({ filters, certificates }: CertificateExplorerProps) {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState(filters[0]?.key ?? "all");
  const [open, setOpen] = useState<Certificate | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const f of filters) {
      map[f.key] =
        f.key === "all"
          ? certificates.length
          : certificates.filter((c) => c.category === f.key).length;
    }
    return map;
  }, [filters, certificates]);

  const filtered = useMemo(
    () => (filter === "all" ? certificates : certificates.filter((c) => c.category === filter)),
    [filter, certificates],
  );

  const openViewer = (cert: Certificate, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setOpen(cert);
  };

  const closeViewer = () => {
    setOpen(null);
    triggerRef.current?.focus();
    triggerRef.current = null;
  };

  /** arrow keys move focus and select; plain tab order also works */
  const onTabsKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const tabs = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>("[data-filter-tab]"),
    );
    const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (current === -1) return;
    e.preventDefault();
    const next =
      e.key === "ArrowRight"
        ? (current + 1) % tabs.length
        : (current - 1 + tabs.length) % tabs.length;
    const target = tabs[next];
    target.focus();
    const key = target.dataset.filterKey;
    if (key) setFilter(key);
  };

  const swap = reduced ? { duration: 0 } : { duration: DUR.fast, ease: CUBIC.expo };

  return (
    <section data-nav-theme="light" className="bg-surface">
      <div className="u-shell flex flex-col gap-8 py-[clamp(4.5rem,10vh,8rem)]">
        {/* filter tabs */}
        <div
          role="group"
          aria-label="Filter certificates by category"
          onKeyDown={onTabsKeyDown}
          className="flex flex-wrap gap-2"
        >
          {filters.map((f) => {
            const active = f.key === filter;
            return (
              <button
                key={f.key}
                type="button"
                data-filter-tab
                data-filter-key={f.key}
                aria-pressed={active}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "relative min-h-9 rounded-full border px-4 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.18em] transition-colors duration-300",
                  active
                    ? "border-navy text-white"
                    : "border-slate/25 text-slate hover:border-navy/60 hover:text-navy",
                )}
              >
                {active &&
                  (reduced ? (
                    <span aria-hidden className="absolute inset-0 rounded-full bg-navy" />
                  ) : (
                    <motion.span
                      aria-hidden
                      layoutId="cert-filter-pill"
                      transition={swap}
                      className="absolute inset-0 rounded-full bg-navy"
                    />
                  ))}
                <span className="relative z-10 inline-flex items-baseline gap-2">
                  {f.label}
                  <span
                    className={cn(
                      "text-[0.5rem] tracking-[0.1em]",
                      active ? "text-white/60" : "text-slate/50",
                    )}
                  >
                    {counts[f.key] ?? 0}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* registry readout */}
        <p
          aria-live="polite"
          className="font-mono text-[0.625rem] uppercase tracking-[0.25em] text-slate/60"
        >
          {filtered.length} of {certificates.length} documents
        </p>

        {/* ledger */}
        <ul className="flex flex-col border-t border-slate/15">
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((cert, i) => (
              <motion.li
                key={cert.slug}
                layout={!reduced}
                layoutId={!reduced && isViewable(cert) ? `cert-${cert.slug}` : undefined}
                initial={reduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -10 }}
                transition={swap}
                className="border-b border-slate/15 bg-surface"
              >
                <CertificateRow cert={cert} index={i + 1} onView={openViewer} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      {/* viewer modal */}
      <AnimatePresence>
        {open && (
          <CertificateViewer key={open.slug} cert={open} reduced={reduced} onClose={closeViewer} />
        )}
      </AnimatePresence>
    </section>
  );
}
