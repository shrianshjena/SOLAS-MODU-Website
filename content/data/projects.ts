import type { Project } from "../types";

// Track record migrated from the company deck, ordered chronologically.
// Entries with period "" have no stated date in the source records; they are
// slotted where context places them in the timeline.

const sagarPragatiOm: Project = {
  period: "2013-2014",
  title: "Sagar Pragati Operations & Maintenance",
  body: "Operations and maintenance of the ONGC jack-up rig Sagar Pragati, including thickness measurements of all structural components.",
  href: "/shipdesign",
};

const sagarPragatiRenewal: Project = {
  // Period not stated in source records.
  period: "",
  title: "Sagar Pragati Steel & Pipe Renewal",
  body: "Renewal of steel structures and piping on the ONGC jack-up rig Sagar Pragati.",
  href: "/shipdesign",
};

const jackingGearRepairs: Project = {
  // Period not stated in source records.
  period: "",
  title: "Jacking Gear Repair & Certification",
  body: "Jacking gear repair and certification on the jack-up rigs Sagar Pragati (ONGC) and Deepsea Fortune (Jagson).",
  href: "/shipdesign",
};

const uranLrut: Project = {
  period: "2015",
  title: "LRUT Screening, ONGC Uran Plant",
  body: "Advanced NDT at the ONGC Uran Plant, using LRUT to screen plant pipelines for corrosion and anomalies.",
  href: "/ndt",
};

const neelamLifeboats: Project = {
  period: "2015",
  title: "Neelam Platform Lifeboats",
  body: "Installation and commissioning of lifeboats at the ONGC Neelam Platform, certified by ABS and CEIL.",
  href: "/survival",
};

const neelamExtensions: Project = {
  period: "2015-2017",
  title: "Neelam Platform Extensions",
  body: "Design, fabrication, and installation of two offshore platform extensions at the ONGC Neelam Platform: engineered in SACS, inspected by NDT under ABS witness, and load tested with water bags.",
  href: "/shipdesign",
};

const ongcPipelineRateContract: Project = {
  period: "2015-2018",
  title: "ONGC Pipeline Rate Contract",
  body: "Advanced NDT of offshore oil and gas pipelines under an annual rate contract with ONGC.",
  href: "/ndt",
};

const haziraHealthCheck: Project = {
  period: "2016-ongoing",
  title: "ONGC Hazira Health Check",
  body: "Ongoing NDT and health check of the ONGC Hazira refinery, covering UT, MPI, DP, radiography, and hardness testing.",
  href: "/ndt",
};

const deepseaFortuneDavits: Project = {
  // Period not stated in source records.
  period: "",
  title: "Deepsea Fortune Davit Load Testing",
  body: "Load testing and certification of lifeboat davits on the Jagson rig Deepsea Fortune.",
  href: "/survival",
};

const underwaterInspection: Project = {
  // Period not stated in source records.
  period: "",
  title: "Underwater Inspection & Diving",
  body: "Underwater inspection and diving support for Great Offshore vessels and barges.",
  href: "/surveys",
};

const conditionValueSurveys: Project = {
  // Period not stated in source records.
  period: "",
  title: "Condition & Value Assessment Surveys",
  body: "Condition and value assessment surveys for marine and offshore assets.",
  href: "/surveys",
};

const deepseaTreasureCampaign: Project = {
  period: "2022",
  title: "Deepsea Treasure Campaign",
  body: "Flag State inspection and annual LSA, FFA, and crane servicing of the Jagson rig Deepsea Treasure under Zanzibar Maritime Authority authorization.",
  href: "/surveys",
};

// Post-2022 entries (round 5, 2026-08-03): facts trace to the contracts and
// certificates on file; validity dates must not change without re-verification.
const ongcDrillingRigRateContract: Project = {
  period: "2023-2026",
  title: "ONGC Drilling Rig Rate Contract",
  body: "NDT services on eight ONGC-owned offshore drilling rigs under a standing rate contract, with crews mobilized offshore as inspection requirements arise across the fleet.",
  href: "/ndt",
};

const lrutHealthAssessment: Project = {
  period: "2024",
  title: "LRUT Pipeline Health Assessment",
  body: "Health assessment of non-piggable overhead pipelines at ONGC facilities, screened by long range ultrasonic testing from limited access points and reported for integrity follow up.",
  href: "/ndt",
};

const ongcVesselsPiping: Project = {
  period: "2024-2029",
  title: "ONGC Vessels & Piping Campaign",
  body: "NDT of vessels and piping on process and unmanned platforms across ONGC's Western Offshore assets, an active campaign running through 2029.",
  href: "/ndt",
};

const classIsoRenewals: Project = {
  period: "2025-2026",
  title: "Class & ISO Renewals",
  body: "ABS Recognized Service Supplier approvals for nondestructive inspection and ESP hull gauging to 2028, IRS service supplier approvals through 2028 and 2029, and the new ISO 9001, 14001, and 45001 cycle to 2028.",
  href: "/certificates",
};

export const projects: Project[] = [
  sagarPragatiOm,
  sagarPragatiRenewal,
  jackingGearRepairs,
  uranLrut,
  neelamLifeboats,
  neelamExtensions,
  ongcPipelineRateContract,
  haziraHealthCheck,
  deepseaFortuneDavits,
  underwaterInspection,
  conditionValueSurveys,
  deepseaTreasureCampaign,
  ongcDrillingRigRateContract,
  lrutHealthAssessment,
  ongcVesselsPiping,
  classIsoRenewals,
];

/** The strongest engagements, surfaced on the home operations timeline. */
export const featuredProjects: Project[] = [
  sagarPragatiOm,
  neelamLifeboats,
  neelamExtensions,
  ongcPipelineRateContract,
  haziraHealthCheck,
  deepseaTreasureCampaign,
  ongcDrillingRigRateContract,
  lrutHealthAssessment,
  ongcVesselsPiping,
  classIsoRenewals,
];
