import type { ServicePageContent } from "../types";

export const survival: ServicePageContent = {
  meta: {
    title: "Survival Systems | SOLAS MODU Marine Services",
    description:
      "Certified servicing of life-saving appliances: lifeboats, life rafts, HRU, immersion suits, EPIRBs, SCBA, and fire fighting systems for offshore crews.",
    path: "/survival",
  },
  eyebrow: "SVC 03 / SURVIVAL SYSTEMS",
  heading: "Survival Systems",
  lede:
    "Comprehensive survival systems that equip marine and offshore crews to respond effectively in an emergency, safeguarding lives and assets alike.",
  heroImage: "solas-modu-lifeboat-deployment",
  heroImageAlt:
    "SOLAS MODU crew deploying a lifeboat during a survival systems exercise",
  fact: "The first SOLAS convention, adopted in 1914 after the Titanic disaster, required lifeboats for every person on board",
  intro: {
    heading: "Ready when it matters most",
    paragraphs: [
      "Our Survival Systems division delivers comprehensive safety solutions for marine and offshore operations. From lifeboats to distress beacons, every system we maintain is kept in a state of readiness, so your personnel can respond effectively in an emergency and lives and assets stay protected.",
      "We operate a certified service station for Life-Saving Appliances, recognized by ABS for SOLAS servicing of LSA, self-contained breathing apparatus, and fire extinguishing systems, and approved by Bureau Veritas for LSA services since 2011. Rigorous testing protocols stand behind every inspection and every certificate.",
    ],
    image: "workers-lifeboat-service",
    imageAlt: "Technicians servicing a lifeboat at the SOLAS MODU service station",
    chips: ["ABS LSA", "ABS SCBA", "ABS FIRE EXT", "BV LSA 2011"],
  },
  capabilities: {
    eyebrow: "SCOPE / 01-06",
    heading: "Life-saving equipment, kept ready",
    items: [
      {
        no: "01",
        title: "LSA Servicing & Certification",
        body: "A certified service station for Life-Saving Appliances covering lifeboats, life rafts, HRU, and immersion suits. Each item is serviced and certified for optimal readiness and reliability.",
        chips: ["LIFEBOATS", "LIFE RAFTS", "HRU", "IMMERSION SUITS"],
        image: "lifeboat-at-sea",
        imageAlt: "Enclosed lifeboat underway at sea",
      },
      {
        no: "02",
        title: "Immersion & Survival Suits",
        body: "Survival suits that protect against hypothermia and exposure, keeping personnel safe in harsh conditions. We inspect and certify immersion suits within our certified LSA station scope.",
        image: "immersion-suits",
        imageAlt: "Immersion suits laid out for inspection and testing",
      },
      {
        no: "03",
        title: "Life Rafts",
        body: "High-quality life rafts designed for maximum reliability and safety in emergencies, complemented by comprehensive survival kits containing the essentials that enhance crew safety.",
        image: "inflatable-life-rafts",
        imageAlt: "Inflatable life rafts ready for deployment",
      },
      {
        no: "04",
        title: "Davit & Launching Systems",
        body: "Repair, load testing, and certification of lifeboat davits and launching appliances, including free-fall systems, so every boat can be launched safely the moment it is needed.",
        image: "free-fall-lifeboat-davit-repairs",
        imageAlt: "Repairs in progress on a free-fall lifeboat davit",
      },
      {
        no: "05",
        title: "Distress Signalling: EPIRBs & PFDs",
        body: "EPIRBs provide critical distress signalling, ensuring help is on the way when you need it most. Alongside them, we supply a range of PFDs so your crew carries the best protection available.",
        chips: ["EPIRB", "PFD"],
        image: "epirb-2",
        imageAlt:
          "Float free EPIRB stowed in its hydrostatic release bracket on a ship railing beside the EPIRB station sign",
      },
      {
        no: "06",
        title: "Fire Fighting & Breathing Apparatus",
        body: "Servicing of fire extinguishing systems and self-contained breathing apparatus, backed by ABS Certificates of Service Recognition for both, with annual FFA servicing carried out to SOLAS requirements.",
        chips: ["SCBA", "FFA"],
        image: "scba",
        imageAlt: "Self-contained breathing apparatus sets staged for servicing",
      },
    ],
  },
  proof: {
    eyebrow: "PROOF / ON RECORD",
    heading: "Survival systems, proven in service",
    points: [
      {
        title: "ONGC Neelam Platform lifeboats",
        detail:
          "Installation and commissioning of lifeboats at the ONGC Neelam Platform, certified by ABS and CEIL.",
        period: "2015",
        href: "/certificates",
      },
      {
        title: "Deepsea Fortune davit load testing",
        detail:
          "Load testing and certification of lifeboat davits on the Jagson rig Deepsea Fortune.",
        href: "/certificates",
      },
      {
        title: "Deep Sea Treasure lifeboat inspection",
        detail:
          "Lifeboat inspection and certification carried out for Deep Sea Treasure.",
        period: "2022",
        href: "/certificates",
      },
      {
        title: "Annual LSA, FFA & crane servicing",
        detail:
          "Recurring annual servicing of life-saving appliances, fire fighting appliances, and cranes, performed per SOLAS and API RP 2D.",
        href: "/certificates",
      },
    ],
  },
  why: {
    heading: "Why SOLAS MODU",
    body: "Our team understands how much rides on survival systems in maritime operations. With cutting-edge technology and rigorous testing protocols, every system we service meets the highest standards of safety and reliability: proven solutions that protect your crew and your assets.",
  },
  cta: {
    heading: "Keep your safety preparedness at the forefront",
    body: "Contact our Survival Systems team to discuss LSA servicing, certification, and supply for your vessels and offshore assets.",
    primary: { label: "Contact Us", href: "/#contact" },
    secondary: { label: "View Certificates", href: "/certificates" },
  },
  showcase: {
    eyebrow: "OBJ 01 / EQUIPMENT MODEL",
    heading: "Lifeboat and LSA hardware examined in three dimensions",
    description:
      "Launching appliances, release gear, and stowage arrangements read differently in the round. The model mirrors the survival equipment our teams inspect, service, and certify.",
    label: "MDL 01 / LIFEBOAT + LSA",
  },
};
