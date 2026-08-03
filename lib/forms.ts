"use client";

import { site } from "@/content/site";

/**
 * Form transport abstraction. Since round 5 (2026-08-03) submissions POST to
 * the site's own /api/submit route handler, which validates server-side and
 * relays through Resend to the confidential destination mailbox (the address
 * lives ONLY in app/api/submit/route.ts, server-side; it must never appear
 * in rendered copy, client code, mailto links, or metadata). Subjects and
 * the destination moved server-side with it. Components only know
 * submitForm(); the formsubmit.co transport this replaced needed no server
 * but leaked the address into the bundle and could not be spam-filtered.
 */

export type FormKind = "inquiry" | "application";

export interface FormResult {
  ok: boolean;
  /** human-readable failure hint (never shown raw to users) */
  reason?: string;
}

const ENDPOINT = "/api/submit";

/** minimum time a human plausibly needs to fill the form (bot heuristic) */
export const MIN_FILL_MS = 2000;

export async function submitForm(
  kind: FormKind,
  fields: Record<string, string>,
  file?: { fieldName: string; file: File } | null,
): Promise<FormResult> {
  const body = new FormData();
  body.append("kind", kind);
  for (const [key, value] of Object.entries(fields)) {
    if (value) body.append(key, value);
  }
  if (file) body.append(file.fieldName, file.file, file.file.name);

  try {
    const res = await fetch(ENDPOINT, { method: "POST", body });
    const data = (await res.json().catch(() => null)) as { ok?: boolean; reason?: string } | null;
    if (!res.ok || data?.ok !== true) {
      return { ok: false, reason: data?.reason ?? `http ${res.status}` };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : "network" };
  }
}

/** mailto fallback so a lead is never lost when the transport fails */
export function mailtoFallback(kind: FormKind): string {
  const subject = encodeURIComponent(
    kind === "inquiry" ? `[${site.domain}] Website Inquiry` : `[${site.domain}] Career Application`,
  );
  return `mailto:${site.contact.emails.office}?subject=${subject}`;
}
