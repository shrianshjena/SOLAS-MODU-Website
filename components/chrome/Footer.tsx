"use client";

import { TransitionLink } from "@/components/providers/TransitionProvider";
import { AISReadout } from "@/components/devices/AISReadout";
import { CompassRose } from "@/components/rive/CompassRose";
import { Icon, type IconName } from "@/components/ui/Icon";
import { site } from "@/content/site";

const serviceLinks = site.nav.filter((n) => "group" in n && n.group === "services");

/** tel: href with whitespace stripped from the display number. */
const telHref = (phone: string) => `tel:${phone.replace(/\s/g, "")}`;

const allEmails = [site.contact.emails.office, site.contact.emails.direct];

/** Labeled direct-line groups at footer scale, mirroring ContactSection. */
const LINE_GROUPS: { icon: IconName; label: string; lines: { href: string; text: string }[] }[] = [
  {
    icon: "mail",
    label: site.contact.labels.email,
    lines: allEmails.map((email) => ({ href: `mailto:${email}`, text: email })),
  },
  {
    icon: "mobile",
    label: site.contact.labels.mobile,
    lines: site.contact.phones.map((phone) => ({ href: telHref(phone), text: phone })),
  },
  {
    icon: "phone",
    label: site.contact.labels.phone,
    lines: [{ href: telHref(site.contact.landline), text: site.contact.landline }],
  },
];

/**
 * Footer "chart block": navy ground with the graticule ChartBorder on top,
 * four columns (identity / services / registry / contact), the AIS readout
 * line, and the mono baseline with the legal links alongside. The identity
 * column stacks the text wordmark lockup over the CompassRose Rive slot
 * (static SVG twin until /rive assets ship) and the LinkedIn icon link; the
 * contact column groups every email, mobile, and landline under labeled
 * icon headings.
 */
export function Footer() {
  return (
    <footer id="footer" className="u-chart-border bg-navy">
      <div className="u-shell grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* identity */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="font-sans text-[1.75rem] font-semibold leading-none tracking-tight text-white">
              {site.wordmark.primary}
            </p>
            <p className="mt-2 font-mono text-[0.5625rem] uppercase tracking-[0.35em] text-steel">
              {site.wordmark.secondary}
            </p>
          </div>
          <CompassRose size={96} />
          <p className="max-w-xs text-sm leading-relaxed text-white/70">{site.footer.mission}</p>
          <div className="flex gap-4 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-steel">
            <a
              href={site.social.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-white"
            >
              <Icon name="linkedin" className="h-4 w-4" />
              {site.social.linkedin.label}
            </a>
          </div>
        </div>

        {/* services */}
        <nav aria-label="Services" className="flex flex-col gap-3">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.25em] text-meta">
            Services
          </span>
          {serviceLinks.map((s) => (
            <TransitionLink
              key={s.href}
              href={s.href}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              {s.label}
            </TransitionLink>
          ))}
        </nav>

        {/* registry */}
        <nav aria-label="Company" className="flex flex-col gap-3">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.25em] text-meta">
            Registry
          </span>
          <TransitionLink href="/certificates" className="text-sm text-white/70 transition-colors hover:text-white">
            Certificates & Approvals
          </TransitionLink>
          <TransitionLink href="/gallery" className="text-sm text-white/70 transition-colors hover:text-white">
            Operations Gallery
          </TransitionLink>
          <TransitionLink href="/careers" className="text-sm text-white/70 transition-colors hover:text-white">
            Careers
          </TransitionLink>
          <div className="mt-2 flex gap-2">
            {(["9001", "14001", "45001"] as const).map((iso) => (
              <span
                key={iso}
                className="border border-steel/28 px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-steel"
              >
                ISO {iso}
              </span>
            ))}
          </div>
        </nav>

        {/* contact */}
        <div className="flex flex-col gap-4">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.25em] text-meta">
            Contact
          </span>
          {site.contact.offices.map((office) => (
            <address key={office.label} className="not-italic">
              <span className="block font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-steel">
                {office.label}
              </span>
              {office.lines.map((line) => (
                <span key={line} className="block text-sm leading-relaxed text-white/70">
                  {line}
                </span>
              ))}
            </address>
          ))}
          {LINE_GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-1">
              <span className="flex items-center gap-2 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-steel">
                <Icon name={group.icon} className="h-3.5 w-3.5 text-accent" />
                {group.label}
              </span>
              {group.lines.map((line) => (
                <a
                  key={line.href}
                  href={line.href}
                  className="w-fit text-sm leading-relaxed text-white/70 transition-colors hover:text-white"
                >
                  {line.text}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="u-shell flex flex-col gap-3 border-t border-steel/10 py-6">
        {/* "top bottom": the default 88% start line sits above this element's
            highest reachable position at max scroll, so it never fired and the
            line rendered as a blank space on every page */}
        <AISReadout text={site.ais} start="top bottom" className="block truncate" />
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <p className="font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-meta">
            {site.footer.baseline}
          </p>
          <nav
            aria-label="Legal"
            className="flex gap-5 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-meta"
          >
            {[site.legal.privacy, site.legal.terms].map((item) => (
              <TransitionLink
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-white"
              >
                {item.label}
              </TransitionLink>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
