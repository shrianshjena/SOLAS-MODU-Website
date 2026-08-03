"use client";

import type { ReactNode } from "react";
import { LoaderGateProvider } from "./LoaderGate";
import { MotionHoldProvider } from "./MotionHold";
import { TransitionProvider } from "./TransitionProvider";
import { SmoothScroll } from "./SmoothScroll";
import { Header } from "@/components/chrome/Header";
import { FathomRail } from "@/components/devices/FathomRail";
import { Preloader } from "@/components/loader/Preloader";
import { CustomCursor } from "@/components/ui/CustomCursor";

/**
 * Global provider spine. Order matters:
 * LoaderGate (reveal signal) > MotionHold (ambient pause) > Transition
 * (route curtain, needs router) > Header + SmoothScroll (Lenis waits on the
 * gate) > FathomRail (chrome) > Preloader (top layer, calls reveal()).
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <LoaderGateProvider>
      <MotionHoldProvider>
        <TransitionProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-white"
          >
            Skip to content
          </a>
          <Header />
          <SmoothScroll>{children}</SmoothScroll>
          <FathomRail />
          <Preloader />
          <CustomCursor />
        </TransitionProvider>
      </MotionHoldProvider>
    </LoaderGateProvider>
  );
}
