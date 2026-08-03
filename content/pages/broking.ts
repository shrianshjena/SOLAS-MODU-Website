import type { ServicePageContent } from "../types";

export const broking: ServicePageContent = {
  meta: {
    title: "Broking & Trading | SOLAS MODU Marine Services",
    description:
      "Broking and trading services for marine assets, from brokerage and valuation to equipment trading and advisory, ensuring smooth, transparent transactions.",
    path: "/broking",
  },
  eyebrow: "SVC 05 / BROKING & TRADING",
  heading: "Broking & Trading",
  lede:
    "Specialized broking and trading services for the sale, purchase, and valuation of marine assets, with smooth transactions and transparent dealings at every stage.",
  heroImage: "oil-rig-sunset",
  heroImageAlt: "Offshore oil rig silhouetted against the sunset",
  fact: "Global ship chartering traces back to the Baltic Exchange, founded as a London coffee house in 1744",
  intro: {
    heading: "Transactions handled with expertise",
    paragraphs: [
      "In the dynamic maritime and offshore industries, access to reliable, high-quality marine assets is essential. Our Broking & Trading division facilitates the sale, purchase, and valuation of marine assets, ensuring smooth transactions and transparent dealings backed by comprehensive, industry-leading services.",
      "Every engagement is supported by a team of maritime experts, surveyors, valuers, and loss assessors. We understand the financial and operational commitments involved in marine asset transactions, so we work to maximize value and minimize risk through efficient processes tailored to each client’s needs.",
    ],
    image: "oil-rig-tanker-ship",
    imageAlt: "Tanker ship alongside an offshore oil rig at sea",
    chips: ["SALE & PURCHASE", "VALUATION", "EQUIPMENT TRADING", "ADVISORY"],
  },
  capabilities: {
    eyebrow: "SERVICES / 01-04",
    heading: "What we broker, value, and trade",
    items: [
      {
        no: "01",
        title: "Marine Asset Brokerage",
        body: "Brokerage and trading of marine assets, supported by maritime experts, surveyors, valuers, and loss assessors. We connect buyers and sellers across global maritime markets, facilitating transactions for vessels, rigs, and a wide range of marine assets with options tailored to each client’s needs.",
        chips: ["VESSELS", "RIGS", "SALE & PURCHASE"],
        image: "worlds-largest-semi-submersible",
        imageAlt: "Semi-submersible drilling rig under way at sea",
      },
      {
        no: "02",
        title: "Valuation & Appraisal",
        body: "Expert valuation services that assess asset condition, trends, and compliance, delivering comprehensive, accurate appraisals that support sound financial decisions.",
        chips: ["CONDITION", "COMPLIANCE", "APPRAISAL"],
        image: "rigs-cluster",
        imageAlt: "Semi submersible drilling rigs laid up in a coastal anchorage under a cloudy sky",
      },
      {
        no: "03",
        title: "Equipment & Machinery Trading",
        body: "We trade a wide range of marine equipment, sourcing quality machinery from reliable suppliers so that clients operate with durable, compliant equipment that supports their success.",
        image: "jack-up-rig-evening",
        imageAlt: "Jack-up drilling rig photographed in the evening light",
      },
      {
        no: "04",
        title: "Consultation & Advisory",
        body: "Asset trading is complex, and each transaction carries real financial and operational commitments. Our advisory services guide clients at every stage, offering insights that align with strategic goals while maximizing value and minimizing risk.",
        image: "rig-fleet",
        imageAlt: "Fixed offshore production platforms spread across a calm sea toward the horizon",
      },
    ],
  },
  proof: {
    eyebrow: "PROOF / NETWORK",
    heading: "A network built for clean transactions",
    points: [
      {
        title: "Maritime expert bench",
        detail:
          "Every transaction is supported by maritime experts, surveyors, valuers, and loss assessors working as one team.",
      },
      {
        title: "Global market reach",
        detail:
          "We connect buyers and sellers across global maritime markets, covering vessels, rigs, and a wide range of marine assets.",
      },
      {
        title: "Regulatory knowledge",
        detail:
          "Valuations and appraisals account for asset condition, trends, and compliance with Class and statutory requirements under SOLAS and the MODU Codes.",
      },
    ],
  },
  why: {
    heading: "Why SOLAS MODU",
    body: "Years of experience and a reputation for excellence stand behind our Broking & Trading division: accurate valuations, reliable guidance, and seamless transaction processes for clients worldwide.",
  },
  cta: {
    heading: "Looking to buy, sell, or value a marine asset?",
    body: "Contact our Broking & Trading division to discuss your requirements and plan your next transaction.",
    primary: { label: "Contact Us", href: "/#contact" },
    secondary: { label: "View Certificates", href: "/certificates" },
  },
};
