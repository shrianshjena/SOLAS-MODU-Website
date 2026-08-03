"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useLoaderGate } from "./LoaderGate";

/**
 * Lenis smooth-scroll wired into the GSAP ticker so ScrollTrigger stays in
 * sync. Scroll is locked until the preloader reveals the site, and disabled
 * entirely under prefers-reduced-motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reduced = useReducedMotion();
  const { revealed } = useLoaderGate();

  useEffect(() => {
    registerGsap();
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;
    (window as unknown as { lenis?: Lenis }).lenis = lenis;
    lenis.stop();

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, [reduced]);

  useEffect(() => {
    if (!revealed) return;
    lenisRef.current?.start();
    // recalculate ScrollTrigger start/end once the loader has lifted and
    // fonts/layout have settled, so below-the-fold reveals measure correctly
    ScrollTrigger.refresh();
    // late assets (lazy images, video metadata) can still shift layout after
    // reveal; re-measure once the full load event lands so deep-section
    // triggers never keep stale windows
    if (document.readyState === "complete") return;
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, [revealed]);

  return <>{children}</>;
}
