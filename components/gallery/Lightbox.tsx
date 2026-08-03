"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { animated, useSpring } from "@react-spring/web";
import { useGesture } from "@use-gesture/react";
import type Lenis from "lenis";
import { IMAGES } from "@/content/assets";
import type { GalleryItem } from "@/content/types";
import { CUBIC, DUR, SPRING } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

const ZOOM_SCALE = 2.2;
const ZOOM_MAX = 3;
/** px/ms release velocity beyond which a horizontal drag flings to the next photo */
const FLING_VELOCITY = 0.3;
/** px/ms downward release velocity that dismisses the viewer */
const DISMISS_VELOCITY = 0.35;
const DOUBLE_TAP_MS = 300;
/** resistance factor when dragging past the first/last slide or the pan bounds */
const RUBBER = 0.15;
/** fraction of the viewport height over which drag-down maps to full scale/fade */
const DISMISS_RANGE = 0.6;
const DISMISS_SCALE_DELTA = 0.15;
const DISMISS_FADE_DELTA = 0.7;
/** past this zoom factor a drag pans instead of sliding */
const ZOOMED_THRESHOLD = 1.05;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function rubberClamp(value: number, min: number, max: number): number {
  if (value < min) return min + (value - min) * RUBBER;
  if (value > max) return max + (value - max) * RUBBER;
  return value;
}

/** largest generated variant of a gallery photo (lightbox renders clean/ungraded) */
function fullSrc(item: GalleryItem, format: "webp" | "jpg"): string {
  const entry = IMAGES[item.key];
  const w = Math.max(...entry.widths);
  return `/images/${entry.category}/${item.key}-${w}.${format}`;
}

interface LightboxProps {
  items: GalleryItem[];
  /** index into items, or null while closed */
  openIndex: number | null;
  onClose: () => void;
}

/**
 * Full-screen photo viewer. Engine ownership: Motion fades the backdrop on
 * open/close only; React Spring + use-gesture own every dragged transform
 * (slide track, drag-down dismiss, double-tap zoom, pinch, pan). Focus-trapped
 * dialog with ESC, arrow keys, and focus return; Lenis stops while open.
 * Reduced motion: no gestures, instant transitions, click navigation only.
 */
