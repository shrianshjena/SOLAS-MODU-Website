"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import type Lenis from "lenis";
import { CUBIC } from "@/lib/motion";
import { TransitionLink } from "@/components/providers/TransitionProvider";
import { AISReadout } from "@/components/devices/AISReadout";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Full-screen ink overlay for small screens: oversized links cascade in
 * (Motion stagger), AIS strip at the bottom. Locks Lenis while open, closes
 * on ESC and on navigation, and keeps focus inside while open.
 */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  // scroll lock + ESC + focus containment
  useEffect(() => {
    if (!open) return;
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        );
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
      }
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
  }, [open, onClose]);

  const links = site.nav;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[65] flex flex-col bg-ink lg:hidden"
        >
          <div className="u-shell flex flex-1 flex-col justify-center gap-1 overflow-y-auto py-24">
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, delay: 0.05 + i * 0.045, ease: CUBIC.expo }}
              >
                <TransitionLink
                  href={link.href}
                  onClick={onClose}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={cn(
                    "group flex items-baseline gap-4 py-2",
                    pathname === link.href ? "text-white" : "text-white/70",
                  )}
                >
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.25em] text-meta">
                    {String(i).padStart(2, "0")}
                  </span>
                  <span className="font-sans text-3xl font-medium tracking-tight transition-colors group-hover:text-white sm:text-4xl">
                    {link.label}
                  </span>
                  {pathname === link.href && (
                    <span aria-hidden className="h-[6px] w-[6px] self-center rounded-full bg-accent" />
                  )}
                </TransitionLink>
              </motion.div>
            ))}
          </div>

          <div className="u-shell border-t border-steel/10 py-5">
            <AISReadout text={site.ais} className="block truncate" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
