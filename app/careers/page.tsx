import { PageHero } from "@/components/hero/PageHero";
import { StationHeader } from "@/components/devices/StationHeader";
import { TextReveal } from "@/components/ui/TextReveal";
import { Reveal } from "@/components/ui/Reveal";
import { TickFrame } from "@/components/ui/TickFrame";
import { CareersForm } from "@/components/forms/CareersForm";
import { FormBackdrop } from "@/components/careers/FormBackdrop";
import { EmergencyStrip } from "@/components/chrome/EmergencyStrip";
import { Footer } from "@/components/chrome/Footer";
import { pageMetadata } from "@/lib/seo";
import { STAGGER } from "@/lib/motion";
import { careersPage } from "@/content/pages/careers";

export const metadata = pageMetadata(careersPage.meta);

/**
 * /careers: crew-photo PageHero, the why-join reticle cards on the light
 * surface, then the application form on the dark panel. EmergencyStrip on
 * every page (client decision 2026-07-30).
 */
export default function CareersPage() {
  return (
    <>
      <main id="main">
        <PageHero
          eyebrow={careersPage.eyebrow}
          heading={careersPage.heading}
          lede={careersPage.lede}
          image={careersPage.heroImage}
          imageAlt={careersPage.heroImageAlt}
          breadcrumb="HOME / CAREERS"
        />

        {/* why join */}
        <section data-nav-theme="light" className="bg-surface">
          <div className="u-shell py-[clamp(4.5rem,10vh,8rem)]">
            <StationHeader eyebrow="CREW 02 / WHY SOLAS MODU" onLight />
            <Reveal
              selector="[data-card]"
              stagger={STAGGER.cards}
              className="mt-12 grid gap-6 md:grid-cols-3"
            >
              {careersPage.whyJoin.map((item, i) => (
                <div
                  key={item.title}
                  data-card
                  className="group relative border border-slate/15 bg-white/40 p-7"
                >
                  <TickFrame />
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.22em] text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-sans text-[clamp(1.125rem,1.8vw,1.375rem)] font-medium text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[0.9375rem] leading-[1.7] text-slate">{item.body}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* application: particle-ocean backdrop mirrors the home contact band */}
        <section id="apply" className="u-chart-border relative overflow-hidden bg-ink">
          <FormBackdrop />
          <div className="u-shell relative py-[clamp(4.5rem,10vh,8rem)]">
            <StationHeader eyebrow="CREW 03 / APPLICATION" />
            <h2 className="mt-10 max-w-2xl font-sans text-[clamp(1.625rem,3.2vw,2.625rem)] font-medium leading-tight tracking-[-0.01em] text-white">
              <TextReveal text={careersPage.form.heading} />
            </h2>
            <Reveal className="mt-12 max-w-3xl">
              <div className="group relative border border-steel/16 bg-ink-2/80 p-7 backdrop-blur-sm lg:p-10">
                <TickFrame size={14} />
                <CareersForm />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <EmergencyStrip />
      <Footer />
    </>
  );
}
