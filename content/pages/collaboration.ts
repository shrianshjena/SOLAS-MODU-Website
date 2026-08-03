import type { ServicePageContent } from "../types";

export const collaboration: ServicePageContent = {
  meta: {
    title: "Collaboration | SOLAS MODU Marine Services",
    description:
      "Partnership, coordination, and resource support for maritime and offshore projects, from partner network development to training and advisory services.",
    path: "/collaboration",
  },
  eyebrow: "SVC 06 / COLLABORATION",
  heading: "Building Successful Partnerships",
  lede:
    "In an industry as complex and interconnected as maritime and offshore, collaboration drives innovation, efficiency, and shared success. Our Collaboration Division is where ideas, expertise, and resources converge.",
  heroImage: "industrial-offshore-oil-rig-workers",
  heroImageAlt: "Offshore oil rig crew working together on deck",
  fact: "The world merchant fleet numbers more than 100,000 ships, counted by UNCTAD at about 116,000 vessels in 2026",
  intro: {
    heading: "A platform built for partnership",
    paragraphs: [
      "Collaboration is key to driving innovation, improving efficiency, and achieving shared success in the maritime and offshore industries. We recognize the value of strong partnerships, and we work to provide a platform where ideas, expertise, and resources converge.",
      "In practice, that means connecting clients with trusted partners, arranging access to equipment and specialized expertise, and coordinating the moving parts of multi-party projects: stakeholders, timelines, and resources. The division is growing, and it grows the way we like to work, one successful partnership at a time.",
    ],
    image: "crew-aesthetic",
    imageAlt: "Two offshore workers in orange coveralls and hard hats at a platform railing looking out over a grey sea",
    chips: ["PARTNER NETWORK", "COORDINATION", "RESOURCE ACCESS", "TRAINING"],
  },
  capabilities: {
    eyebrow: "SERVICES / 01-05",
    heading: "How we support partnerships",
    items: [
      {
        no: "01",
        title: "Partner Network Development",
        body: "We build and strengthen a network of trusted partners across the maritime and offshore industries, giving clients reliable resources for equipment, technical support, and specialized expertise.",
        chips: ["EQUIPMENT", "TECHNICAL SUPPORT", "EXPERTISE"],
        image: "oil-and-gas-crew",
        imageAlt: "Oil and gas crew gathered on an offshore installation",
      },
      {
        no: "02",
        title: "Project Coordination & Logistics",
        body: "Essential coordination and logistical support that aligns project goals with partner capabilities, including stakeholder management, timeline tracking, and resource allocation for seamless project execution.",
        chips: ["STAKEHOLDERS", "TIMELINES", "RESOURCES"],
        image: "crew-cargo-ship",
        imageAlt: "Crew members hosing down the red deck of a cargo ship at sea under clear skies",
      },
      {
        no: "03",
        title: "Resource & Equipment Access",
        body: "We facilitate access to essential equipment and technical expertise, helping clients meet project requirements without having to invest in additional infrastructure.",
        image: "maritime-safety-equipment",
        imageAlt: "Assorted maritime safety equipment prepared for inspection",
      },
      {
        no: "04",
        title: "Consulting & Advisory",
        body: "Foundational consulting and advisory services that support project planning and strategic alignment, with practical insights into industry best practices and project feasibility.",
        image: "production-platform",
        imageAlt: "Aerial view of an offshore production platform flaring gas from its flare boom at sea",
      },
      {
        no: "05",
        title: "Training & Knowledge Exchange",
        body: "Training services that strengthen team capabilities, covering operational procedures, safety standards, and industry regulations to promote effective collaboration.",
        image: "workers-in-gas-masks",
        imageAlt: "Crew members in protective gas masks during a safety exercise",
      },
    ],
  },
  proof: {
    eyebrow: "PROOF / FOOTPRINT",
    heading: "An operating footprint to build on",
    points: [
      {
        title: "Mumbai headquarters",
        detail:
          "Head office and operational base in Mumbai, coordinating projects and partner engagements across India and beyond.",
      },
      {
        title: "Arabian Gulf desk",
        detail:
          "A dedicated desk serving clients and partners across the Arabian Gulf.",
      },
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
    ],
  },
  why: {
    heading: "Why SOLAS MODU",
    body: "Our Collaboration Division creates a supportive environment where partnerships can flourish: resource access, logistical coordination, and open communication that enable effective teamwork and shared success. With a proactive approach, a growing network, and a dedication to quality, we provide the foundation for successful partnerships across the maritime and offshore sectors.",
  },
  cta: {
    heading: "Interested in partnering with SOLAS MODU?",
    body: "Contact us to discuss how our Collaboration Division can support your project and help you achieve your goals.",
    primary: { label: "Contact Us", href: "/#contact" },
    secondary: { label: "View Certificates", href: "/certificates" },
  },
  globe: {
    eyebrow: "NET 01 / OPERATING FOOTPRINT",
    heading: "Eight stations, one operating network",
    lede:
      "Mumbai coordinates the network: delivered projects across India, from the Uran plant and the Mumbai High field to Pipavav and Thoothukudi, a dedicated Gulf desk, and inspection experience reaching Zanzibar and Basseterre.",
    // ORDER IS LOAD-BEARING: merged by index with STATIONS in
    // components/three/CollaborationGlobe.tsx. Geographic labels only,
    // never registry or organisation names (client decision 2026-07-30).
    stations: [
      { name: "Mumbai Headquarters", coords: "LAT 19.20 N · LON 72.85 E" },
      { name: "Uran, Maharashtra", coords: "LAT 18.88 N · LON 72.93 E" },
      { name: "Mumbai High Field, Arabian Sea", coords: "LAT 19.42 N · LON 71.33 E" },
      { name: "Pipavav, Gujarat", coords: "LAT 20.92 N · LON 71.50 E" },
      { name: "Thoothukudi, Tamil Nadu", coords: "LAT 8.76 N · LON 78.13 E" },
      { name: "Arabian Gulf Desk", coords: "LAT 25.50 N · LON 53.00 E" },
      { name: "Zanzibar, Tanzania", coords: "LAT 6.16 S · LON 39.19 E" },
      { name: "Basseterre, St. Kitts & Nevis", coords: "LAT 17.30 N · LON 62.72 W" },
    ],
  },
};
