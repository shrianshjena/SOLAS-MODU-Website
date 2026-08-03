import type { SimplePageHero, Stat } from "../types";

export const certificatesPage: SimplePageHero & {
  stats: Stat[];
  filters: { key: string; label: string }[];
} = {
  meta: {
    title: "Certificates & Approvals | SOLAS MODU Marine Services",
    description:
      "View the ISO management systems, Class and Flag State approvals, client contracts, and memberships that document SOLAS MODU’s marine compliance record.",
    path: "/certificates",
  },
  eyebrow: "REG 01 / CERTIFICATIONS",
  heading: "Certificates & Approvals",
  lede:
    "The approvals and records behind every engagement: current ABS and IRS service supplier approvals, legacy class recognitions, published client scopes of work, and the ISO management systems that keep our clients compliant under SOLAS and MODU Codes.",
  stats: [
    {
      value: "45+",
      label: "Documents on file",
      caption: "Certificates, licenses & approvals",
    },
    {
      value: "4",
      label: "Current class approvals",
      caption: "ABS & IRS service suppliers, to 2029",
    },
    {
      value: "3",
      label: "ISO management systems",
      caption: "ISO 9001, 14001 & 45001, certified to 2028",
    },
    {
      value: "2029",
      label: "Contract horizon",
      caption: "Longest active ONGC scope of work",
    },
  ],
  filters: [
    { key: "all", label: "All" },
    { key: "class-approvals", label: "Class Approvals" },
    { key: "client-work", label: "Client Work" },
    { key: "flag-state", label: "Flag State" },
    { key: "memberships", label: "Memberships" },
    { key: "iso", label: "ISO Systems" },
  ],
};
