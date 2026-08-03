"use client";

import { motion, useReducedMotion as useMotionReduced } from "motion/react";
import type { ReactNode } from "react";

/**
 * Remounts on every App Router navigation: fades the incoming route in while
 * the TransitionProvider curtain releases above it. Opacity only, never
 * transform, so ScrollTrigger pinning inside the page stays valid.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduced = useMotionReduced();
  return (
    <motion.div
      initial={{ opacity: reduced ? 1 : 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0 : 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
