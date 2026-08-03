"use client";

import { useEffect, useState } from "react";

/**
 * Reactive `prefers-reduced-motion`. Returns false on the server and on the
 * first client render, then updates after mount (avoids hydration mismatch).
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}
