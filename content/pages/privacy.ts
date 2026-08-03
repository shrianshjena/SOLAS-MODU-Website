import type { LegalPageContent } from "../types";

/**
 * /privacy copy. The final section renders in the dark closing band on the
 * page (its last paragraph is the mono contact telegram); all earlier
 * sections render on the light surface.
 */
export const privacyPage: LegalPageContent = {
  meta: {
    title: "Privacy Policy | SOLAS MODU Marine Services",
    description:
      "How SOLAS MODU Marine Services handles the information you share through this website: what we collect, how we use it, and how to reach us with questions.",
    path: "/privacy",
  },
  eyebrow: "LEG 01 / PRIVACY POLICY",
  heading: "Privacy Policy",
  lede: "Your privacy matters to us. This policy explains, in plain language, what information this website collects, how we use it, and the choices you have at every step.",
  effectiveDate: "EFFECTIVE 2026-07-21 · REV 1.0",
  sections: [
    {
      eyebrow: "LEG 02 / SCOPE",
      heading: "What This Policy Covers",
      paragraphs: [
        "This policy applies to solasmodu.net, the website of SOLAS MODU Marine Services Pvt. Ltd., Mumbai, India. It describes how we handle personal information submitted through this site. Information exchanged in the course of a commercial engagement is governed by the terms of that engagement.",
      ],
    },
    {
      eyebrow: "LEG 03 / COLLECTION",
      heading: "The Information We Collect",
      paragraphs: [
        "This website collects only the information you choose to submit through the contact form and the career application form: typically your name, email address, phone number, company, your message, and, for career applications, your resume. Submissions are delivered by our form transport provider directly to company mailboxes.",
        "We do not run advertising trackers, we do not set analytics cookies, and we do not sell or rent personal data to anyone. You can browse every page of this site without identifying yourself.",
      ],
    },
    {
      eyebrow: "LEG 04 / USE",
      heading: "How We Use It",
      paragraphs: [
        "Information from the contact form is used to respond to your enquiry and to prepare any quotation or service you have requested. Information from the career form is used to evaluate your application and to contact you about current or future roles.",
        "We share your information only where it is necessary to deliver something you have asked for, or where the law requires it.",
      ],
    },
    {
      eyebrow: "LEG 05 / RETENTION",
      heading: "Retention and Your Choices",
      paragraphs: [
        "We keep enquiry and application records only as long as they remain useful for the purposes above and for reasonable business record keeping. If you would like your information corrected or removed, email office@solasmodu.net and we will act on your request promptly.",
      ],
    },
    {
      eyebrow: "LEG 06 / THIRD PARTIES",
      heading: "Links to Other Websites",
      paragraphs: [
        "This site may link to external websites, such as classification societies, industry partners, or our LinkedIn page. Those sites operate under their own privacy policies, and we encourage you to review them. This policy applies only to solasmodu.net.",
      ],
    },
    {
      eyebrow: "LEG 07 / SECURITY",
      heading: "How We Protect It",
      paragraphs: [
        "We apply reasonable technical and organizational safeguards to the information you send us, including transport encryption on this website and controlled access to company mailboxes. Because no method of transmission over the internet can be guaranteed absolutely, we ask that you do not include sensitive information a form does not request.",
      ],
    },
    {
      eyebrow: "LEG 08 / CHANGES",
      heading: "Changes to This Policy",
      paragraphs: [
        "We may update this policy from time to time as the website or applicable law evolves. The effective date above always reflects the current revision, and any material change will be published on this page.",
      ],
    },
    {
      eyebrow: "LEG 09 / CONTACT",
      heading: "Questions About This Policy",
      paragraphs: [
        "We are glad to answer any question about how your information is handled. Write to us and a member of our team will respond.",
        "office@solasmodu.net · SOLAS MODU MARINE SERVICES PVT. LTD. · MUMBAI, INDIA",
      ],
    },
  ],
};
