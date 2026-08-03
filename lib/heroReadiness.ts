"use client";

import { delay } from "./assetLoading";

/**
 * Bridge between HeroLoopVideo (producer) and the Preloader gate (consumer):
 * the preloader waits for the hero feed to be decodable before opening the
 * iris, but never longer than its timeout. Singleton per page load.
 */
let resolveReady: (() => void) | null = null;
let settled = false;

const readyPromise = new Promise<void>((resolve) => {
  resolveReady = resolve;
});

export function markHeroReady(): void {
  if (settled) return;
  settled = true;
  resolveReady?.();
}

/**
 * Buffering progress channel for the preloader's 0-100 counter (round 5).
 * Monotonic by construction: the fraction only ever rises, and once the feed
 * settles the getter reports 1 regardless of the last buffered read (which
 * covers cache hits that fire canplaythrough without any progress events).
 * Producer: HeroLoopVideo's progress/loadedmetadata listeners. Consumer: the
 * Preloader polls the getter inside its ticker; no subscribe API on purpose.
 */
let heroProgress = 0;

export function markHeroProgress(fraction: number): void {
  if (settled || !Number.isFinite(fraction)) return;
  const next = Math.min(1, Math.max(0, fraction));
  if (next > heroProgress) heroProgress = next;
}

export function getHeroProgress(): number {
  return settled ? 1 : heroProgress;
}

// default mirrors the Preloader's 28s cap (client decision 2026-07-25:
// quality over speed) so an argument-less future caller can never silently
// reintroduce a shorter race than the documented gate
export function heroReady(timeout = 28000): Promise<void> {
  return Promise.race([readyPromise, delay(timeout)]);
}
