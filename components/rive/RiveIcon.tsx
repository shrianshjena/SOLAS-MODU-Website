"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { LazyMount } from "@/components/ui/LazyMount";
import { useMotionHold } from "@/components/providers/MotionHold";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { headProbe } from "@/lib/assetLoading";
import { cn } from "@/lib/cn";

/** Self-hosted Rive wasm; CSP connect-src forbids any CDN fetch. */
const RIVE_WASM_URL = "/rive/rive.wasm";

/**
 * Flip to true ONLY when public/rive actually ships the wasm + .riv assets.
 * While false, no probe fires at all: a HEAD request for a missing asset
 * resolves fine in JS but the browser still prints a 404 network error, and
 * with the CompassRose mounted in the footer that noise appeared in the
 * console on every production page (client screenshot triage 2026-07-30).
 */
const RIVE_ASSETS_SHIPPED = false;

type RiveModule = typeof import("@rive-app/react-canvas");

interface RuntimeProps {
  src: string;
  stateMachine?: string;
  held: boolean;
  onFail: () => void;
  onReady: () => void;
}

let wasmUrlConfigured = false;

/**
 * Factory so the heavy runtime is only referenced inside the dynamic chunk.
 * setWasmUrl points the runtime at the self-hosted wasm; it can only run after
 * the wasm HEAD probe passed, because the chunk loads in "live" phase only.
 */
function buildRuntime(mod: RiveModule) {
  if (!wasmUrlConfigured) {
    mod.RuntimeLoader.setWasmUrl(RIVE_WASM_URL);
    wasmUrlConfigured = true;
  }
  const { useRive } = mod;

  return function RiveRuntime({ src, stateMachine, held, onFail, onReady }: RuntimeProps) {
    const { rive, RiveComponent } = useRive({
      src,
      stateMachines: stateMachine,
      autoplay: true,
      onLoadError: () => onFail(),
    });

    /**
     * useRive disposes its Rive instance on unmount; this effect only mirrors
     * the global motion hold (WCAG 2.2.2) onto the running artboard.
     */
    useEffect(() => {
      if (!rive) return;
      onReady();
      if (held) rive.pause();
      else rive.play();
    }, [rive, held, onReady]);

    return <RiveComponent className="h-full w-full" />;
  };
}

const RiveRuntime = dynamic<RuntimeProps>(
  () => import("@rive-app/react-canvas").then(buildRuntime),
  { ssr: false },
);

type Phase = "probing" | "live" | "fallback";

export interface RiveIconProps {
  /** self-hosted .riv asset path, e.g. "/rive/compass.riv" */
  src: string;
  /** state machine to autoplay once the asset is live */
  stateMachine?: string;
  /** rendered during the probe and permanently on any failure path */
  fallback: ReactNode;
  /** square box edge in px */
  size?: number;
  className?: string;
  /** accessible name; omitted = decorative (aria-hidden) */
  label?: string;
}

/**
 * Fallback-first Rive slot. HEAD-checks the self-hosted wasm and the .riv
 * asset before mounting anything heavy; while assets are absent (the current
 * state of public/rive) the typed SVG fallback is the permanent render path.
 * Reduced motion never probes and never mounts the canvas.
 */
export function RiveIcon({
  src,
  stateMachine,
  fallback,
  size = 120,
  className,
  label,
}: RiveIconProps) {
  const [phase, setPhase] = useState<Phase>("probing");
  const [canvasReady, setCanvasReady] = useState(false);
  const reduced = useReducedMotion();
  const { held } = useMotionHold();

  useEffect(() => {
    // direct media-query check too: the hook reports false until after mount
    const prefersReduced =
      reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!RIVE_ASSETS_SHIPPED || prefersReduced) {
      setPhase("fallback");
      return;
    }
    let cancelled = false;
    Promise.all([headProbe(RIVE_WASM_URL), headProbe(src)]).then(([wasmOk, srcOk]) => {
      if (!cancelled) setPhase(wasmOk && srcOk ? "live" : "fallback");
    });
    return () => {
      cancelled = true;
    };
  }, [reduced, src]);

  const onFail = useCallback(() => setPhase("fallback"), []);
  const onReady = useCallback(() => setCanvasReady(true), []);

  return (
    <div
      style={{ width: size, height: size }}
      className={cn("relative", className)}
      {...(label ? { role: "img" as const, "aria-label": label } : { "aria-hidden": true })}
    >
      {/* fallback base layer: covers probe + chunk load, permanent on failure */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-[400ms] ease-expo",
          phase === "live" && canvasReady ? "opacity-0" : "opacity-100",
        )}
      >
        {fallback}
      </div>
      {phase === "live" && (
        <div className="absolute inset-0">
          <LazyMount className="h-full w-full">
            <RiveRuntime
              src={src}
              stateMachine={stateMachine}
              held={held}
              onFail={onFail}
              onReady={onReady}
            />
          </LazyMount>
        </div>
      )}
    </div>
  );
}
