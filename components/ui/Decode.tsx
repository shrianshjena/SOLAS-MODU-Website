"use client";

import { useEffect, useRef, type ElementType, type FC, type ReactNode, type Ref } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { DUR, EASE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";

const GLYPHS = "▪01·/\\-+<>#ABCDEF";

interface DecodeProps {
  text: string;
  /** wait for this to become true (hero/loader handoff); default: scroll-triggered */
  play?: boolean;
  /** delay in seconds once triggered */
  delay?: number;
  /**
   * Reserve the final text's layout from first paint: an invisible sizer holds
   * the box while the scramble runs in an absolute overlay at constant string
   * length. Use for multi-line copy inside layout-sensitive containers (the
   * bottom-anchored hero rail); default single-line telegrams keep the classic
   * grow-in.
   */
  reserveLayout?: boolean;
  /**
   * ScrollTrigger start for the uncontrolled variant. The default fires at
   * "top 88%", which an element pinned to the very bottom of the page can
   * NEVER cross (the footer AIS line sat ~60px below its own start point at
   * max scroll and rendered as a blank space sitewide); bottom-of-page
   * consumers pass "top bottom" so entering the viewport at all triggers it.
   */
  start?: string;
  as?: ElementType;
  className?: string;
}

/**
 * Signature "instrument acquiring a reading" reveal: mono text resolves
 * left-to-right out of a scramble (GSAP ScrambleText). Real text stays in the
 * DOM for screen readers; the animated copy is aria-hidden.
 */
export function Decode({
  text,
  play,
  delay = 0,
  reserveLayout = false,
  start = "top 88%",
  as: Tag = "span",
  className,
}: DecodeProps) {
  /**
   * R3F's global JSX augmentation breaks bare ElementType JSX (props collapse
   * to never), so typecheck against the exact props this component passes.
   * Runtime behavior is unchanged.
   */
  const Comp = Tag as FC<{ ref: Ref<HTMLElement>; className?: string; children?: ReactNode }>;
  const ref = useRef<HTMLElement>(null);
  const doneRef = useRef(false);
  const reduced = useReducedMotion();
  const controlled = play !== undefined;

  useEffect(() => {
    registerGsap();
    const el = ref.current?.querySelector<HTMLElement>("[data-decode-target]");
    if (!el || doneRef.current) return;
    if (reduced) {
      el.textContent = text;
      return;
    }
    if (controlled && !play) return;

    const ctx = gsap.context(() => {
      const tween = () => {
        doneRef.current = true;
        gsap.to(el, {
          duration: Math.max(DUR.cross, text.length * 0.02),
          delay,
          ease: EASE.soft,
          scrambleText: {
            text,
            chars: GLYPHS,
            speed: 0.4,
            revealDelay: 0.05,
            // constant string length keeps the overlay's wrap points stable
            // (mono advance width) so the reserved box never shifts
            ...(reserveLayout ? { tweenLength: false } : {}),
          },
        });
      };
      if (controlled) {
        tween();
      } else {
        ScrollTrigger.create({ trigger: el, start, once: true, onEnter: tween });
      }
    }, ref);
    return () => ctx.revert();
  }, [text, play, controlled, delay, reduced, reserveLayout, start]);

  return (
    <Comp ref={ref} className={cn("inline-block", reserveLayout && "relative", className)}>
      <span className="sr-only">{text}</span>
      {reserveLayout ? (
        <>
          {/* invisible sizer: the final text owns the box from first paint */}
          <span aria-hidden className="invisible">
            {text}
          </span>
          <span aria-hidden data-decode-target className="absolute inset-0">
            {reduced ? text : " "}
          </span>
        </>
      ) : (
        <span aria-hidden data-decode-target>
          {reduced ? text : " "}
        </span>
      )}
    </Comp>
  );
}
