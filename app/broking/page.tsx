import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, pageMetadata, serviceLd } from "@/lib/seo";
import { broking } from "@/content/pages/broking";

export const metadata = pageMetadata(broking.meta);

export default function BrokingPage() {
  return (
    <>
      <JsonLd data={serviceLd(broking.meta, "Marine Asset Broking and Trading")} />
      <JsonLd data={breadcrumbLd(broking.meta, "Broking & Trading")} />
      <ServicePageLayout content={broking} />
    </>
  );
}
