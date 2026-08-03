import type { ReactElement } from "react";
import { cn } from "@/lib/cn";

export type IconName =
  | "survey"
  | "waveform"
  | "lifebuoy"
  | "hull"
  | "scale"
  | "network"
  | "compass"
  | "anchor"
  | "phone"
  | "mail"
  | "mobile"
  | "linkedin";

/**
 * Brand icon set: 24px grid, 1.5px stroke, round caps/joins, outline only,
 * circular motifs (DESIGN_SYSTEM.md section 7). Rendered in currentColor.
 */
export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("h-6 w-6", className)}
    >
      {PATHS[name]}
    </svg>
  );
}

const PATHS: Record<IconName, ReactElement> = {
  survey: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </>
  ),
  waveform: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M5.5 12h2l1.5-4 2 8 2-8 1.5 4h2" />
    </>
  ),
  lifebuoy: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v5M12 16v5M3 12h5M16 12h5" />
    </>
  ),
  hull: (
    <>
      <path d="M3 13c0 4 4 7 9 7s9-3 9-7" />
      <path d="M3 13h18" />
      <path d="M12 13V5l5 4" />
    </>
  ),
  scale: (
    <>
      <path d="M12 4v16" />
      <path d="M5 8h14" />
      <path d="M7 8l-2.5 5a3 3 0 005 0L7 8zM17 8l-2.5 5a3 3 0 005 0L17 8z" />
    </>
  ),
  network: (
    <>
      <circle cx="12" cy="6" r="2.5" />
      <circle cx="6" cy="17" r="2.5" />
      <circle cx="18" cy="17" r="2.5" />
      <path d="M10.8 8.2L7.3 14.8M13.2 8.2l3.5 6.6M8.5 17h7" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" />
    </>
  ),
  anchor: (
    <>
      <circle cx="12" cy="6" r="2.5" />
      <path d="M12 8.5V20M12 20c-4 0-7-2.5-7.5-6M12 20c4 0 7-2.5 7.5-6" />
      <path d="M8.5 12h7" />
    </>
  ),
  phone: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l.5-2-2.5-1-1 1c-1-.5-2-1.5-2.5-2.5l1-1-1-2.5-1 .5z" />
    </>
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M5 8l7 5 7-5" />
    </>
  ),
  mobile: (
    <>
      <rect x="7.5" y="3.5" width="9" height="17" rx="2" />
      <path d="M11 17.5h2" />
    </>
  ),
  linkedin: (
    <>
      <circle cx="6.75" cy="6.5" r="1.25" />
      <path d="M6.75 10.5V18" />
      <path d="M11.5 18v-7.5" />
      <path d="M11.5 13.75a3.25 3.25 0 016.5 0V18" />
    </>
  ),
};
