import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // Off-scale opacity steps used by the design system's hairline grammar
      // (bg-steel/16, border-steel/28, ...). Tailwind's slash modifier only
      // resolves values present in this scale; without these entries the
      // classes silently generate nothing (shipped invisible until 2026-07).
      opacity: {
        16: ".16",
        28: ".28",
      },
      colors: {
        // rgb(<triplet> / <alpha-value>) so opacity modifiers (bg-ink/85,
        // border-steel/10) generate; plain var(--x) colors silently drop them
        ink: "rgb(var(--ink-rgb) / <alpha-value>)",
        "ink-2": "rgb(var(--ink-2-rgb) / <alpha-value>)",
        navy: "rgb(var(--navy-rgb) / <alpha-value>)",
        slate: "rgb(var(--slate-rgb) / <alpha-value>)",
        surface: "rgb(var(--surface-rgb) / <alpha-value>)",
        accent: "rgb(var(--accent-rgb) / <alpha-value>)",
        steel: "rgb(var(--steel-rgb) / <alpha-value>)",
        flare: "rgb(var(--flare-rgb) / <alpha-value>)",
        meta: "rgb(var(--meta-rgb) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      maxWidth: {
        shell: "1440px",
      },
      letterSpacing: {
        widest2: "0.24em",
      },
      transitionTimingFunction: {
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
        io: "cubic-bezier(0.86, 0, 0.07, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
