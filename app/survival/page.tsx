import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import { SplineShowcase } from "@/components/spline/SplineShowcase";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, pageMetadata, serviceLd } from "@/lib/seo";
import { survival } from "@/content/pages/survival";

export const metadata = pageMetadata(survival.meta);

export default function SurvivalPage() {
  const showcase = survival.showcase!;

  return (
    <>
      <JsonLd data={serviceLd(survival.meta, "Survival Systems and LSA Servicing")} />
      <JsonLd data={breadcrumbLd(survival.meta, "Survival Systems")} />
      <ServicePageLayout content={survival}>
        <SplineShowcase
          eyebrow={showcase.eyebrow}
          heading={showcase.heading}
          description={showcase.description}
          sceneUrl="/spline/lifebuoy.splinecode"
          poster="lifebuoy"
          posterAlt="Lifebuoy and lifeboat survival equipment"
          label={showcase.label}
        />
      </ServicePageLayout>
    </>
  );
}
