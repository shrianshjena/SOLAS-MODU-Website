"use client";

import dynamic from "next/dynamic";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Application } from "@splinetool/runtime";
import { LazyMount } from "@/components/ui/LazyMount";
import { Pic } from "@/components/ui/Pic";
import { useMotionHold } from "@/components/providers/MotionHold";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { headProbe } from "@/lib/assetLoading";
import { cn } from "@/lib/cn";
import type { ImageKey } from "@/content/assets";

type RuntimeModule = typeof import("@splinetool/runtime");

interface CanvasProps {
  sceneUrl: string;
  onLoad: (app: Application) => void;
  onError: () => void;
}

/**
 * Factory so the heavy Spline runtime is only referenced inside the dynamic
 * chunk. The @splinetool/react-spline wrapper is skipped deliberately: its
 * exports map carries no require/default condition, which breaks resolution
 * in Next's server compile layers; the runtime package resolves everywhere.
 * The canvas component owns the Application lifecycle: created on mount,
 * disposed on unmount (StrictMode-safe: each effect run cleans itself up).
 */
function buildCanvas(mod: RuntimeModule) {
  return function SplineCanvas({ sceneUrl, onLoad, onError }: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const app = new mod.Application(canvas);
      let cancelled = false;
      app.load(sceneUrl).then(
        () => {
          if (!cancelled) onLoad(app);
        },
        () => {
          if (!cancelled) onError();
        },
      );
      return () => {
        cancelled = true;
        app.dispose();
      };
    }, [sceneUrl, onLoad, onError]);

    return <canvas ref={canvasRef} className="h-full w-full" />;
  };
}

const SplineCanvas = dynamic<CanvasProps>(
  () => import("@splinetool/runtime").then(buildCanvas),
  { ssr: false },
);

interface BoundaryProps {
  onError: () => void;
  children: ReactNode;
}

/**
 * Runtime parse/render throws inside the canvas subtree are caught here and
 * reported up; the parent then falls back to the poster permanently.
 */
class SplineErrorBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

type Phase = "probing" | "loading" | "live" | "fallback";

export interface SplineSceneProps {
  /** self-hosted scene, e.g. "/spline/lifebuoy.splinecode" */
  sceneUrl: string;
  /** poster from the asset pipeline; always rendered as the base layer */
  poster: ImageKey;
  posterAlt: string;
  /** mono corner caption, e.g. "MDL 01 / LIFEBOAT + LSA" */
  label?: string;
  className?: string;
}

/**
 * Fallback-first Spline slot. The survey-graded poster is the permanent base
 * layer; the canvas HEAD-probes the scene URL, lazy-mounts near the viewport,
 * fades in over the poster on load, stops offscreen and under the global
 * motion hold, and disposes on unmount. While public/spline is empty (its
 * current state) the poster is the permanent render path. Reduced motion
 * never probes and never mounts the canvas.
 */
export function SplineScene({ sceneUrl, poster, posterAlt, label, className }: SplineSceneProps) {
  const [phase, setPhase] = useState<Phase>("probing");
  const [inView, setInView] = useState(false);
  const appRef = useRef<Application | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { held } = useMotionHold();

  useEffect(() => {
    // direct media-query check too: the hook reports false until after mount
    const prefersReduced =
      reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setPhase("fallback");
      return;
    }
    let cancelled = false;
    headProbe(sceneUrl).then((ok) => {
      if (!cancelled) setPhase(ok ? "loading" : "fallback");
    });
    return () => {
      cancelled = true;
    };
  }, [reduced, sceneUrl]);

  // visibility drives play/stop (ambient WebGL never runs offscreen)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "80px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // SplineCanvas owns creation/disposal; this only mirrors hold + visibility
  useEffect(() => {
    const app = appRef.current;
    if (phase !== "live" || !app) return;
    if (held || !inView) app.stop();
    else app.play();
  }, [phase, held, inView]);

  const onLoad = useCallback((app: Application) => {
    appRef.current = app;
    setPhase("live");
  }, []);

  const onError = useCallback(() => {
    appRef.current = null;
    setPhase("fallback");
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-video overflow-hidden border border-steel/16 bg-ink-2",
        className,
      )}
    >
      {/* poster base layer: every failure path is layout-identical */}
      <div className="absolute inset-0">
        <Pic
          imageKey={poster}
          alt={posterAlt}
          sizes="(min-width: 1024px) 58vw, 100vw"
          grade="survey"
          className="h-full w-full"
        />
      </div>

      {(phase === "loading" || phase === "live") && (
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 transition-opacity duration-[400ms] ease-expo",
            phase === "live" ? "opacity-100" : "opacity-0",
          )}
        >
          <SplineErrorBoundary onError={onError}>
            <LazyMount className="h-full w-full" rootMargin="200px">
              <SplineCanvas sceneUrl={sceneUrl} onLoad={onLoad} onError={onError} />
            </LazyMount>
          </SplineErrorBoundary>
        </div>
      )}

      {label && (
        <span
          aria-hidden
          className="absolute left-4 top-4 font-mono text-[0.5625rem] uppercase tracking-[0.25em] text-steel"
        >
          {label}
        </span>
      )}

      {phase === "loading" && (
        <span
          aria-hidden
          className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-steel/28 bg-ink/60 px-3 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-steel"
        >
          <span className="h-[5px] w-[5px] rounded-full border border-accent" />
          Render standby
        </span>
      )}
    </div>
  );
}
