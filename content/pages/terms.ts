import type { LegalPageContent } from "../types";

/**
 * /terms copy. The final section renders in the dark closing band on the
 * page (its last paragraph is the mono contact telegram); all earlier
 * sections render on the light surface.
 */
export const termsPage: LegalPageContent = {
  meta: {
    title: "Terms & Conditions | SOLAS MODU Marine Services",
    description:
      "The terms that govern your use of solasmodu.net: information accuracy, AI-assisted imagery, image sources, intellectual property, acceptable use, liability, and governing law.",
    path: "/terms",
  },
  eyebrow: "LEG 01 / TERMS & CONDITIONS",
  heading: "Terms & Conditions",
  lede: "These terms keep things clear for both of us. They explain what you can expect from this website, how its content may be used, and where to turn when a decision depends on the details.",
  effectiveDate: "EFFECTIVE 2026-07-30 · REV 1.1",
  sections: [
    {
      eyebrow: "LEG 02 / ACCEPTANCE",
      heading: "Acceptance of These Terms",
      paragraphs: [
        "By accessing or using solasmodu.net you agree to these terms and conditions. The website is operated by SOLAS MODU Marine Services Pvt. Ltd., Mumbai, India. If you do not agree with any part of these terms, please do not use the site.",
      ],
    },
    {
      eyebrow: "LEG 03 / INFORMATION",
      heading: "Information on This Website",
      paragraphs: [
        "Everything published on this website is provided in good faith and for general guidance about our company and services. We work to keep the content accurate and current, and we review it regularly.",
        "Our services, specifications, certifications, and other information may change without notice as our operations, approvals, and the applicable rules evolve. The website is a general introduction, not a contractual offer and not a substitute for a formal quotation, survey report, or certificate.",
      ],
    },
    {
      eyebrow: "LEG 04 / AI CONTENT",
      heading: "AI-Assisted Imagery and Content",
      paragraphs: [
        "Some imagery on this website has been enhanced or generated using AI technologies, and some content has been prepared with AI assistance. We review this material carefully before publication, and even so, AI-assisted content may occasionally contain inaccuracies.",
        "When a detail matters to a business decision, please contact SOLAS MODU directly to verify critical information such as service scope, certification status, and technical specifications before relying on it. SOLAS MODU Marine Services Pvt. Ltd. is not liable for losses arising from reliance on unintended inaccuracies on this website.",
      ],
    },
    {
      eyebrow: "LEG 05 / IP",
      heading: "Intellectual Property and Image Sources",
      paragraphs: [
        "The SOLAS MODU wordmark, and the original text, graphics, design, and photography we have produced for this website, are the property of SOLAS MODU Marine Services Pvt. Ltd. You are welcome to view and print pages for your own reference. Reproduction, redistribution, or commercial use of any part of the site requires our prior written consent.",
        "Some photographs and illustrations on this website are sourced from third parties, including publicly available sources, and remain the property of their respective owners. They appear here in good faith and for illustration only; their use is not intended to claim ownership, to suggest any affiliation or endorsement, or to misrepresent their origin in any way.",
        "If you hold rights in an image shown on this website and would like attribution added or the image removed, write to office@solasmodu.net and we will act promptly.",
      ],
    },
    {
      eyebrow: "LEG 06 / USE",
      heading: "Acceptable Use",
      paragraphs: [
        "You agree to use this website lawfully and considerately. Please do not scrape or harvest its content or data, probe or disrupt the site or its infrastructure, misrepresent your identity in forms, or use the site for any unlawful purpose. We may restrict access where these terms are not respected.",
      ],
    },
    {
      eyebrow: "LEG 07 / LIABILITY",
      heading: "Warranties and Liability",
      paragraphs: [
        "This website is provided on an as-is and as-available basis. To the extent permitted by law, we make no warranties, express or implied, about the website itself, including uninterrupted availability or fitness for a particular purpose. This applies to the website as an online publication; the professional services we deliver to clients are governed by their own contracts and standards.",
        "To the extent permitted by law, SOLAS MODU Marine Services Pvt. Ltd. is not liable for indirect or consequential losses arising from the use of, or inability to use, this website. Nothing in these terms excludes any liability that cannot be excluded under applicable law.",
      ],
    },
    {
      eyebrow: "LEG 08 / RESPONSIBILITY",
      heading: "Your Responsibility",
      paragraphs: [
        "If your use of this website in breach of these terms leads to a claim against us, you agree to take reasonable steps to resolve it and to cover losses that directly result from that breach. Using the site as intended means this clause will never concern you.",
      ],
    },
    {
      eyebrow: "LEG 09 / LAW",
      heading: "Governing Law and Jurisdiction",
      paragraphs: [
        "These terms are governed by the laws of India. Any dispute arising from these terms or from your use of this website is subject to the exclusive jurisdiction of the courts of Mumbai, India.",
      ],
    },
    {
      eyebrow: "LEG 10 / SEVERABILITY",
      heading: "Severability",
      paragraphs: [
        "If any provision of these terms is found to be invalid or unenforceable, that provision will be applied to the fullest extent permitted, and the remaining provisions will continue in full force.",
      ],
    },
    {
      eyebrow: "LEG 11 / CHANGES",
      heading: "Changes to These Terms",
      paragraphs: [
        "We may revise these terms from time to time as the website and our services develop. The effective date above always reflects the current revision, and continued use of the site after a change constitutes acceptance of the updated terms.",
      ],
    },
    {
      eyebrow: "LEG 12 / CONTACT",
      heading: "Questions About These Terms",
      paragraphs: [
        "If anything here is unclear, or you would like written confirmation of any detail before proceeding, we are happy to help.",
        "office@solasmodu.net · SOLAS MODU MARINE SERVICES PVT. LTD. · MUMBAI, INDIA",
      ],
    },
  ],
};
