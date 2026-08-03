"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";

/**
 * D3 signature device: bathymetric depth contours behind dark sections.
 * Nested irregular closed loops with two mono depth labels; the whole field
 * drifts slowly with scroll (parallax translateY only, GSAP-owned). Radially
 * masked by the parent via CSS mask. Decorative.
 */
export function ContourField({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: -4 },
        {
          yPercent: 4,
          ease: "none",
          scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: 0.6 },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  // hand-drawn irregular contours around a "seamount" center-right
  const contours = [
    "M 590 260 C 620 240 660 250 670 280 C 680 310 650 340 610 335 C 575 330 565 285 590 260 Z",
    "M 560 235 C 605 200 685 210 705 265 C 725 320 675 370 610 362 C 545 355 520 270 560 235 Z",
    "M 525 210 C 590 155 720 170 748 250 C 775 330 700 400 605 390 C 510 380 465 260 525 210 Z",
    "M 485 185 C 575 110 755 130 790 235 C 825 340 725 430 600 418 C 470 405 400 255 485 185 Z",
    "M 440 160 C 555 65 795 90 838 220 C 880 350 750 462 595 448 C 435 432 330 250 440 160 Z",
    "M 390 135 C 530 20 840 50 888 205 C 935 360 775 495 590 478 C 395 460 255 245 390 135 Z",
  ];

  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox="0 0 1000 560"
      preserveAspectRatio="xMidYMid slice"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full will-change-transform",
        "[mask-image:radial-gradient(75%_75%_at_60%_45%,black_35%,transparent_100%)]",
        className,
      )}
    >
      {contours.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={`rgba(120,176,240,${(0.1 - i * 0.013).toFixed(3)})`}
          strokeWidth="1"
        />
      ))}
      <text
        x="612"
        y="300"
        className="font-mono"
        fontSize="11"
        letterSpacing="2"
        fill="rgba(128,144,160,0.5)"
      >
        -120
      </text>
      <text
        x="470"
        y="430"
        className="font-mono"
        fontSize="11"
        letterSpacing="2"
        fill="rgba(128,144,160,0.35)"
      >
        -200
      </text>
    </svg>
  );
}
