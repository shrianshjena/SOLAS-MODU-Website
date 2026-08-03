"use client";

import { useEffect, useRef, useState } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { LOOP } from "@/lib/motion";
import { markHeroProgress, markHeroReady } from "@/lib/heroReadiness";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useMotionHold } from "@/components/providers/MotionHold";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

const LOOP_AT = LOOP.videoDur - LOOP.cross; // 14.44s
const PREROLL = LOOP.preroll;

/**
 * Seamless hero loop: two stacked videos of the same encode. The standby video
 * fades in OVER the still-playing active one for the final 0.6s of each pass
 * (loop period 14.44s), scheduled frame-accurately via requestVideoFrameCallback
 * with an `ended` hard-swap safety net. Poster-first: SSR and reduced-motion
 * render only the poster image. Decoders fully released on unmount.
 */
export function HeroLoopVideo({ className }: { className?: string }) {
  const aRef = useRef<HTMLVideoElement>(null);
  const bRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [posterVisible, setPosterVisible] = useState(true);
  const [needsGesture, setNeedsGesture] = useState(false);
  const reduced = useReducedMotion();
  const { held } = useMotionHold();
  const heldRef = useRef(held);
  const controlRef = useRef<{ pause: () => void; resume: () => void } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    registerGsap();
    if (mounted && reduced) {
      // poster-only mode: the feed is as ready as it will ever be. Without
      // this, a preloader that locked in its full branch (run-once guard racing
      // the reduced-motion hook's first flip) would wait out the entire
      // heroReady cap on a video that never mounts.
      markHeroReady();
      return;
    }
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b || !mounted) return;

    let disposed = false;
    let active = a;
    let standby = b;
    let rvfcId = 0;
    let pollTicker: (() => void) | null = null;
    let fadeTween: gsap.core.Tween | null = null;

    const cancelWatch = () => {
      if (rvfcId && "cancelVideoFrameCallback" in active) {
        (
          active as HTMLVideoElement & { cancelVideoFrameCallback(handle: number): void }
        ).cancelVideoFrameCallback(rvfcId);
        rvfcId = 0;
      }
      if (pollTicker) {
        gsap.ticker.remove(pollTicker);
        pollTicker = null;
      }
    };

    const swap = () => {
      fadeTween = null;
      const outgoing = active;
      outgoing.pause();
      outgoing.currentTime = 0;
      gsap.set(outgoing, { opacity: 0, zIndex: 2 });
      gsap.set(standby, { zIndex: 1 });
      active = standby;
      standby = outgoing;
      arm();
    };

    const startFade = () => {
      cancelWatch();
      if (disposed || heldRef.current) return;
      if (standby.currentTime !== 0) standby.currentTime = 0;
      standby.play().catch(() => {});
      fadeTween = gsap.to(standby, {
        opacity: 1,
        duration: LOOP.cross,
        ease: "none",
        onComplete: swap,
      });
    };

    const onFrame = () => {
      if (disposed) return;
      const t = active.currentTime;
      if (t >= LOOP_AT) {
        startFade();
        return;
      }
      if (t >= LOOP_AT - PREROLL && standby.currentTime !== 0 && standby.paused) {
        standby.currentTime = 0;
      }
      armFrame();
    };

    const armFrame = () => {
      if ("requestVideoFrameCallback" in active) {
        rvfcId = (
          active as HTMLVideoElement & {
            requestVideoFrameCallback(cb: VideoFrameRequestCallback): number;
          }
        ).requestVideoFrameCallback(() => onFrame());
      } else if (!pollTicker) {
        pollTicker = () => onFrame();
        gsap.ticker.add(pollTicker);
      }
    };

    const arm = () => {
      cancelWatch();
      armFrame();
    };

    // missed-fade safety net: worst case is one hard cut, never a freeze
    const onEnded = () => {
      fadeTween?.kill();
      if (!standby.src) {
        // standby not stood up yet (slow stream): hard-loop the active feed
        active.currentTime = 0;
        active.play().catch(() => {});
        return;
      }
      gsap.set(standby, { opacity: 1 });
      standby.play().catch(() => {});
      swap();
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (fadeTween) {
          fadeTween.kill();
          gsap.set(standby, { opacity: 1 });
          swap();
        }
        active.pause();
        standby.pause();
      } else if (!heldRef.current) {
        active.play().catch(() => {});
      }
    };

    controlRef.current = {
      pause: () => {
        active.pause();
        standby.pause();
        fadeTween?.pause();
      },
      resume: () => {
        active.play().catch(() => {});
        fadeTween?.resume();
      },
    };

    // buffering fraction for the preloader counter (round 5): duration is
    // NaN before loadedmetadata and buffered.end can throw mid-load, hence
    // the guards; monotonic clamping lives in the heroReadiness channel
    const onBufferProgress = () => {
      try {
        const duration = a.duration;
        const buffered = a.buffered;
        if (!Number.isFinite(duration) || duration <= 0 || buffered.length === 0) return;
        markHeroProgress(buffered.end(buffered.length - 1) / duration);
      } catch {
        // InvalidStateError from buffered.end mid-load: skip this sample
      }
    };

    const init = async () => {
      // one byte-identical source for every device (client decision
      // 2026-07-25): no mobile encode, no device- or network-conditional
      // selection. Quality can never degrade because there is nothing
      // lower-quality to select.
      const url = site.heroVideo.sources.mp4;
      // progressive-first: the +faststart remux streams, so the active video
      // gets its src immediately and starts on buffered data, never on the
      // full download; the loader gate below waits for the stronger
      // canplaythrough estimate, capped by heroReady's 28s race
      a.src = url;
      a.load();

      // canplaythrough: the loader gate waits for an uninterrupted-playback
      // estimate, not just first-frame readiness (heroReady's 28s race still
      // guarantees the preloader can never hang on it)
      const onReady = () => markHeroReady();
      a.addEventListener("canplaythrough", onReady, { once: true });
      a.addEventListener("progress", onBufferProgress);
      a.addEventListener("loadedmetadata", onBufferProgress);

      a.addEventListener("playing", () => setPosterVisible(false), { once: true });
      a.addEventListener("ended", onEnded);
      b.addEventListener("ended", onEnded);
      document.addEventListener("visibilitychange", onVisibility);

      // the standby stands up only once the active stream is comfortably
      // buffered: its request then rides the warm HTTP cache instead of racing
      // the live stream for bandwidth; onEnded hard-loops until it exists
      const standUpStandby = async () => {
        if (disposed || b.src) return;
        b.src = url;
        b.load();
        // warm the standby decoder (iOS defers decode until first play)
        await b.play().catch(() => {});
        if (disposed) return;
        b.pause();
        b.currentTime = 0;
        arm();
      };
      a.addEventListener("canplaythrough", () => void standUpStandby(), { once: true });

      try {
        await a.play();
      } catch {
        // autoplay refused (low power mode / data saver): poster + manual start
        markHeroReady();
        setNeedsGesture(true);
      }
    };

    void init();

    return () => {
      disposed = true;
      cancelWatch();
      fadeTween?.kill();
      document.removeEventListener("visibilitychange", onVisibility);
      a.removeEventListener("ended", onEnded);
      b.removeEventListener("ended", onEnded);
      a.removeEventListener("progress", onBufferProgress);
      a.removeEventListener("loadedmetadata", onBufferProgress);
      [a, b].forEach((v) => {
        v.pause();
        v.removeAttribute("src");
        v.load();
      });
      controlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, mounted]);

  useEffect(() => {
    heldRef.current = held;
    if (held) controlRef.current?.pause();
    else controlRef.current?.resume();
  }, [held]);

  const manualStart = () => {
    setNeedsGesture(false);
    aRef.current?.play().catch(() => setNeedsGesture(true));
  };

  const showVideos = mounted && !reduced;

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden>
      {/* poster under everything; LCP element; stays for reduced motion / SSR */}
      <picture
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          posterVisible || !showVideos ? "opacity-100" : "opacity-0",
        )}
      >
        <source type="image/webp" srcSet={site.heroVideo.posterWebp} />
        <img
          src={site.heroVideo.poster}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </picture>

      {showVideos && (
        <>
          <video
            ref={aRef}
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 z-[1] h-full w-full object-cover"
          />
          <video
            ref={bRef}
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 z-[2] h-full w-full object-cover opacity-0"
          />
        </>
      )}

      {needsGesture && (
        <button
          type="button"
          onClick={manualStart}
          className="pointer-events-auto absolute bottom-6 right-6 z-[3] border border-steel/28 bg-ink/70 px-4 py-2 font-mono text-[0.625rem] uppercase tracking-[0.25em] text-steel backdrop-blur transition-colors hover:border-accent hover:text-white"
        >
          Play Feed
        </button>
      )}
    </div>
  );
}
