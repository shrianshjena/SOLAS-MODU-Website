import { TransitionLink } from "@/components/providers/TransitionProvider";
import { site } from "@/content/site";

/**
 * The sanctioned flare device: a slim emergency-assistance bar above the
 * footer on service pages. Ink text on burnt orange, mono voice; no phone
 * number and no availability promise, just a CTA routing to the contact
 * station.
 */
export function EmergencyStrip() {
  return (
    <aside
      aria-label="Emergency assistance"
      className="flex min-h-10 flex-wrap items-center justify-center gap-x-4 gap-y-1.5 bg-flare px-4 py-2.5 text-center"
    >
      <span className="font-mono text-[0.625rem] font-medium uppercase tracking-[0.2em] text-ink">
        {site.emergency.label}
      </span>
      <TransitionLink
        href={site.emergency.href}
        className="border border-ink px-3 py-1 font-mono text-[0.625rem] font-bold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-flare"
      >
        {site.emergency.cta}
      </TransitionLink>
    </aside>
  );
}
