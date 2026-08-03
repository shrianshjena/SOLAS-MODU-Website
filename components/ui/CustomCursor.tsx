"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useMotionHold } from "@/components/providers/MotionHold";

/** interactive elements that expand the reticle */
const HOVER_TARGETS = "a,button,[data-cursor],input,textarea,select,label";
/** core tick color at rest (matches bg-white/90) */
const CORE_TICK_COLOR = "rgba(255, 255, 255, 0.9)";
/** click ping diameter (px) and DOM lifetime (ms) */
const PING_SIZE = 24;
const PING_LIFE_MS = 650;
/** bearing-ring tick bearings, every 45 degrees */
const RING_TICK_ANGLES = Array.from({ length: 8 }, (_, i) => i * 45);

/**
 * Sonar bearing reticle cursor: a fast crosshair core (four hairline ticks
 * around an open center) chased by a lagging 30px bearing ring whose tick
 * dial slow-rotates on the sweep-rotate keyframe. GSAP quickTo owns both
 * followers' transforms (GSAP has exclusive cursor-transform ownership).
 * Interactive targets scale the ring and tint reticle strokes accent, and
 * pointerdown spawns a one-shot ping-ring echo. Activates only on fine
 * pointers (adding html.has-custom-cursor, which hides the native cursor
 * via globals.css) and renders nothing under reduced motion.
 */
export function CustomCursor() {
  const coreRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { held } = useMotionHold();

  useEffect(() => {
    // direct media check too: the hook reports false on its first render
    if (reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const core = coreRef.current;
    const ring = ringRef.current;
    if (!core || !ring) return;
    registerGsap();

    const rootStyle = getComputedStyle(document.documentElement);
    const accent = rootStyle.getPropertyValue("--accent").trim();
    const steel = rootStyle.getPropertyValue("--steel").trim();
    const ticks = Array.from(core.querySelectorAll<HTMLElement>("[data-core-tick]"));
    const strokes = Array.from(ring.querySelectorAll<SVGElement>("[data-ring-stroke]"));

    let shown = false;
    let hidden = false;
    let hovering = false;
    const pings = new Set<HTMLSpanElement>();
    const timers = new Set<number>();

    let coreX!: gsap.QuickToFunc;
    let coreY!: gsap.QuickToFunc;
    let ringX!: gsap.QuickToFunc;
    let ringY!: gsap.QuickToFunc;
    const ctx = gsap.context(() => {
      gsap.set([core, ring], { xPercent: -50, yPercent: -50 });
      coreX = gsap.quickTo(core, "x", { duration: 0.1, ease: "power3" });
      coreY = gsap.quickTo(core, "y", { duration: 0.1, ease: "power3" });
      ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3" });
      ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3" });
    });

    const fadeTo = (opacity: number) => {
      gsap.to([core, ring], { opacity, duration: 0.3, ease: "power3", overwrite: "auto" });
    };

    const onPointerMove = (e: PointerEvent) => {
      // touchscreen laptops pass the fine-pointer gate; never chase touch input
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      coreX(e.clientX);
      coreY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      if (!shown) {
        shown = true;
        document.documentElement.classList.add("has-custom-cursor");
        fadeTo(1);
      } else if (hidden) {
        hidden = false;
        fadeTo(1);
      }
      const interactive = e.target instanceof Element && e.target.closest(HOVER_TARGETS) !== null;
      if (interactive !== hovering) {
        hovering = interactive;
        gsap.to(ring, { scale: hovering ? 1.6 : 1, duration: 0.25, ease: "power3" });
        gsap.to(strokes, {
          stroke: hovering ? accent : steel,
          strokeOpacity: hovering ? 1 : 0.6,
          duration: 0.25,
          ease: "power3",
        });
        gsap.to(ticks, {
          backgroundColor: hovering ? accent : CORE_TICK_COLOR,
          duration: 0.25,
          ease: "power3",
        });
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      const ping = document.createElement("span");
      ping.className = "pointer-events-none fixed z-[100] rounded-full border border-accent";
      ping.style.width = `${PING_SIZE}px`;
      ping.style.height = `${PING_SIZE}px`;
      ping.style.left = `${e.clientX - PING_SIZE / 2}px`;
      ping.style.top = `${e.clientY - PING_SIZE / 2}px`;
      ping.style.animation = "ping-ring 0.6s ease-out forwards";
      document.body.appendChild(ping);
      pings.add(ping);
      const timer = window.setTimeout(() => {
        ping.remove();
        pings.delete(ping);
        timers.delete(timer);
      }, PING_LIFE_MS);
      timers.add(timer);
    };

    const onPointerLeave = () => {
      hidden = true;
      fadeTo(0);
    };
    const onPointerEnter = () => {
      if (shown && hidden) {
        hidden = false;
        fadeTo(1);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("pointerenter", onPointerEnter);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("pointerenter", onPointerEnter);
      document.documentElement.classList.remove("has-custom-cursor");
      timers.forEach((timer) => clearTimeout(timer));
      pings.forEach((ping) => ping.remove());
      gsap.killTweensOf([core, ring, ...ticks, ...strokes]);
      ctx.revert();
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <>
      {/* crosshair core: four hairline ticks around an open center; the faint
          ink halo keeps the white ticks readable over light surface sections */}
      <div
        ref={coreRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-[14px] w-[14px] opacity-0"
        style={{ filter: "drop-shadow(0 0 1px rgba(8, 16, 32, 0.7))" }}
      >
        <span data-core-tick="true" className="absolute left-1/2 top-0 h-1 w-px -translate-x-1/2 bg-white/90" />
        <span data-core-tick="true" className="absolute right-0 top-1/2 h-px w-1 -translate-y-1/2 bg-white/90" />
        <span data-core-tick="true" className="absolute bottom-0 left-1/2 h-1 w-px -translate-x-1/2 bg-white/90" />
        <span data-core-tick="true" className="absolute left-0 top-1/2 h-px w-1 -translate-y-1/2 bg-white/90" />
      </div>

      {/* bearing ring: slow-rotating tick dial with an accent 90deg arc;
          the dial honors the global HOLD FEED pause (WCAG 2.2.2) */}
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] opacity-0"
        style={{ filter: "drop-shadow(0 0 1px rgba(8, 16, 32, 0.7))" }}
      >
        <svg width={30} height={30} viewBox="0 0 30 30" fill="none" className="block">
          <g
            style={{
              animation: "sweep-rotate 14s linear infinite",
              animationPlayState: held ? "paused" : "running",
              transformOrigin: "center",
              transformBox: "fill-box",
            }}
          >
            <circle
              data-ring-stroke="true"
              cx="15"
              cy="15"
              r="12"
              stroke="var(--steel)"
              strokeOpacity="0.6"
              strokeWidth="1"
            />
            <g data-ring-stroke="true" stroke="var(--steel)" strokeOpacity="0.6" strokeWidth="1">
              {RING_TICK_ANGLES.map((angle) => (
                <line key={angle} x1="15" y1="0.5" x2="15" y2="2.5" transform={`rotate(${angle} 15 15)`} />
              ))}
            </g>
            <path d="M15 3A12 12 0 0 1 27 15" stroke="var(--accent)" strokeWidth="1" />
          </g>
        </svg>
      </div>
    </>
  );
}
