import type { SimplePageHero } from "../types";

export const careersPage: SimplePageHero & {
  whyJoin: { title: string; body: string }[];
  form: {
    heading: string;
    positions: string[];
    resumeNote: string;
    success: string;
    error: string;
    submitLabel: string;
  };
} = {
  meta: {
    title: "Careers | SOLAS MODU Marine Services",
    description:
      "Careers at SOLAS MODU Marine Services: offshore roles for marine surveyors, NDT technicians, LSA engineers, and more. Apply with your resume today.",
    path: "/careers",
  },
  eyebrow: "CREW 01 / CAREERS",
  heading: "Join Our Team",
  lede: "Our surveyors, technicians, and engineers work where the industry is most demanding: on rigs, platforms, and vessels at sea. We review every application, whether or not a role is advertised.",
  heroImage: "oil-and-gas-crew",
  heroImageAlt: "Offshore oil and gas crew at work on a rig deck",
  whyJoin: [
    {
      title: "Offshore Exposure",
      body: "Field roles put you on working assets: jack-up rigs, offshore platforms, vessels, and refinery sites, not behind a desk.",
    },
    {
      title: "Class-Grade Standards",
      body: "Every job runs to Class and statutory requirements under SOLAS and MODU Codes, with approvals from societies including ABS, BV, and IRS.",
    },
    {
      title: "Certified Training",
      body: "Structured, hands-on development under certified surveyors, NDT specialists, and LSA service engineers.",
    },
  ],
  form: {
    heading: "Apply to SOLAS MODU",
    positions: [
      "Marine Surveyor",
      "NDT Technician",
      "LSA Service Engineer",
      "Marine Engineer",
      "Naval Architect",
      "Project Manager",
      "Business & Operations",
      "Other",
    ],
    resumeNote: "Attach your resume as a single file no larger than 4MB.",
    success:
      "Your application has been submitted successfully. Our team reviews every submission and will contact you if there is a match.",
    error:
      "We could not submit your application. Please try again in a moment, or reach us through the contact page.",
    submitLabel: "Submit Application",
  },
};
