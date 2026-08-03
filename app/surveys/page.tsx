import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, pageMetadata, serviceLd } from "@/lib/seo";
import { surveys } from "@/content/pages/surveys";

export const metadata = pageMetadata(surveys.meta);

export default function SurveysPage() {
  return (
    <>
      <JsonLd data={serviceLd(surveys.meta, "Marine Surveys and Certifications")} />
      <JsonLd data={breadcrumbLd(surveys.meta, "Surveys & Certifications")} />
      <ServicePageLayout content={surveys} />
    </>
  );
}
