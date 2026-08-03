import type { ServicePageContent } from "../types";

export const shipdesign: ServicePageContent = {
  meta: {
    title: "Ship & Boat Design | SOLAS MODU Marine Services",
    description:
      "Custom vessel design, fast craft construction, hull repairs, coatings, and project management for rigs and ships, delivered to Class and Flag State standards.",
    path: "/shipdesign",
  },
  eyebrow: "SVC 04 / SHIP & BOAT DESIGN",
  heading: "Ship & Boat Design",
  lede:
    "Custom design and comprehensive repair for marine vessels, from patrol boats and pilot boats to yachts and ferries, delivered with expertise and precision.",
  heroImage: "worlds-largest-semi-submersible",
  heroImageAlt: "The world’s largest semi-submersible drilling rig at sea",
  fact: "The largest container ships afloat stretch nearly 400 metres and carry more than 24,000 containers",
  intro: {
    heading: "From drawing board to drydock",
    paragraphs: [
      "From custom design to comprehensive repair, our Ship & Boat Design Division brings expertise and precision to every project. We craft tailored designs and execute repairs for a wide range of marine vessels, including patrol boats, pilot boats, yachts, and ferries.",
      "That scope runs from conceptual and detailed design through construction, hull repair, and protective coatings, and it extends to project management and consulting for rigs and ships: repair, drydocking, new construction, and offshore asset management.",
      "Every repair restores the asset to Class and Flag State standards, so the vessel that returns to service is as compliant as it is capable.",
    ],
    image: "oil-and-gas-crew",
    imageAlt: "Oil and gas crew coordinating on deck during an offshore project",
    chips: ["PATROL BOATS", "PILOT BOATS", "YACHTS", "FERRIES"],
  },
  capabilities: {
    eyebrow: "SERVICES / 01-05",
    heading: "What we design, build, and manage",
    items: [
      {
        no: "01",
        title: "Custom Ship & Boat Design",
        body: "Fully customized design solutions tailored to each client’s needs, spanning conceptual and detailed design, 3D modeling, and regulatory compliance checks.",
        chips: ["CONCEPT", "3D MODELING", "COMPLIANCE"],
        image: "lifeboat-profile",
        imageAlt: "Davit launched totally enclosed lifeboat stowed at a ship's side with its hatch open",
      },
      {
        no: "02",
        title: "Fast Craft Construction",
        body: "Durable, high-performance vessels such as patrol boats, yachts, and ferries, constructed with advanced materials and proven engineering practices.",
        image: "first-lifeboat",
        imageAlt: "Enclosed lifeboat photographed during an early SOLAS MODU build and servicing project",
      },
      {
        no: "03",
        title: "Hull Repairs",
        body: "Hull integrity restored to Class and Flag State standards, addressing corrosion, impact damage, and structural fatigue.",
        image: "submerged-arc-welding",
        imageAlt: "Submerged arc welding on a steel section during hull repair work",
      },
      {
        no: "04",
        title: "Coatings & Corrosion Protection",
        body: "High-quality coatings and anti-corrosion protection that preserve your vessel’s structural integrity and appearance in harsh marine environments.",
        image: "hull-inspection",
        imageAlt: "Underwater inspection ROV with lights surveying a ship's propeller and rudder",
      },
      {
        no: "05",
        title: "Project Management & Consulting",
        body: "Project management and consulting for rigs and ships alike: repair and drydocking, new construction management, and offshore asset management, supported by comprehensive contract drafting, negotiation, and risk and compliance consulting.",
        chips: ["DRYDOCKING", "NEW BUILD", "ASSET MGMT"],
        image: "main-engine-room",
        imageAlt: "Main engine cylinder heads and railed walkways inside a ship's engine room",
      },
    ],
  },
  proof: {
    eyebrow: "PROOF / TRACK RECORD",
    heading: "Structural work delivered offshore",
    points: [
      {
        title: "ONGC Neelam platform extensions",
        detail:
          "Design, fabrication, and installation of two offshore platform extensions at the ONGC Neelam platform: structural design in SACS software, NDT carried out under ABS witness, and load testing with water bags.",
        period: "2015-2017",
        href: "/certificates",
      },
      {
        title: "Sagar Pragati steel and pipe renewal",
        detail:
          "Steel and pipe renewal completed on the ONGC jack-up rig Sagar Pragati.",
        href: "/certificates",
      },
      {
        title: "Jacking gear repair and certification",
        detail:
          "Jacking gear repaired and certified on the ONGC jack-up rig Sagar Pragati and the Jagson rig Deepsea Fortune.",
        href: "/certificates",
      },
    ],
  },
  why: {
    heading: "Why SOLAS MODU",
    body: "Years of experience and a team of skilled marine experts let us put quality, compliance, and innovation first. The solutions we deliver are reliable, customized, and built to the highest industry standards.",
  },
  cta: {
    heading: "Ready to design, build, or repair?",
    body: "Whether you need custom vessel design, structural repair, or system upgrades, our Ship & Boat Design Division is ready to help.",
    primary: { label: "Contact Us", href: "/#contact" },
    secondary: { label: "View Certificates", href: "/certificates" },
  },
  showcase: {
    eyebrow: "OBJ 01 / HULL FORM",
    heading: "Hull form geometry studied in three dimensions before steel is cut",
    description:
      "Fair hull surfaces decide how a vessel displaces, handles, and wears. Reading the geometry in the round informs the design and repair decisions our teams make long before fabrication begins.",
    label: "MDL 01 / HULL FORM",
  },
};
