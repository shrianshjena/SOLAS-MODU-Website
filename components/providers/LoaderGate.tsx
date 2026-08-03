"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type Gate = {
  /** true once the preloader has finished and the site is interactive */
  revealed: boolean;
  /** called by the preloader when its sequence completes */
  reveal: () => void;
};

const LoaderGateContext = createContext<Gate | null>(null);

export function LoaderGateProvider({ children }: { children: ReactNode }) {
  const [revealed, setRevealed] = useState(false);

  const reveal = useCallback(() => {
    setRevealed(true);
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("is-loading");
    }
  }, []);

  const value = useMemo(() => ({ revealed, reveal }), [revealed, reveal]);

  return <LoaderGateContext.Provider value={value}>{children}</LoaderGateContext.Provider>;
}

export function useLoaderGate(): Gate {
  const ctx = useContext(LoaderGateContext);
  if (!ctx) throw new Error("useLoaderGate must be used within LoaderGateProvider");
  return ctx;
}
