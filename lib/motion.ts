/**
 * Shared motion tokens so every reveal reads as one system.
 * GSAP-string eases for GSAP; cubic arrays for framer-motion / CSS.
 */
export const EASE = {
  expo: "expo.out",
  io: "power4.inOut",
  soft: "power3.out",
  /** constant-velocity instrument moves: sweep rotation, marquee, crossfade */
  mech: "none",
} as const;

export const DUR = {
  fast: 0.4,
  base: 0.8,
  reveal: 1.0,
  slow: 1.25,
  /** hero loop crossfade */
  cross: 0.6,
  /** loader / route iris masks */
  iris: 0.9,
} as const;

export const STAGGER = {
  chars: 0.02,
  words: 0.055,
  lines: 0.09,
  cards: 0.12,
  ticks: 0.03,
} as const;

/** react-spring presets: springs own dragged/tilted elements only. */
export const SPRING = {
  drag: { tension: 300, friction: 30 },
  snap: { tension: 400, friction: 34 },
  tilt: { tension: 180, friction: 22 },
} as const;

/** Hero loop timing (seconds). Loop period = videoDur - cross = 14.44s. */
export const LOOP = {
  videoDur: 15.04,
  cross: 0.6,
  preroll: 2.0,
} as const;

/** cubic-bezier equivalents for framer-motion / inline CSS. */
export const CUBIC = {
  expo: [0.16, 1, 0.3, 1] as [number, number, number, number],
  io: [0.86, 0, 0.07, 1] as [number, number, number, number],
};
