import { PageHero } from "@/components/hero/PageHero";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { EmergencyStrip } from "@/components/chrome/EmergencyStrip";
import { Footer } from "@/components/chrome/Footer";
import { pageMetadata } from "@/lib/seo";
import { galleryPage } from "@/content/pages/gallery";
import { galleryItems } from "@/content/data/gallery";

export const metadata = pageMetadata(galleryPage.meta);

export default function GalleryPage() {
  return (
    <>
      <main id="main">
        <PageHero
          eyebrow={galleryPage.eyebrow}
          heading={galleryPage.heading}
          lede={galleryPage.lede}
          note={galleryPage.note}
          breadcrumb="HOME / GALLERY"
          device="plan"
        />
        <GalleryGrid items={galleryItems} />
      </main>
      <EmergencyStrip />
      <Footer />
    </>
  );
}
