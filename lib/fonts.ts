import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";

/**
 * General Sans: display + body. Self-hosted variable font (Fontshare).
 * The deck's headline type is a bold neo-grotesque; General Sans is the
 * closest refined, non-AI-default match. Weight axis 200–700.
 */
export const generalSans = localFont({
  src: [
    {
      path: "../public/fonts/GeneralSans-Variable.woff2",
      weight: "200 700",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  preload: true,
});

/**
 * JetBrains Mono: all eyebrows, coordinates, drafting callouts, tag chips,
 * page counters. The "instrument" voice of the brand.
 */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});
