"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { CUBIC } from "@/lib/motion";
import { useLoaderGate } from "@/components/providers/LoaderGate";
import { TransitionLink } from "@/components/providers/TransitionProvider";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { MobileMenu } from "./MobileMenu";

const serviceLinks = site.nav.filter((n) => "group" in n && n.group === "services");
const topLinks = [
  { label: "Home", href: "/" },
  { label: "Certificates", href: "/certificates" },
  { label: "Gallery", href: "/gallery" },
  { label: "Careers", href: "/careers" },
];

type NavTheme = "hero" | "hero-light" | "dark" | "light";

/** viewport-top offset (px) where the bar samples the section behind it */
const THEME_PROBE = 44;

/** bar ground per sampled theme (colors transition, opacity gate stays 700ms) */
const THEME_BAR: Record<NavTheme, string> = {
  hero: "border-b border-transparent bg-transparent",
  "hero-light": "border-b border-navy/10 bg-surface/90 backdrop-blur-md",
  dark: "border-b border-steel/10 bg-ink/85 backdrop-blur-md",
  light: "border-b border-navy/10 bg-surface/90 backdrop-blur-md",
};

/**
 * Fixed 64px chrome bar: text wordmark lockup, mono nav with a ring-dot
 * active indicator (Motion layoutId), a Services dropdown, and the sweep
 * button CTA. Hides on scroll-down / returns on scroll-up (GSAP off the
 * Lenis-driven scroll; GSAP owns the header transform) and stays hidden
 * until the loader reveals. A rAF-throttled probe samples the section
 * behind the bar via [data-nav-theme]: transparent with a text shadow over
 * subpage heroes ("hero"), surface glass with navy text over the light-lifted
 * home hero ("hero-light") and light sections, ink glass on dark sections.
 * While the mobile menu is open the bar reverts to the transparent hero
 * ground with white chrome so it stays legible over the ink overlay.
 */
