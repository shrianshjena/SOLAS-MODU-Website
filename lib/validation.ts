import { z } from "zod";

/**
 * Validation at the system boundary. These schemas run in the browser before
 * anything is sent AND again server-side in app/api/submit/route.ts (this
 * module deliberately has no "use client" directive so both sides share one
 * source of truth). Strict objects reject unexpected fields.
 */

// 4 MB: Vercel functions reject request bodies over 4.5 MB at the platform
// level (413 before the handler runs), so the resume cap leaves headroom for
// the other fields and multipart framing. Was 5 MB under formsubmit.co.
export const MAX_RESUME_BYTES = 4 * 1024 * 1024;
export const RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const nameField = z.string().trim().min(2, "Please enter your name").max(100, "Too long");
const emailField = z
  .string()
  .trim()
  .min(3, "Please enter your email")
  .max(254, "Too long")
  .email("Please enter a valid email address");
const phoneField = z
  .string()
  .trim()
  .max(24, "Too long")
  .regex(/^[+()\-.\s\d]*$/, "Please enter a valid phone number")
  .optional()
  .or(z.literal(""));

export const contactSchema = z.strictObject({
  name: nameField,
  email: emailField,
  phone: phoneField,
  service: z.string().trim().max(60).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Please describe your requirement (at least 10 characters)")
    .max(2000, "Please keep the message under 2000 characters"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const careersSchema = z.strictObject({
  name: nameField,
  email: emailField,
  phone: phoneField,
  position: z.string().trim().min(1, "Please choose a discipline").max(60),
  message: z.string().trim().max(2000, "Please keep the message under 2000 characters"),
});

export type CareersInput = z.infer<typeof careersSchema>;

export function validateResume(file: File | null): string | null {
  if (!file) return "Please attach your resume";
  if (file.size > MAX_RESUME_BYTES) return "Please keep your resume under 4 MB";
  if (!RESUME_TYPES.includes(file.type)) return "Please upload a PDF or Word document";
  return null;
}

/** Flatten zod issues into a field -> message map for inline rendering. */
export function issuesToMap(error: z.ZodError): Record<string, string> {
  const map: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!map[key]) map[key] = issue.message;
  }
  return map;
}
