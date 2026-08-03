import type { Metadata } from "next";
import type { PageMeta } from "@/content/types";
import { site } from "@/content/site";
import { certificates } from "@/content/data/certificates";

/**
 * Per-page metadata from a content module's PageMeta: canonical path,
 * Open Graph, and Twitter card. metadataBase comes from the root layout.
 */
export function pageMetadata(meta: PageMeta): Metadata {
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: meta.path },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: meta.path,
      type: "website",
      siteName: "SOLAS MODU Marine Services",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

/** schema.org Organization for the root layout. */
export function organizationLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: "SOLAS MODU Marine Services",
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}/images/brand/logo-circle-512.png`,
    email: site.contact.emails.office,
    telephone: site.contact.phones[0],
    foundingDate: "2013",
    address: {
      "@type": "PostalAddress",
      streetAddress: "602, Satyam Tower, 90 Feet Road, Thakur Complex, Kandivali East",
      addressLocality: "Mumbai",
      postalCode: "400101",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    sameAs: [site.social.linkedin.url],
  };
}

/** schema.org Service for a service page. */
export function serviceLd(meta: PageMeta, serviceType: string): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceType,
    serviceType,
    description: meta.description,
    url: `${site.url}${meta.path}`,
    provider: { "@id": `${site.url}/#organization` },
    areaServed: "IN",
  };
}

/**
 * Organization credentials block for the certificates page (ISO systems).
 * Derived from the certificates content module: the current-window ISO
 * management system entries are the ones that carry certificate image keys,
 * so titles and validity periods stay maintained in one place.
 */
export function isoCredentialsLd(): Record<string, unknown> {
  const iso = certificates.filter((c) => c.category === "iso" && c.image);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    hasCredential: iso.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certification",
      name: c.title,
      description: `Certified ${c.period}`,
    })),
  };
}

/** schema.org BreadcrumbList for subpages. */
export function breadcrumbLd(meta: PageMeta, label: string): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: label, item: `${site.url}${meta.path}` },
    ],
  };
}