export function Header() {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const { revealed } = useLoaderGate();
  const reduced = useReducedMotion();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navTheme, setNavTheme] = useState<NavTheme>("dark");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isServicePath = serviceLinks.some((s) => s.href === pathname);
  const onLight = navTheme === "light" || navTheme === "hero-light";

  // the overlay and its close control are lg:hidden but stay mounted: crossing
  // into lg with the menu open would strand a scroll-locked page, so close it
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mq.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 80,
        end: "max",
        onUpdate: (self) => {
          gsap.to(el, {
            yPercent: self.direction === 1 && self.scroll() > 160 ? -100 : 0,
            duration: 0.35,
            ease: "power3.out",
            overwrite: true,
          });
        },
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  /* theme probe: which [data-nav-theme] section sits under the bar */
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const zones = document.querySelectorAll<HTMLElement>("[data-nav-theme]");
      let next: NavTheme = "dark";
      for (let i = 0; i < zones.length; i += 1) {
        const r = zones[i].getBoundingClientRect();
        if (r.top <= THEME_PROBE && r.bottom > THEME_PROBE) {
          const value = zones[i].dataset.navTheme;
          if (value === "hero" || value === "hero-light" || value === "light" || value === "dark") next = value;
          break;
        }
      }
      setNavTheme((current) => (current === next ? current : next));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // layout mutations without a scroll event (filter swaps, accordions) also
    // move theme boundaries across the probe line
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(document.body);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      resizeObserver.disconnect();
    };
  }, [pathname, revealed]);

  const openServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const scheduleCloseServices = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setServicesOpen(false), 140);
  };

  return (
    <>
      <header
        ref={ref}
        className={cn(
          "fixed inset-x-0 top-0 h-16 [transition:background-color_300ms,border-color_300ms,backdrop-filter_300ms,opacity_700ms]",
          // above the z-[65] mobile menu overlay while open so the close X stays reachable
          menuOpen ? "z-[70]" : "z-[60]",
          // over the open ink overlay the surface glass would swallow the chrome; fall back to the transparent hero ground
          menuOpen ? THEME_BAR.hero : THEME_BAR[navTheme],
          revealed ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div
          className={cn(
            "u-shell flex h-full items-center justify-between gap-6",
            navTheme === "hero" && "u-text-nav-shadow",
          )}
        >
          <TransitionLink
            href="/"
            aria-label={`${site.name} home`}
            className={cn(
              "flex shrink-0 transition-colors",
              onLight && !menuOpen ? "text-navy" : "text-white",
            )}
          >
            <span className="font-sans text-lg font-semibold tracking-tight">{site.wordmark.primary}</span>
          </TransitionLink>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {topLinks.slice(0, 1).map((link) => (
              <NavItem
                key={link.href}
                href={link.href}
                label={link.label}
                active={pathname === link.href}
                onLight={onLight}
              />
            ))}

            {/* services dropdown */}
            <div
              className="relative"
              onMouseEnter={openServices}
              onMouseLeave={scheduleCloseServices}
            >
              <button
                type="button"
                aria-expanded={servicesOpen}
                aria-haspopup="true"
                onClick={() => setServicesOpen((o) => !o)}
                onFocus={openServices}
                className={cn(
                  "relative flex items-center gap-2 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.2em] transition-colors",
                  isServicePath
                    ? onLight
                      ? "text-navy"
                      : "text-white"
                    : onLight
                      ? "text-slate hover:text-navy"
                      : "text-white/90 hover:text-white",
                )}
              >
                {isServicePath && (
                  <motion.span
                    layoutId="nav-ring"
                    className="h-[5px] w-[5px] rounded-full border border-accent bg-accent"
                  />
                )}
                Services
                <svg width="8" height="5" viewBox="0 0 8 5" aria-hidden className={cn("transition-transform", servicesOpen && "rotate-180")}>
                  <path d="M1 1l3 3 3-3" stroke="currentColor" fill="none" />
                </svg>
              </button>
              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.22, ease: CUBIC.expo }}
                    className="absolute left-1/2 top-full min-w-64 -translate-x-1/2 border border-steel/16 bg-ink-2/95 p-2 backdrop-blur-md"
                    onMouseEnter={openServices}
                    onMouseLeave={scheduleCloseServices}
                  >
                    {serviceLinks.map((s, i) => (
                      <TransitionLink
                        key={s.href}
                        href={s.href}
                        onClick={() => setServicesOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 font-mono text-[0.625rem] uppercase tracking-[0.18em] transition-colors",
                          pathname === s.href ? "text-white" : "text-steel hover:bg-steel/5 hover:text-white",
                        )}
                      >
                        <span className="text-meta">{String(i + 1).padStart(2, "0")}</span>
                        {s.label}
                      </TransitionLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {topLinks.slice(1).map((link) => (
              <NavItem
                key={link.href}
                href={link.href}
                label={link.label}
                active={pathname === link.href}
                onLight={onLight}
              />
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <TransitionLink
              href={site.headerCta.href}
              className={cn(
                "group relative hidden border border-accent px-4 py-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] transition-colors md:block",
                onLight && !menuOpen ? "text-navy hover:bg-accent hover:text-white" : "text-white hover:bg-accent",
              )}
            >
              {site.headerCta.label}
            </TransitionLink>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            >
              <span
                className={cn(
                  "h-px w-5 transition-[transform,background-color]",
                  onLight && !menuOpen ? "bg-navy" : "bg-white",
                  menuOpen && "translate-y-[3.5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "h-px w-5 transition-[transform,background-color]",
                  onLight && !menuOpen ? "bg-navy" : "bg-white",
                  menuOpen && "-translate-y-[3.5px] -rotate-45",
                )}
              />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function NavItem({
  href,
  label,
  active,
  onLight,
}: {
  href: string;
  label: string;
  active: boolean;
  onLight: boolean;
}) {
  return (
    <TransitionLink
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-2 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.2em] transition-colors",
        active
          ? onLight
            ? "text-navy"
            : "text-white"
          : onLight
            ? "text-slate hover:text-navy"
            : "text-white/90 hover:text-white",
      )}
    >
      {active && (
        <motion.span
          layoutId="nav-ring"
          className="h-[5px] w-[5px] rounded-full border border-accent bg-accent"
        />
      )}
      {label}
    </TransitionLink>
  );
}
