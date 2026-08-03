"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { StationHeader } from "@/components/devices/StationHeader";
import { ContourField } from "@/components/devices/ContourField";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { TickFrame } from "@/components/ui/TickFrame";
import { LazyMount } from "@/components/ui/LazyMount";
import { ContactForm } from "@/components/forms/ContactForm";
import { Icon, type IconName } from "@/components/ui/Icon";
import { home } from "@/content/pages/home";
import { site } from "@/content/site";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";

/** tel: href with whitespace stripped from the display number. */
const telHref = (phone: string) => `tel:${phone.replace(/\s/g, "")}`;

const allEmails = [site.contact.emails.office, site.contact.emails.direct];

/** Labeled direct-line groups: icon + heading from content, tappable lines. */
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

/** three/R3F stay out of the shared bundle: loaded on demand, client only. */
const OceanParticles = dynamic(
  () => import("@/components/three/OceanParticles").then((m) => m.OceanParticles),
  { ssr: false },
);

/**
 * STN 06: contact on dark ground over the contour field. Office AIS-style
 * cards on the left above three labeled direct-line groups (Email, Mobile,
 * Phone: icon + mono heading + tappable lines), the inquiry form on the
 * right panel.
 * The R3F particle ocean renders behind the content; ContourField stays as
 * the reduced-motion / no-WebGL / pre-mount fallback and fades out via CSS
 * opacity once the canvas context is live and fades back in if the WebGL
 * context is lost (GSAP still owns its transform).
 */
export function ContactSection() {
  const { contact } = home;
  const reduced = useReducedMotion();
  const [oceanLive, setOceanLive] = useState(false);

  return (
    <section id="contact" className="u-chart-border relative overflow-hidden bg-ink">
      <ContourField
        className={cn("transition-opacity duration-700", oceanLive && !reduced && "opacity-0")}
      />
      {!reduced && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-35 [mask-image:radial-gradient(80%_80%_at_50%_45%,black_30%,transparent_95%)]"
        >
          <LazyMount rootMargin="200px" className="h-full w-full">
            <OceanParticles
              onLive={() => setOceanLive(true)}
              onContextLost={() => setOceanLive(false)}
            />
          </LazyMount>
        </div>
      )}
      <div className="u-shell relative py-[clamp(4.5rem,10vh,8rem)]">
        <StationHeader eyebrow={contact.eyebrow} meta={site.contact.coordinates} />

        <div className="mt-12 grid gap-14 lg:grid-cols-12 lg:gap-20">
          {/* addresses + lines */}
          <div className="flex flex-col gap-8 lg:col-span-5">
            <h2 className="font-sans text-[clamp(1.625rem,3.2vw,2.625rem)] font-medium leading-tight tracking-[-0.01em] text-white">
              <TextReveal text={contact.heading} />
            </h2>
            <Reveal>
              <p className="text-[0.9375rem] leading-[1.7] text-white/70">{contact.lede}</p>
            </Reveal>

            <Reveal selector="[data-office]" className="flex flex-col gap-4">
              {site.contact.offices.map((office) => (
                <div key={office.label} data-office className="group relative border border-steel/16 bg-ink-2/60 p-5">
                  <TickFrame size={10} />
                  <span className="font-mono text-[0.5625rem] uppercase tracking-[0.22em] text-steel">
                    {office.label}
                  </span>
                  <address className="mt-2 not-italic">
                    {office.lines.map((line) => (
                      <span key={line} className="block text-sm leading-relaxed text-white/70">
                        {line}
                      </span>
                    ))}
                  </address>
                </div>
              ))}
            </Reveal>

            <Reveal selector="[data-line-group]" className="flex flex-col gap-7">
              {LINE_GROUPS.map((group) => (
                <div key={group.label} data-line-group className="flex flex-col gap-2">
                  <span className="flex items-center gap-2.5 font-mono text-[0.625rem] uppercase tracking-[0.22em] text-steel">
                    <Icon name={group.icon} className="h-4 w-4 text-accent" />
                    {group.label}
                  </span>
                  {group.lines.map((line) => (
                    <a
                      key={line.href}
                      href={line.href}
                      className="w-fit text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {line.text}
                    </a>
                  ))}
                </div>
              ))}
            </Reveal>
          </div>

          {/* form panel */}
          <Reveal className="lg:col-span-7">
            <div className="group relative border border-steel/16 bg-ink-2/80 p-7 backdrop-blur-sm lg:p-10">
              <TickFrame size={14} />
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
