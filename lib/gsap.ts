"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

let registered = false;

/** Register GSAP plugins once, client-side only. */
export function registerGsap(): void {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);
  registered = true;
}

export { gsap, ScrollTrigger };
