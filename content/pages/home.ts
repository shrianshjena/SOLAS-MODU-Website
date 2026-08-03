import type { HomeContent } from "../types";

export const home: HomeContent = {
  meta: {
    title: "SOLAS MODU Marine Services | Marine Surveys, NDT & Survival Systems",
    description:
      "Marine surveys, certifications, advanced NDT and survival systems for ships, rigs and offshore assets. Based in Mumbai, operating worldwide since 2013.",
    path: "/",
  },
  hero: {
    title: {
      primary: "SOLAS MODU",
      secondary: "Marine Services",
      tertiary: "Private Limited",
    },
    tagline:
      "Delivering Innovative Services across the Marine Industry, Turning Offshore Challenges into Smooth Sailing.",
    primary: { label: "Explore Services", href: "#services" },
    secondary: { label: "Request a Survey", href: "#contact" },
    ais: "SOLAS MODU · LAT 19.20 N · LON 72.87 E · STA MUMBAI, INDIA · STATUS OPERATIONAL",
    scrollCue: "SOUND DEPTH",
  },
  intro: {
    eyebrow: "STN 01 / WHO WE ARE",
    heading:
      "Safety of Life at Sea. Mobile Offshore Drilling Unit. The name is the mandate.",
    paragraphs: [
      "SOLAS MODU Marine Services Pvt. Ltd. delivers innovative solutions across the marine and offshore oil and gas industries, spanning marine services, surveys and certifications, advanced NDT, survival systems, condition monitoring, and turnkey contracting. Built on an uncompromising commitment to safety, compliance, and efficiency, we bring more than a decade of hands-on expertise to the industry’s most demanding, high-risk projects worldwide.",
      "Our specialists thrive on turning offshore challenges into successful operations. We lead with precision and innovation so that every project meets the highest standards of safety and compliance. Whether the asset is a rig or a ship, we transform offshore complexity into smooth sailing, with solutions shaped around each client’s specific needs.",
    ],
    image: "jack-up-rig-evening",
    imageAlt: "Jack-up drilling rig silhouetted against an evening sky",
    stats: [
      { value: "30+", label: "Years of leadership", caption: "Shipping and offshore drilling" },
      { value: "3", label: "ISO certifications", caption: "9001 · 14001 · 45001" },
      { value: "4", label: "Class societies", caption: "ABS · BV · IRS · RINA" },
      { value: "45+", label: "Approvals & contracts", caption: "Certificates on record" },
    ],
  },
  services: {
    eyebrow: "STN 02 / OUR SERVICES",
    heading: "Six divisions, one standard",
    lede: "Six specialist divisions cover the full life of a marine asset, from certification and inspection to repair, trading, and partnership.",
    items: [
      {
        no: "01",
        title: "Surveys & Certifications",
        summary:
          "Class and Flag State approved surveys, statutory inspections, and certification services that keep vessels and offshore assets compliant.",
        href: "/surveys",
        icon: "survey",
      },
      {
        no: "02",
        title: "Advanced NDT",
        summary:
          "Precision non-destructive testing, from LRUT and PEC to AUT and TOFD, that safeguards structural integrity and extends asset life.",
        href: "/ndt",
        icon: "waveform",
      },
      {
        no: "03",
        title: "Survival Systems",
        summary:
          "Certified servicing and supply of life-saving appliances: lifeboats, life rafts, HRU, immersion suits, and emergency equipment.",
        href: "/survival",
        icon: "lifebuoy",
      },
      {
        no: "04",
        title: "Ship & Boat Design",
        summary:
          "Custom vessel design, fast craft construction, and hull repairs to Class and Flag State standards for patrol boats, pilot boats, yachts, and ferries.",
        href: "/shipdesign",
        icon: "hull",
      },
      {
        no: "05",
        title: "Broking & Trading",
        summary:
          "Sale, purchase, and valuation of marine assets, with transparent dealings backed by surveyors, valuers, and loss assessors.",
        href: "/broking",
        icon: "scale",
      },
      {
        no: "06",
        title: "Collaboration",
        summary:
          "A trusted partner network that brings equipment, expertise, and project coordination together for shared success.",
        href: "/collaboration",
        icon: "network",
      },
    ],
  },
  operations: {
    eyebrow: "STN 03 / OPERATIONS LOG",
    heading: "A decade of campaigns, logged",
    lede: "From rig operations and platform extensions to LRUT pipeline screening and flag state inspections, our teams have delivered for ONGC, IOCL, and Jagson since 2013, with active contracts running through 2029.",
    stats: [
      { value: "15+", label: "Project campaigns", caption: "Rigs, platforms, refineries, pipelines" },
      { value: "2013", label: "Operating since", caption: "First campaign: ONGC Sagar Pragati" },
      { value: "2029", label: "Contract horizon", caption: "ONGC vessels & piping" },
    ],
  },
  leadership: {
    eyebrow: "STN 04 / LEADERSHIP",
    heading: "Experience at the helm",
    leaders: [
      {
        name: "Bikram Kumar Jena",
        role: "CEO & Director",
        credentials: [
          "B.E. (Marine)",
          "LLB",
          "Fellow, Institute of Marine Engineers (FIMarE)",
          "Marine Chief Engineer",
        ],
        bio: [
          "Bikram brings over 30 years in the shipping and offshore oil and gas drilling industry, including nine years of survey experience as a former ABS Surveyor.",
          "He previously served as Chief Technical Officer of a drilling company owning offshore jack-up drilling rigs.",
        ],
        image: "bikram-portrait",
        imageAlt: "Portrait of Bikram Kumar Jena, CEO & Director of SOLAS MODU Marine Services",
      },
      {
        name: "Reena Jena",
        role: "Director",
        credentials: [
          "Business Operations",
          "Accounts & Administration",
          "Company Management",
        ],
        bio: [
          "Reena serves as Director, bringing extensive experience in business operations, accounting, and the overall management of SOLAS MODU. Her stewardship of the company’s day-to-day running makes her one of its most vital operational leaders.",
        ],
      },
    ],
  },
  trustedBy: {
    eyebrow: "STN 05 / TRUSTED BY",
    heading: "Accredited where it matters",
    accreditations: [
      "ABS",
      "BUREAU VERITAS",
      "IRS",
      "RINA",
      "IADC ASSOCIATE MEMBER",
      "ISO 9001",
      "ISO 14001",
      "ISO 45001",
      "FLAG STATE INSPECTIONS",
    ],
  },
  galleryTeaser: {
    eyebrow: "DECK LOG / GALLERY",
    heading: "Scenes from the field",
    images: [
      { key: "vessel-pluto", alt: "Crew member at the rail of the vessel Pluto in heavy weather" },
      { key: "sunset", alt: "Sunset over the sea from an offshore platform deck, a lifeboat stowed in its davit below" },
      { key: "marine-engineer-confined-space", alt: "Marine engineer working in a confined space during an inspection" },
      { key: "bikram-2", alt: "Bikram Kumar Jena on site during an offshore inspection" },
    ],
    cta: { label: "View the Gallery", href: "/gallery" },
  },
  contact: {
    eyebrow: "STN 06 / CONTACT",
    heading: "Speak with our team",
    lede: "Whether you need a class survey, an NDT campaign, or servicing for life-saving appliances, tell us about your asset and operating window. We respond with a clear scope and a practical plan.",
  },
};
