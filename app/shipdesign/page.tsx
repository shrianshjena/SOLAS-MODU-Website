import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import { SplineShowcase } from "@/components/spline/SplineShowcase";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, pageMetadata, serviceLd } from "@/lib/seo";
import { shipdesign } from "@/content/pages/shipdesign";

export const metadata = pageMetadata(shipdesign.meta);

export default function ShipDesignPage() {
  const showcase = shipdesign.showcase!;

  return (
    <>
      <JsonLd data={serviceLd(shipdesign.meta, "Ship and Boat Design")} />
      <JsonLd data={breadcrumbLd(shipdesign.meta, "Ship & Boat Design")} />
      <ServicePageLayout content={shipdesign}>
        <SplineShowcase
          eyebrow={showcase.eyebrow}
          heading={showcase.heading}
          description={showcase.description}
          sceneUrl="/spline/hull.splinecode"
          poster="worlds-largest-semi-submersible"
          posterAlt="Semi-submersible hull form at sea"
          label={showcase.label}
        />
      </ServicePageLayout>
    </>
  );
}
