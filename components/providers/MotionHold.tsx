"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type MotionHold = {
  /** true while the visitor has paused ambient motion (WCAG 2.2.2) */
  held: boolean;
  toggle: () => void;
};

const MotionHoldContext = createContext<MotionHold | null>(null);

/**
 * Global pause switch for every autoplaying/ambient effect longer than 5s:
 * hero video loop, client marquee, sonar sweep, WebGL scenes. One control
 * (the hero's HOLD FEED button) pauses them all.
 */
export function MotionHoldProvider({ children }: { children: ReactNode }) {
  const [held, setHeld] = useState(false);
  const toggle = useCallback(() => setHeld((h) => !h), []);
  const value = useMemo(() => ({ held, toggle }), [held, toggle]);
  return <MotionHoldContext.Provider value={value}>{children}</MotionHoldContext.Provider>;
}

export function useMotionHold(): MotionHold {
  const ctx = useContext(MotionHoldContext);
  if (!ctx) throw new Error("useMotionHold must be used within MotionHoldProvider");
  return ctx;
}
