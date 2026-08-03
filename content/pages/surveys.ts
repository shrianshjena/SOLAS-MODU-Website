import type { ServicePageContent } from "../types";

export const surveys: ServicePageContent = {
  meta: {
    title: "Surveys & Certifications | SOLAS MODU Marine Services",
    description:
      "Class and Flag State approved surveys, statutory inspections, condition surveys, and certification support for vessels and offshore assets worldwide.",
    path: "/surveys",
  },
  eyebrow: "SVC 01 / SURVEYS & CERTIFICATIONS",
  heading: "Surveys & Certifications",
  lede:
    "Comprehensive surveys and certification services that keep vessels and offshore assets compliant with Class and Statutory requirements.",
  heroImage: "worker-offshore-oil-platform",
  heroImageAlt: "Marine surveyor walking the deck of an offshore oil platform",
  fact: "More than 80 percent of global trade in goods by volume is carried by sea · UNCTAD",
  intro: {
    heading: "Compliance that keeps you operational",
    paragraphs: [
      "Maintaining compliance with Class and Statutory requirements is crucial for both safety and operational efficiency. Our Surveys & Certifications division is built around that reality: experienced Marine Surveyors and Compliance Specialists delivering comprehensive surveys and certification services that ensure your vessels and offshore assets meet every industry standard.",
      "With more than a decade of experience navigating the complexities of maritime compliance, we work with you to tailor each engagement to your specific needs. The result is timely, accurate, and reliable surveys, and a seamless certification process that keeps your operations compliant and efficient.",
    ],
    image: "oil-rig",
    imageAlt: "Offshore drilling rig standing at sea",
    chips: ["CLASS & FLAG STATE", "SOLAS", "MODU CODES", "ISO & TYPE APPROVALS"],
  },
  capabilities: {
    eyebrow: "SCOPE / 01-05",
    heading: "What we survey and certify",
    items: [
      {
        no: "01",
        title: "Class & Flag State Approved Services",
        body: "Class and Flag State approved services, ISO, and Type Approvals that uphold safety and regulatory compliance. Aligned with international regulatory bodies, these approvals are essential for operational licensing and risk management.",
        chips: ["CLASS", "FLAG STATE", "ISO", "TYPE APPROVALS"],
        image: "flag-state-review",
        imageAlt:
          "Inspectors in hard hats and lifejackets observing a davit launched enclosed lifeboat during a shipboard drill",
      },
      {
        no: "02",
        title: "Statutory & Regulatory Inspections",
        body: "Inspections conducted meticulously against statutory requirements, supporting the seamless operation of your vessels and offshore assets in compliance with local and international law.",
        image: "offshore-jack-up-rig",
        imageAlt: "Offshore jack-up drilling rig at sea",
      },
      {
        no: "03",
        title: "Condition Surveys",
        body: "In-depth assessments of the physical state of your assets, giving you the evidence to make informed decisions on repair, maintenance, or upgrades. Condition surveys are fundamental to managing asset health and ensuring operational longevity.",
        image: "marine-engineer-confined-space",
        imageAlt: "Marine engineer carrying out a survey in a confined space",
      },
      {
        no: "04",
        title: "Consultation & Advisory Services",
        body: "Detailed risk assessments that identify potential hazards and translate them into actionable insights to mitigate risk, protect personnel, and safeguard the environment, in compliance with both international safety standards and client-specific safety requirements.",
        image: "maritime-inspection",
        imageAlt: "Cargo piping and hose handling cranes along the main deck of a tanker at sea",
      },
      {
        no: "05",
        title: "Certifications & Licenses",
        body: "Support for achieving ISO certifications and Type Approvals, crucial for quality management, environmental responsibility, and operational safety. These certifications demonstrate your commitment to global standards and enhance your credibility and compliance across the maritime industry.",
        image: "flag-state-surveys",
        imageAlt:
          "Deck locker stenciled life jackets for life raft holding orange lifejackets with reflective tape",
      },
    ],
  },
  proof: {
    eyebrow: "PROOF / FLAG STATE",
    heading: "Flag State authority, on record",
    points: [
      {
        title: "Zanzibar Maritime Authority",
        detail:
          "Authorized for Flag State surveys and inspections on behalf of the Zanzibar Maritime Authority (ZMA).",
        period: "2022",
        href: "/certificates",
      },
      {
        title: "St. Kitts & Nevis International Ship Registry",
        detail:
          "Appointed Flag State inspector under SKANReg, the international ship registry of St. Kitts & Nevis.",
        period: "2023",
        href: "/certificates",
      },
      {
        title: "Deepsea Treasure Flag State inspection",
        detail:
          "Flag State inspection of the Jagson rig Deepsea Treasure, carried out under Zanzibar Maritime Authority authorization.",
        period: "2022",
        href: "/certificates",
      },
      {
        title: "Jagson International annual servicing",
        detail:
          "Annual LSA, FFA, and crane servicing for Jagson International Ltd., performed per SOLAS and API RP 2D.",
        period: "2022",
        href: "/certificates",
      },
    ],
  },
  why: {
    heading: "Why SOLAS MODU",
    body: "Partnering with SOLAS MODU means engaging a team committed to excellence: seamless, results-driven surveys and certifications that keep your assets compliant with Class and Statutory requirements under SOLAS and the MODU Codes.",
  },
  cta: {
    heading: "Ready to meet the highest standards of compliance and safety?",
    body: "Talk to our Surveys & Certifications team about Class, Flag State, and statutory compliance for your vessels and offshore assets.",
    primary: { label: "Contact Us", href: "/#contact" },
    secondary: { label: "View Certificates", href: "/certificates" },
  },
};
