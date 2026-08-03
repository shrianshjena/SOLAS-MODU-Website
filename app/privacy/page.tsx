import { PageHero } from "@/components/hero/PageHero";
import { StationHeader } from "@/components/devices/StationHeader";
import { AISReadout } from "@/components/devices/AISReadout";
import { CompassRose } from "@/components/rive/CompassRose";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { EmergencyStrip } from "@/components/chrome/EmergencyStrip";
import { Footer } from "@/components/chrome/Footer";
import { pageMetadata } from "@/lib/seo";
import { privacyPage } from "@/content/pages/privacy";

export const metadata = pageMetadata(privacyPage.meta);

const bodySections = privacyPage.sections.slice(0, -1);
const closing = privacyPage.sections[privacyPage.sections.length - 1];

/**
 * /privacy: contour-field PageHero (no image), the policy sections on the
 * light surface under the effective-date readout, and the final contact
 * section as the dark closing band with the CompassRose. Linked only from
 * the footer legal nav.
 */
export default function PrivacyPage() {
  return (
    <>
      <main id="main">
        <PageHero
          eyebrow={privacyPage.eyebrow}
          heading={privacyPage.heading}
          lede={privacyPage.lede}
          breadcrumb="HOME / PRIVACY POLICY"
        />

        {/* policy sections */}
        <section data-nav-theme="light" className="u-chart-border bg-surface">
          <div className="u-shell py-[clamp(4.5rem,10vh,8rem)]">
            <AISReadout text={privacyPage.effectiveDate} tone="onLight" />
            <div className="mt-14 flex max-w-3xl flex-col gap-14">
              {bodySections.map((section) => (
                <div key={section.eyebrow}>
                  <StationHeader eyebrow={section.eyebrow} onLight />
                  <h2 className="mt-6 font-sans text-[clamp(1.375rem,2.4vw,1.875rem)] font-medium leading-tight tracking-[-0.01em] text-navy">
                    <TextReveal text={section.heading} />
                  </h2>
                  <Reveal className="mt-5 flex flex-col gap-4">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-[0.9375rem] leading-[1.75] text-slate">
                        {paragraph}
                      </p>
                    ))}
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* contact */}
        <section className="u-chart-border bg-ink">
          <div className="u-shell py-[clamp(4rem,9vh,7rem)]">
            <StationHeader eyebrow={closing.eyebrow} />
            <div className="mt-10 flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:gap-12">
              <CompassRose size={96} className="shrink-0" />
              <div className="flex flex-col gap-4">
                <h2 className="font-sans text-[clamp(1.375rem,2.6vw,2rem)] font-medium leading-tight text-white">
                  <TextReveal text={closing.heading} />
                </h2>
                <Reveal className="flex flex-col gap-3">
                  {closing.paragraphs.map((paragraph, i) => (
                    <p
                      key={paragraph}
                      className={
                        i === closing.paragraphs.length - 1
                          ? "font-mono text-[0.6875rem] tracking-[0.18em] text-steel"
                          : "max-w-xl text-[0.9375rem] leading-[1.7] text-white/70"
                      }
                    >
                      {paragraph}
                    </p>
                  ))}
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      </main>
      <EmergencyStrip />
      <Footer />
    </>
  );
}
