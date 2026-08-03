"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type Lenis from "lenis";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

type TransitionApi = { navigate: (href: string) => void };

const TransitionContext = createContext<TransitionApi | null>(null);

const ROUTE_LABELS: Record<string, string> = {
  "/": "HOME",
  "/surveys": "SURVEYS & CERTIFICATIONS",
  "/ndt": "ADVANCED NDT",
  "/survival": "SURVIVAL SYSTEMS",
  "/shipdesign": "SHIP & BOAT DESIGN",
  "/broking": "BROKING & TRADING",
  "/collaboration": "COLLABORATION",
  "/certificates": "CERTIFICATES",
  "/gallery": "GALLERY",
  "/careers": "CAREERS",
  "/privacy": "PRIVACY POLICY",
  "/terms": "TERMS & CONDITIONS",
};

/**
 * Route-change curtain ("sounding line"): an ink panel with depth ticks and a
 * decoding route label wipes up over the old page, the router commits beneath
 * it, and the curtain releases upward on the new route. Back/forward
 * navigations skip the exit (enter-only, handled by template.tsx). The curtain
 * never transforms the page tree itself, so ScrollTrigger pinning stays valid.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const curtainRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef<string | null>(null);
  const pendingHashRef = useRef<string | null>(null);
  const reduced = useReducedMotion();

  const scrollToHash = useCallback((hash: string, immediate = false) => {
    let target: Element | null = null;
    try {
      target = document.querySelector(hash);
    } catch {
      return; // invalid selector hash (e.g. "#1foo") must never throw
    }
    if (!target) return;
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    if (lenis) lenis.scrollTo(target as HTMLElement, { offset: -64, immediate });
    else target.scrollIntoView({ behavior: immediate ? "auto" : "smooth" });
  }, []);

  const navigate = useCallback(
    (href: string) => {
      const [rawPath, hashPart] = href.split("#");
      const hash = hashPart ? `#${hashPart}` : null;
      // pure-hash hrefs ("#contact") resolve against the current page
      const path = rawPath || pathname;
      if (path === pathname) {
        if (hash) {
          // same-page hash link: no curtain; immediate jump under reduced motion
          scrollToHash(hash, reduced);
          window.history.pushState(null, "", pathname + hash);
          return;
        }
        // same-route link with no hash (wordmark, active nav item): glide back
        // to the top instead of a dead click; no curtain, no router round-trip.
        // force: the mobile menu stops Lenis while open, and its restart is an
        // effect cleanup that runs AFTER this click handler, so an unforced
        // scrollTo would hit the isStopped guard and silently no-op.
        // Lenis is absent under reduced motion, where the fallback jumps.
        const lenis = (window as unknown as { lenis?: Lenis }).lenis;
        if (lenis) lenis.scrollTo(0, { immediate: reduced, force: true });
        else window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
        return;
      }
      if (reduced) {
        router.push(path + (hash ?? ""));
        return;
      }
      const curtain = curtainRef.current;
      if (!curtain) {
        router.push(path + (hash ?? ""));
        return;
      }
      registerGsap();
      pendingRef.current = path;
      pendingHashRef.current = hash;
      const label = curtain.querySelector<HTMLElement>("[data-route-label]");
      gsap
        .timeline()
        .set(curtain, { clipPath: "inset(100% 0% 0% 0%)", display: "flex" })
        .to(curtain, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.45,
          ease: EASE.io,
          onStart: () => {
            if (label) {
              gsap.to(label, {
                scrambleText: {
                  text: ROUTE_LABELS[path] ?? path.replace("/", "").toUpperCase(),
                  chars: "▪01·/-+",
                  speed: 0.4,
                },
                duration: 0.5,
              });
            }
          },
          // push the PATH ONLY: the release effect owns the hash scroll, so
          // Next's native hash jump must never fire beneath the curtain
          onComplete: () => router.push(path),
        });
    },
    [pathname, reduced, router, scrollToHash],
  );

  // release the curtain once the new route has committed beneath it
  useEffect(() => {
    if (!pendingRef.current || pathname !== pendingRef.current) return;
    pendingRef.current = null;
    const hash = pendingHashRef.current;
    pendingHashRef.current = null;
    const curtain = curtainRef.current;
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    if (!curtain) return;
    gsap.to(curtain, {
      clipPath: "inset(0% 0% 100% 0%)",
      duration: 0.6,
      ease: EASE.io,
      delay: 0.1,
      onComplete: () => {
        gsap.set(curtain, { display: "none" });
        // refresh BEFORE any hash scroll so trigger positions are measured
        // against the settled layout, then hand the scroll to Lenis
        ScrollTrigger.refresh();
        if (hash) {
          scrollToHash(hash);
          // the curtain push was path-only, so restore the anchor in the URL
          window.history.replaceState(null, "", pathname + hash);
        }
      },
    });
  }, [pathname, scrollToHash]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        ref={curtainRef}
        aria-hidden
        className="fixed inset-0 z-[70] hidden items-center justify-center bg-ink"
        style={{ clipPath: "inset(100% 0% 0% 0%)" }}
      >
        {/* depth ticks */}
        <div
          className="absolute inset-y-0 left-8 w-2 sm:left-12"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(120,176,240,0.28) 0 1px, transparent 1px 32px)",
          }}
        />
        <span
          data-route-label
          className="font-mono text-[0.6875rem] uppercase tracking-[0.3em] text-steel"
        >
          ···
        </span>
      </div>
    </TransitionContext.Provider>
  );
}

export function useTransition(): TransitionApi {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("useTransition must be used within TransitionProvider");
  return ctx;
}

interface TransitionLinkProps extends Omit<React.ComponentProps<typeof Link>, "href"> {
  href: string;
}

/** next/link wrapper that plays the curtain before same-origin navigations. */
export function TransitionLink({ href, onClick, children, ...rest }: TransitionLinkProps) {
  const { navigate } = useTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return;
    }
    e.preventDefault();
    navigate(href);
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
