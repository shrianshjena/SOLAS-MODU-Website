import { PageHero } from "@/components/hero/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { CertificateExplorer } from "@/components/certificates/CertificateExplorer";
import { EmergencyStrip } from "@/components/chrome/EmergencyStrip";
import { Footer } from "@/components/chrome/Footer";
import { isoCredentialsLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { STAGGER } from "@/lib/motion";
import { certificatesPage } from "@/content/pages/certificates";
import { certificates } from "@/content/data/certificates";

export const metadata = pageMetadata(certificatesPage.meta);

/**
 * /certificates: drafting-plan PageHero, the compliance stat row on dark,
 * then the Motion-driven document registry on the light surface.
 * EmergencyStrip on every page (client decision 2026-07-30).
 */
export default function CertificatesPage() {
  return (
    <>
      <JsonLd data={isoCredentialsLd()} />
      <main id="main">
        <PageHero
          eyebrow={certificatesPage.eyebrow}
          heading={certificatesPage.heading}
          lede={certificatesPage.lede}
          breadcrumb="HOME / CERTIFICATES"
          device="plan"
        />

        {/* compliance stat row */}
        <section className="u-chart-border bg-ink">
          <div className="u-shell py-[clamp(4rem,9vh,7rem)]">
            <Reveal
              selector="[data-stat]"
              stagger={STAGGER.cards}
              className="grid gap-px border border-steel/16 bg-steel/16 sm:grid-cols-2 lg:grid-cols-4"
            >
              {certificatesPage.stats.map((stat) => (
                <div key={stat.label} data-stat className="flex flex-col gap-3 bg-ink-2 p-7 lg:p-8">
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-white">
                    {stat.label}
                  </span>
                  <span className="font-sans text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-none tracking-tight text-accent">
                    <Counter value={stat.value} />
                  </span>
                  <span aria-hidden className="h-px w-12 bg-steel/28" />
                  {stat.caption && (
                    <span className="font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-meta">
                      {stat.caption}
                    </span>
                  )}
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <CertificateExplorer filters={certificatesPage.filters} certificates={certificates} />
      </main>
      <EmergencyStrip />
      <Footer />
    </>
  );
}
