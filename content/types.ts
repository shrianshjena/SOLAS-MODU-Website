import type { ImageKey } from "./assets";

/** Per-page SEO metadata; `path` is the canonical route ("/ndt"). */
export interface PageMeta {
  title: string;
  description: string;
  path: string;
}

export interface Cta {
  label: string;
  href: string;
}

export interface Stat {
  /** Display value, e.g. "25+" or "2029". Digits animate; suffix stays static. */
  value: string;
  label: string;
  caption?: string;
}

/** A numbered capability / sub-service block on a service page. */
export interface Capability {
  no: string;
  title: string;
  body: string;
  /** Optional technique / scope chips, e.g. ["LRUT", "2\" TO 72\""] */
  chips?: string[];
  image?: ImageKey;
  imageAlt?: string;
}

/** Evidence row tying a claim to a client engagement or certificate. */
export interface ProofPoint {
  title: string;
  detail: string;
  /** Display period, hyphenated: "2022-2029" */
  period?: string;
  href?: string;
}

export interface ServicePageContent {
  meta: PageMeta;
  /** Station eyebrow, e.g. "SVC 02 / ADVANCED NDT" */
  eyebrow: string;
  heading: string;
  lede: string;
  heroImage: ImageKey;
  heroImageAlt: string;
  /**
   * Hero LOG ENTRY: one verified maritime fact in the instrument voice.
   * Mono sentence case, no em dashes, no trailing period; middot source tag
   * where attribution matters. Claims are verified before shipping.
   */
  fact?: string;
  intro: {
    heading: string;
    paragraphs: string[];
    image?: ImageKey;
    imageAlt?: string;
    chips?: string[];
  };
  capabilities: {
    eyebrow: string;
    heading: string;
    items: Capability[];
  };
  proof?: {
    eyebrow: string;
    heading: string;
    points: ProofPoint[];
  };
  why: {
    heading: string;
    body: string;
  };
  cta: {
    heading: string;
    body?: string;
    primary: Cta;
    secondary?: Cta;
  };
  /** Copy for the optional 3D showcase band; scene/poster asset wiring stays in the page. */
  showcase?: {
    eyebrow: string;
    heading: string;
    description: string;
    label: string;
  };
  /** Copy for the optional operating-footprint globe band; numeric coordinates stay in the component. */
  globe?: {
    eyebrow: string;
    heading: string;
    lede: string;
    stations: { name: string; coords: string; detail?: string }[];
  };
  /** Copy for the optional instrument-room band; figure labels stay component-local. */
  instruments?: {
    eyebrow: string;
    heading: string;
    lede: string;
  };
}

export interface Leader {
  name: string;
  role: string;
  credentials: string[];
  bio: string[];
  image?: ImageKey;
  imageAlt?: string;
}

export interface Project {
  /** Display period, hyphenated: "2013-2014" or "2016-ongoing" */
  period: string;
  title: string;
  body: string;
  href?: string;
}

export interface HomeContent {
  meta: PageMeta;
  hero: {
    /** Brand title stack; the three lines concatenate into the document H1. */
    title: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    /** Hero subheading. Wording fixed by client decision 2026-07-19; do not edit. */
    tagline: string;
    primary: Cta;
    secondary: Cta;
    ais: string;
    scrollCue: string;
  };
  intro: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    image: ImageKey;
    imageAlt: string;
    stats: Stat[];
  };
  services: {
    eyebrow: string;
    heading: string;
    lede: string;
    items: {
      no: string;
      title: string;
      summary: string;
      href: string;
      icon: string;
    }[];
  };
  operations: {
    eyebrow: string;
    heading: string;
    lede: string;
    stats: Stat[];
  };
  leadership: {
    eyebrow: string;
    heading: string;
    leaders: Leader[];
  };
  trustedBy: {
    eyebrow: string;
    heading: string;
    accreditations: string[];
  };
  galleryTeaser: {
    eyebrow: string;
    heading: string;
    images: { key: ImageKey; alt: string }[];
    cta: Cta;
  };
  contact: {
    eyebrow: string;
    heading: string;
    lede: string;
  };
}

export type CertificateCategory =
  | "iso"
  | "class-approvals"
  | "client-work"
  | "memberships"
  | "flag-state";

export interface Certificate {
  slug: string;
  title: string;
  issuer: string;
  /** Display year or period: "2022-2025" */
  period: string;
  category: CertificateCategory;
  /** Path under /certs (pdf) or an ImageKey for image renditions */
  file?: string;
  image?: ImageKey;
}

export interface GalleryItem {
  key: ImageKey;
  alt: string;
  caption: string;
  category: "offshore-operations" | "survival-systems" | "ndt-welding" | "spill-response" | "aviation";
}

export interface SimplePageHero {
  meta: PageMeta;
  eyebrow: string;
  heading: string;
  lede: string;
  heroImage?: ImageKey;
  heroImageAlt?: string;
  /**
   * Understated fine-print line under the lede (mono, low-alpha), e.g. the
   * gallery's AI/third-party imagery disclaimer. Rendered only when present.
   */
  note?: string;
}

export type LegalPageContent = SimplePageHero & {
  /** display string, e.g. "EFFECTIVE 2026-07-21 · REV 1.0" */
  effectiveDate: string;
  sections: { eyebrow: string; heading: string; paragraphs: string[] }[];
};
