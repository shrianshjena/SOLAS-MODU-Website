import type { Metadata } from "next";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { OperationsLog } from "@/components/sections/OperationsLog";
import { Leadership } from "@/components/sections/Leadership";
import { TrustedBy } from "@/components/sections/TrustedBy";
import { GalleryTeaser } from "@/components/sections/GalleryTeaser";
import { ContactSection } from "@/components/sections/ContactSection";
import { EmergencyStrip } from "@/components/chrome/EmergencyStrip";
import { Footer } from "@/components/chrome/Footer";
import { home } from "@/content/pages/home";

export const metadata: Metadata = {
  title: { absolute: home.meta.title },
  description: home.meta.description,
  alternates: { canonical: home.meta.path },
};

export default function HomePage() {
  return (
    <>
      <main id="main">
        <Hero />
        <About />
        <ServicesOverview />
        <OperationsLog />
        <Leadership />
        <TrustedBy />
        <GalleryTeaser />
        <ContactSection />
      </main>
      <EmergencyStrip />
      <Footer />
    </>
  );
}
