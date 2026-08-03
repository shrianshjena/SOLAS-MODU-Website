/**
 * Sitewide globals: identity, navigation, contact, hero video paths.
 * Every string a chrome component renders lives here, never in components.
 */
export const site = {
  name: "SOLAS MODU",
  legalName: "SOLAS MODU Marine Services Pvt. Ltd.",
  domain: "solasmodu.net",
  url: "https://solasmodu.net",
  tagline:
    "Delivering Innovative Services across the Marine Industry, Turning Offshore Challenges into Smooth Sailing.",
  wordmark: {
    primary: "SOLAS MODU",
    secondary: "MARINE SERVICES",
  },
  meaning: {
    solas: "Safety of Life at Sea",
    modu: "Mobile Offshore Drilling Unit",
  },

  nav: [
    { label: "Home", href: "/" },
    { label: "Surveys & Certifications", href: "/surveys", group: "services" },
    { label: "Advanced NDT", href: "/ndt", group: "services" },
    { label: "Survival Systems", href: "/survival", group: "services" },
    { label: "Ship & Boat Design", href: "/shipdesign", group: "services" },
    { label: "Broking & Trading", href: "/broking", group: "services" },
    { label: "Collaboration", href: "/collaboration", group: "services" },
    { label: "Certificates", href: "/certificates" },
    { label: "Gallery", href: "/gallery" },
    { label: "Careers", href: "/careers" },
  ],
  headerCta: { label: "Request a Survey", href: "/#contact" },

  contact: {
    emails: {
      // gulf@solasmodu.net removed 2026-08-03: mailbox no longer in service
      office: "office@solasmodu.net",
      direct: "jena@solasmodu.net",
    },
    phones: ["+91 97024 73300", "+91 76668 46761", "+91 93238 01012"],
    landline: "+91 22 4968 5925",
    offices: [
      {
        label: "Registered Office",
        lines: [
          "602, Satyam Tower, 90 Feet Road",
          "Thakur Complex, Kandivali East",
          "Mumbai 400101, Maharashtra, India",
        ],
      },
      {
        label: "Corporate Office",
        lines: [
          "B-06, Satyam Apartment",
          "Thakur Complex, Kandivali East",
          "Mumbai 400101, Maharashtra, India",
        ],
      },
    ],
    coordinates: "LAT 19.20 N · LON 72.87 E",
    labels: {
      email: "Email",
      mobile: "Mobile",
      phone: "Phone",
    },
  },

  legal: {
    privacy: { label: "Privacy Policy", href: "/privacy" },
    terms: { label: "Terms & Conditions", href: "/terms" },
  },

  social: {
    linkedin: {
      label: "LinkedIn",
      url: "https://www.linkedin.com/company/solas-modu-marine-services/",
    },
  },

  ais: "SOLAS MODU · LAT 19.20 N · LON 72.87 E · STA MUMBAI, INDIA · STATUS OPERATIONAL",
  emergency: {
    label: "Urgent surveys, inspections, and marine support arranged on an emergency basis where applicable",
    cta: "Request assistance",
    href: "/#contact",
  },

  heroVideo: {
    /** 15.04s master; loop period is duration minus crossfade (14.44s) */
    duration: 15.04,
    crossfade: 0.6,
    /**
     * Single source for every device (client decision 2026-07-25): the
     * byte-identical stream-copy remux of the master. No mobile encode, no
     * conditional selection; quality is guaranteed by construction.
     */
    sources: {
      mp4: "/video/hero.mp4",
    },
    poster: "/video/hero-poster.jpg",
    posterWebp: "/video/hero-poster.webp",
  },

  footer: {
    mission:
      "Marine surveys, certifications, advanced NDT, and survival systems for ships, rigs, and offshore assets. Committed to safety, compliance, and dependable delivery.",
    baseline: "© 2026 SOLAS MODU MARINE SERVICES PVT. LTD. · MUMBAI · ALL RIGHTS RESERVED",
  },
} as const;

export type Site = typeof site;
