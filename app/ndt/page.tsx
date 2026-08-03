import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import { NdtInstruments } from "@/components/services/NdtInstruments";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, pageMetadata, serviceLd } from "@/lib/seo";
import { ndt } from "@/content/pages/ndt";

export const metadata = pageMetadata(ndt.meta);

export default function NdtPage() {
  return (
    <>
      <JsonLd data={serviceLd(ndt.meta, "Advanced Non-Destructive Testing")} />
      <JsonLd data={breadcrumbLd(ndt.meta, "Advanced NDT")} />
      <ServicePageLayout content={ndt}>
        <NdtInstruments />
      </ServicePageLayout>
    </>
  );
}