export function Lightbox({ items, openIndex, onClose }: LightboxProps) {
  const reduced = useReducedMotion();
  const count = items.length;
  const open = openIndex !== null && count > 0;

  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const sizeRef = useRef({ w: 1, h: 1 });
  const [stageH, setStageH] = useState(1);
  const dragModeRef = useRef<"x" | "y" | null>(null);
  const lastTapRef = useRef(0);

  const [{ x }, xApi] = useSpring(() => ({ x: 0, config: SPRING.drag }));
  const [{ y }, yApi] = useSpring(() => ({ y: 0, config: SPRING.snap }));
  const [{ zs, zx, zy }, zApi] = useSpring(() => ({ zs: 1, zx: 0, zy: 0, config: SPRING.snap }));

  const resetZoom = useCallback(
    (immediate: boolean) => {
      zApi.start({ zs: 1, zx: 0, zy: 0, immediate, config: SPRING.snap });
    },
    [zApi],
  );

  const goTo = useCallback(
    (next: number, velocity = 0) => {
      const clamped = clamp(next, 0, count - 1);
      indexRef.current = clamped;
      setIndex(clamped);
      resetZoom(true);
      xApi.start({
        x: -clamped * sizeRef.current.w,
        immediate: reduced,
        config: { ...SPRING.drag, velocity },
      });
    },
    [count, reduced, resetZoom, xApi],
  );

  // jump to the requested slide when the dialog opens
  useEffect(() => {
    if (openIndex === null || count === 0) return;
    const clamped = clamp(openIndex, 0, count - 1);
    indexRef.current = clamped;
    setIndex(clamped);
    xApi.set({ x: -clamped * sizeRef.current.w });
    yApi.set({ y: 0 });
    zApi.set({ zs: 1, zx: 0, zy: 0 });
  }, [openIndex, count, xApi, yApi, zApi]);

  // stage measurement (slide offsets are in px of viewport width)
  useLayoutEffect(() => {
    if (!open) return;
    const measure = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      sizeRef.current = { w, h };
      setStageH(h);
      xApi.set({ x: -indexRef.current * w });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open, xApi]);

  // scroll lock, focus trap, ESC, arrows, focus return
  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(indexRef.current - 1);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(indexRef.current + 1);
        return;
      }
      if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled])",
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
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenis?.start();
      restoreFocusRef.current?.focus();
      restoreFocusRef.current = null;
    };
  }, [open, onClose, goTo]);

  // prefetch the +-1 neighbors at full resolution
  useEffect(() => {
    if (!open) return;
    [index - 1, index + 1]
      .filter((i) => i >= 0 && i < count)
      .forEach((i) => {
        const img = new Image();
        img.src = fullSrc(items[i], "webp");
      });
  }, [open, index, count, items]);

  const toggleZoom = useCallback(
    (pointX: number, pointY: number) => {
      const { w, h } = sizeRef.current;
      if (zs.get() > ZOOMED_THRESHOLD) {
        resetZoom(false);
        return;
      }
      const offsetX = pointX - w / 2;
      const offsetY = pointY - h / 2;
      const boundX = ((ZOOM_SCALE - 1) * w) / 2;
      const boundY = ((ZOOM_SCALE - 1) * h) / 2;
      zApi.start({
        zs: ZOOM_SCALE,
        zx: clamp(-offsetX * (ZOOM_SCALE - 1), -boundX, boundX),
        zy: clamp(-offsetY * (ZOOM_SCALE - 1), -boundY, boundY),
        config: SPRING.snap,
      });
    },
    [resetZoom, zApi, zs],
  );

  /** spring the pan back inside the zoomed bounds after a gesture ends */
  const settlePan = useCallback(() => {
    const { w, h } = sizeRef.current;
    const s = zs.get();
    if (s <= ZOOMED_THRESHOLD) {
      resetZoom(false);
      return;
    }
    const boundX = ((s - 1) * w) / 2;
    const boundY = ((s - 1) * h) / 2;
    zApi.start({
      zx: clamp(zx.get(), -boundX, boundX),
      zy: clamp(zy.get(), -boundY, boundY),
      config: SPRING.snap,
    });
  }, [resetZoom, zApi, zs, zx, zy]);

  const handleTap = useCallback(
    (pointX: number, pointY: number, event: Event | undefined) => {
      const target = event?.target as HTMLElement | null;
      if (target?.closest("button")) return;
      const now = performance.now();
      if (now - lastTapRef.current < DOUBLE_TAP_MS) {
        lastTapRef.current = 0;
        toggleZoom(pointX, pointY);
      } else {
        lastTapRef.current = now;
      }
    },
    [toggleZoom],
  );

  const bind = useGesture(
    {
      onDrag: (state) => {
        const {
          first,
          active,
          movement: [mx, my],
          velocity: [vx, vy],
          direction: [dx, dy],
          xy,
          tap,
          pinching,
          cancel,
          event,
          memo,
        } = state;
        if (pinching) {
          cancel();
          return memo;
        }
        if (tap) {
          handleTap(xy[0], xy[1], event);
          return memo;
        }

        const { w, h } = sizeRef.current;
        const s = zs.get();

        // zoomed: the drag pans within (rubber-banded) bounds
        if (s > ZOOMED_THRESHOLD) {
          const start = (memo as { px: number; py: number } | undefined) ?? {
            px: zx.get(),
            py: zy.get(),
          };
          const boundX = ((s - 1) * w) / 2;
          const boundY = ((s - 1) * h) / 2;
          if (active) {
            zApi.start({
              zx: rubberClamp(start.px + mx, -boundX, boundX),
              zy: rubberClamp(start.py + my, -boundY, boundY),
              immediate: true,
            });
          } else {
            settlePan();
          }
          return start;
        }

        // lock the gesture to one axis on first significant movement
        if (first) dragModeRef.current = null;
        if (!dragModeRef.current) {
          if (Math.abs(mx) < 6 && Math.abs(my) < 6) return memo;
          dragModeRef.current = Math.abs(my) > Math.abs(mx) && my > 0 ? "y" : "x";
        }

        if (dragModeRef.current === "x") {
          const base = -indexRef.current * w;
          const min = -(count - 1) * w;
          if (active) {
            xApi.start({ x: rubberClamp(base + mx, min, 0), immediate: true });
          } else {
            const fling = Math.abs(vx) > FLING_VELOCITY;
            const advance = fling || Math.abs(mx) > w / 3;
            // velocity fling: the release direction (dx) decides, mirroring the
            // y-dismiss pattern; distance-based advance falls back to displacement
            const sign = fling && dx !== 0 ? (dx < 0 ? -1 : 1) : mx < 0 ? -1 : 1;
            const target = indexRef.current + (sign < 0 ? 1 : -1);
            if (advance && target >= 0 && target <= count - 1) {
              goTo(target, vx * sign);
            } else {
              xApi.start({ x: base, config: SPRING.snap });
            }
          }
          return memo;
        }

        // drag-down dismiss: y maps to scale + backdrop fade; velocity closes
        const pull = Math.max(0, my);
        if (active) {
          yApi.start({ y: pull, immediate: true });
        } else {
          const shouldClose = (vy > DISMISS_VELOCITY && dy > 0) || pull > h / 3;
          if (shouldClose) onClose();
          else yApi.start({ y: 0, config: SPRING.snap });
        }
        return memo;
      },
      onPinch: ({ offset: [scale], last }) => {
        const next = clamp(scale, 1, ZOOM_MAX);
        if (!last) {
          zApi.start({ zs: next, immediate: true });
        } else if (next <= ZOOMED_THRESHOLD) {
          resetZoom(false);
        } else {
          settlePan();
        }
      },
    },
    {
      enabled: open && !reduced,
      drag: { filterTaps: true, pointer: { touch: true } },
      pinch: {
        scaleBounds: { min: 1, max: ZOOM_MAX },
        rubberband: true,
        from: () => [zs.get(), 0],
      },
    },
  );

  const dismissScale = y.to(
    (v) => 1 - clamp(v / (stageH * DISMISS_RANGE), 0, 1) * DISMISS_SCALE_DELTA,
  );
  const backdropDim = y.to(
    (v) => 1 - clamp(v / (stageH * DISMISS_RANGE), 0, 1) * DISMISS_FADE_DELTA,
  );

  const safeIndex = clamp(index, 0, Math.max(0, count - 1));
  const current = items[safeIndex];
  const neighborhood = [safeIndex - 1, safeIndex, safeIndex + 1].filter(
    (i) => i >= 0 && i < count,
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : DUR.fast, ease: CUBIC.expo }}
          className="fixed inset-0 z-[80]"
        >
          {/* spring-owned backdrop dim (follows drag-down); Motion only fades the wrapper */}
          <animated.div
            aria-hidden
            style={reduced ? undefined : { opacity: backdropDim }}
            className="absolute inset-0 bg-ink/95"
          />

          <div
            {...bind()}
            style={{ touchAction: "none" }}
            className="absolute inset-0 select-none overflow-hidden"
          >
            <animated.div
              style={reduced ? undefined : { y, scale: dismissScale }}
              className="absolute inset-0"
            >
              <animated.div style={{ x }} className="absolute inset-0 will-change-transform">
                {neighborhood.map((i) => {
                  const slide = items[i];
                  const entry = IMAGES[slide.key];
                  const picture = (
                    <picture className="flex h-full w-full items-center justify-center">
                      <source type="image/webp" srcSet={fullSrc(slide, "webp")} />
                      <img
                        src={fullSrc(slide, "jpg")}
                        alt={slide.alt}
                        width={entry.width}
                        height={entry.height}
                        draggable={false}
                        loading={i === safeIndex ? "eager" : "lazy"}
                        decoding="async"
                        className="max-h-full max-w-full object-contain"
                      />
                    </picture>
                  );
                  return (
                    <div
                      key={slide.key}
                      aria-hidden={i !== safeIndex || undefined}
                      className="absolute inset-0 flex items-center justify-center px-4 pb-24 pt-16 sm:px-20"
                      style={{ transform: `translateX(${i * 100}%)` }}
                    >
                      {i === safeIndex && !reduced ? (
                        <animated.div
                          style={{ x: zx, y: zy, scale: zs }}
                          className="flex h-full w-full items-center justify-center will-change-transform"
                        >
                          {picture}
                        </animated.div>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          {picture}
                        </div>
                      )}
                    </div>
                  );
                })}
              </animated.div>
            </animated.div>
          </div>

          {/* chrome sits outside the gesture surface */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close photo viewer"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center border border-steel/28 bg-ink/70 text-white transition-colors duration-300 hover:border-accent"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M7 7l10 10M17 7L7 17"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => goTo(safeIndex - 1)}
            disabled={safeIndex === 0}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-steel/28 bg-ink/70 text-white transition-colors duration-300 hover:border-accent disabled:pointer-events-none disabled:opacity-40 sm:left-6"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M14.5 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => goTo(safeIndex + 1)}
            disabled={safeIndex === count - 1}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-steel/28 bg-ink/70 text-white transition-colors duration-300 hover:border-accent disabled:pointer-events-none disabled:opacity-40 sm:right-6"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M9.5 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {current && (
            <div
              aria-live="polite"
              className="absolute inset-x-0 bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 px-4 pb-5 sm:px-8"
            >
              <p className="min-w-0 truncate font-mono text-[0.625rem] uppercase tracking-[0.22em] text-white/85">
                {current.caption}
                <span className="text-meta"> · {current.category.replace(/-/g, " ")}</span>
              </p>
              <p className="shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.25em] text-meta">
                FRAME {String(safeIndex + 1).padStart(2, "0")} /{" "}
                {String(count).padStart(2, "0")}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
