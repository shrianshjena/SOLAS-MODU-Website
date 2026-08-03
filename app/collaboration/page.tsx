import { ServicePageLayout } from "@/components/services/ServicePageLayout";
import { CollaborationGlobe } from "@/components/three/CollaborationGlobe";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, pageMetadata, serviceLd } from "@/lib/seo";
import { collaboration } from "@/content/pages/collaboration";

export const metadata = pageMetadata(collaboration.meta);

export default function CollaborationPage() {
  return (
    <>
      <JsonLd data={serviceLd(collaboration.meta, "Maritime Collaboration and Partnerships")} />
      <JsonLd data={breadcrumbLd(collaboration.meta, "Collaboration")} />
      <ServicePageLayout content={collaboration}>
        <CollaborationGlobe />
      </ServicePageLayout>
    </>
  );
}
