import type { ServicePageContent } from "../types";

export const ndt: ServicePageContent = {
  meta: {
    title: "Advanced NDT Division | SOLAS MODU Marine Services",
    description:
      "Advanced NDT services for marine and offshore assets: LRUT, SRUT, PEC, AUT, TOFD, and Phased Array inspections that protect asset integrity and compliance.",
    path: "/ndt",
  },
  eyebrow: "SVC 02 / ADVANCED NDT",
  heading: "Advanced NDT Division",
  lede:
    "Precise, reliable Non-Destructive Testing that maintains asset safety, prolongs operational life, and supports compliance with strict industry standards.",
  heroImage: "marine-engineer-confined-space",
  heroImageAlt: "NDT specialist carrying out an inspection inside a confined space on a marine asset",
  fact: "Ultrasonic longitudinal waves travel through steel at roughly 5,900 metres per second, the physics behind every thickness reading",
  intro: {
    heading: "Structural integrity, verified",
    paragraphs: [
      "In the high-stakes world of marine and offshore operations, the structural integrity of your assets is paramount. Our advanced NDT division specializes in advanced Non-Destructive Testing techniques, delivering precise and reliable assessments that keep assets safe, prolong operational life, and support compliance with strict industry standards.",
      "Every solution is tailored to the unique demands of marine and offshore environments. Cutting-edge NDT methods detect corrosion at an early stage, allowing timely maintenance that prevents asset failure, while routine assessments mitigate wear and tear and optimize the lifespan of valuable assets in corrosive marine conditions.",
      "Techniques such as LRUT and PEC minimize the need for dismantling or insulation removal, reducing cost and downtime. Just as importantly, every inspection helps you comply with rigorous safety standards and prevent operational risks.",
    ],
    image: "ultrasonic-testing",
    imageAlt: "On-screen display of an ultrasonic testing instrument during a pipeline inspection",
    chips: ["LRUT", "SRUT", "PEC", "AUT", "TOFD"],
  },
  capabilities: {
    eyebrow: "TECHNIQUES / 01-04",
    heading: "The techniques we deploy",
    items: [
      {
        no: "01",
        title: "LRUT (Guided Wave Ultrasonic Testing)",
        body: "Long Range Ultrasonic Testing enables rapid, comprehensive screening of pipelines from 2\" to 72\" in diameter for internal and external corrosion, erosion, and other anomalies. It is ideal for long pipeline runs, especially sections inaccessible to conventional UT, and delivers cost-effective inspection without extensive manpower or access alterations.",
        chips: ["LRUT", "GW", "2\" TO 72\""],
        image: "lrut-testing",
        imageAlt:
          "Guided wave testing collar clamped around a pipeline with a portable instrument displaying signal data",
      },
      {
        no: "02",
        title: "SRUT (Guided Laminar Wave Testing)",
        body: "Short Range Ultrasonic Testing uses pulsed guided laminar waves to detect near-surface defects. The technique is non-invasive, requires minimal surface preparation, and produces quick results.",
        chips: ["SRUT", "NEAR-SURFACE"],
        image: "srut-testing",
        imageAlt:
          "Technicians screening an excavated pipeline with a segmented ultrasonic transducer ring and a field laptop",
      },
      {
        no: "03",
        title: "PEC (Pulsed Eddy Current Testing)",
        body: "A versatile, volumetric screening tool that measures remaining wall thickness in insulated components without removing insulation or coating. Quick, reliable results allow operations to continue uninterrupted during inspection, reducing downtime.",
        chips: ["PEC", "VOLUMETRIC", "NO INSULATION REMOVAL"],
        image: "pect-testing",
        imageAlt: "Diagram of pulsed eddy current testing showing a probe measuring wall loss through pipe insulation",
      },
      {
        no: "04",
        title: "AUT, TOFD & Phased Array",
        body: "Advanced ultrasonic techniques commonly used in plant piping, pipeline butt weld inspections, and storage tanks.",
        chips: ["AUT", "TOFD", "PHASED ARRAY"],
        image: "submerged-arc-welding",
        imageAlt: "Submerged arc welding in progress on a steel pipe section",
      },
    ],
  },
  proof: {
    eyebrow: "PROOF / TRACK RECORD",
    heading: "Contracts and completions on record",
    points: [
      {
        title: "ONGC Uran job completion",
        detail:
          "Job completion certificate for LRUT, PAUT, and PEC services delivered at the ONGC Uran plant.",
        period: "2022",
        href: "/certificates",
      },
      {
        title: "IOCL Tuticorin pipeline testing",
        detail:
          "Work completion certificate for LRUT pipeline testing carried out at IOCL Tuticorin.",
        period: "2020",
        href: "/certificates",
      },
      {
        title: "ONGC long-term NDT contracts",
        detail:
          "Inspection and NDT of cranes for the MH Asset (2022-2024), NDT services for offshore drilling rigs (2023-2026), NDT of vessels and piping (2024-2029), and health assessment of non-piggable pipelines using LRUT (2024).",
        period: "2022-2029",
        href: "/certificates",
      },
      {
        title: "ONGC Hazira health checks",
        detail:
          "Ongoing NDT and health checks at the ONGC Hazira refinery, covering UT, MPI, DP, radiography, and hardness testing.",
        period: "2016-ongoing",
        href: "/certificates",
      },
    ],
  },
  why: {
    heading: "Why SOLAS MODU",
    body: "A team of certified NDT specialists and years of experience in maritime safety make our advanced NDT division a trusted partner for asset integrity and operational safety. Precision, innovation, and reliability underpin every inspection, so you receive actionable insights and dependable results.",
  },
  cta: {
    heading: "Ready to verify the integrity of your assets?",
    body: "Get in touch with our advanced NDT division to schedule a consultation and learn how specialized NDT solutions can support your asset integrity and compliance goals.",
    primary: { label: "Contact Us", href: "/#contact" },
    secondary: { label: "View Certificates", href: "/certificates" },
  },
  instruments: {
    eyebrow: "LAB 01 / SIGNAL ROOM",
    heading: "Reading the signal",
    lede: "Two instrument views show how guided wave screening reads pipeline condition: the A-scan plots echo amplitude against distance along the pipe, and the interpreted overlay marks the indications an analyst confirms.",
  },
};
