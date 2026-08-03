"use client";

import { Fragment, useEffect, useRef, type ElementType, type FC, type ReactNode, type Ref } from "react";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { DUR, EASE, STAGGER } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  wordClassName?: string;
  /** Controlled trigger. If a boolean, animate when true; if undefined, use scroll. */
  play?: boolean;
  delay?: number;
  stagger?: number;
  start?: string;
};

/**
 * Word-level masked reveal (words rise into a clip mask). Robust, no line
 * measurement needed. Scroll-triggered by default, or controlled via `play`.
 */
export function TextReveal({
  text,
  as,
  className,
  wordClassName,
  play,
  delay = 0,
  stagger = STAGGER.words,
  start = "top 82%",
}: Props) {
  /**
   * R3F's global JSX augmentation breaks bare ElementType JSX (props collapse
   * to never), so typecheck against the exact props this component passes.
   * Runtime behavior is unchanged.
   */
  const Tag = ((as ?? "span") as ElementType) as FC<{
    ref: Ref<HTMLElement>;
    className?: string;
    children?: ReactNode;
  }>;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const words = text.split(" ");

  useEffect(() => {
    registerGsap();
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>("[data-word]");
    if (!targets.length) return;

    if (reduced) {
      gsap.set(targets, { yPercent: 0, opacity: 1 });
      return;
    }

    gsap.set(targets, { yPercent: 118 });
    const run = () =>
      gsap.to(targets, {
        yPercent: 0,
        duration: DUR.reveal,
        ease: EASE.expo,
        stagger,
        delay,
      });

    if (typeof play === "boolean") {
      if (play) run();
      return;
    }

    const st = ScrollTrigger.create({ trigger: el, start, once: true, onEnter: run });
    return () => st.kill();
  }, [reduced, play, delay, stagger, start]);

  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]">
              <span data-word className={cn("inline-block will-change-transform", wordClassName)}>
                {w}
              </span>
            </span>
            {i < words.length - 1 ? " " : ""}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
