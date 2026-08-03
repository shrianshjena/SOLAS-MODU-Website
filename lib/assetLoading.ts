"use client";

/** Resolve after `ms`. */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Resolve when web fonts are ready, or after a safety timeout. */
export function fontsReady(timeout = 4000): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) {
    return Promise.resolve();
  }
  return Promise.race([document.fonts.ready.then(() => undefined), delay(timeout)]);
}

/**
 * Fetch a media asset to a blob URL so two <video> elements can share one
 * network hit (hero crossfade loop). Resolves to null on timeout or failure;
 * callers fall back to the direct URL.
 */
export async function fetchToBlob(url: string, timeout = 6000): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Resolve when a <video> element can play through (or is realistically ready),
 * with a safety timeout so a slow network can never hold the preloader gate.
 */
export function videoReady(video: HTMLVideoElement, timeout = 6000): Promise<void> {
  if (video.readyState >= 3) return Promise.resolve();
  return Promise.race([
    new Promise<void>((resolve) => {
      const done = () => {
        video.removeEventListener("canplay", done);
        video.removeEventListener("canplaythrough", done);
        resolve();
      };
      video.addEventListener("canplay", done, { once: true });
      video.addEventListener("canplaythrough", done, { once: true });
    }),
    delay(timeout),
  ]);
}

/**
 * Module-level HEAD-probe cache: each asset URL is checked once per session.
 * Fallback-first contract for the Spline/Rive slots: heavy runtimes mount only
 * after the probed URL responds ok; failures leave the fallback permanent.
 */
const probeCache = new Map<string, Promise<boolean>>();

/** HEAD-check a same-origin asset URL, cached per session. */
export function headProbe(url: string): Promise<boolean> {
  const cached = probeCache.get(url);
  if (cached) return cached;
  const result = fetch(url, { method: "HEAD" })
    .then((res) => res.ok)
    .catch(() => false);
  probeCache.set(url, result);
  return result;
}

/** Preload a set of images; resolves when all settle or the timeout fires. */
export function imagesReady(srcs: string[], timeout = 5000): Promise<void> {
  if (typeof window === "undefined" || srcs.length === 0) return Promise.resolve();
  const loads = srcs.map(
    (src) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      }),
  );
  return Promise.race([Promise.all(loads).then(() => undefined), delay(timeout)]);
}
