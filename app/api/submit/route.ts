import {
  contactSchema,
  careersSchema,
  MAX_RESUME_BYTES,
  RESUME_TYPES,
  type ContactInput,
  type CareersInput,
} from "@/lib/validation";
import { site } from "@/content/site";

/**
 * Form submission transport: the site's single intentionally-dynamic route
 * (every page route stays statically prerendered; the root layout's
 * `dynamic = "error"` still guards that). Receives both forms from
 * lib/forms.ts and relays them through Resend.
 *
 * Spam layers, cheapest first: per-IP rate limit (in-memory, per warm
 * instance; Upstash Redis is the documented upgrade path if abuse ever
 * materializes) -> honeypot fake-success -> shared zod schemas re-run
 * server-side -> resume type/size checks. Resend ships no filtering of its
 * own, and its 100/day cap is the final backstop.
 *
 * The destination mailbox lives ONLY here, server-side: it must never appear
 * in rendered copy, client code, or metadata (client decision 2026-07-30).
 * Requires RESEND_API_KEY in the environment (Vercel project settings);
 * without it every submission returns 503 "unconfigured" and the forms
 * degrade to their mailto fallback. The sandbox sender below delivers only
 * to the mailbox the Resend account is registered with, so the account MUST
 * be registered with the destination address until solasmodu.net is DNS
 * verified in Resend (documented follow-up).
 */

// route-level overrides: a POST handler is inherently dynamic, and the root
// layout's `dynamic = "error"` would otherwise propagate down and fail the build
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const FROM = "SOLAS MODU Website <onboarding@resend.dev>";
/** submission destination only; never rendered anywhere (see doc above) */
const TO = "contactsolasmodu@gmail.com";

const SUBJECTS = {
  inquiry: `[${site.domain}] Website Inquiry`,
  application: `[${site.domain}] Career Application`,
} as const;

type Kind = keyof typeof SUBJECTS;

/** per-IP submission timestamps; pruned on read, per warm lambda instance */
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // keep the map bounded across a warm instance
  if (hits.size > 500) {
    for (const [key, stamps] of hits) {
      if (stamps.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

const reply = (status: number, ok: boolean, reason?: string, headers?: HeadersInit) =>
  Response.json(reason ? { ok, reason } : { ok }, { status, headers });

function fieldTable(kind: Kind, fields: ContactInput | CareersInput): string {
  const rows = Object.entries(fields)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k.toUpperCase()}: ${v}`);
  return [`${SUBJECTS[kind]}`, "", ...rows, "", "Submitted via solasmodu.net"].join("\n");
}

export async function POST(request: Request): Promise<Response> {
  // x-real-ip is set by Vercel's edge and not client-forgeable there; the
  // XFF first-hop fallback IS spoofable and only matters if the route is
  // ever fronted by a different proxy (re-verify the trust boundary then)
  const ip =
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  if (rateLimited(ip)) {
    return reply(429, false, "rate", { "Retry-After": String(RATE_WINDOW_MS / 1000) });
  }

  let fd: FormData;
  try {
    fd = await request.formData();
  } catch {
    return reply(400, false, "malformed");
  }

  // honeypot BEFORE the configuration check: bots that fill the hidden field
  // always get a fake success and never learn anything about the transport
  if (typeof fd.get("_honey") === "string" && (fd.get("_honey") as string).length > 0) {
    return reply(200, true);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[submit] RESEND_API_KEY missing; transport unconfigured");
    return reply(503, false, "unconfigured");
  }

  const kind = fd.get("kind");
  if (kind !== "inquiry" && kind !== "application") return reply(400, false, "validation");

  const text = (key: string) => {
    const v = fd.get(key);
    return typeof v === "string" ? v : "";
  };

  // the precise zod-inferred shapes, not an index signature: reading a
  // wrong-branch key is a compile error instead of a silently blank email
  let fields: ContactInput | CareersInput;
  let resume: File | null = null;

  if (kind === "inquiry") {
    const parsed = contactSchema.safeParse({
      name: text("name"),
      email: text("email"),
      phone: text("phone"),
      service: text("service"),
      message: text("message"),
    });
    if (!parsed.success) return reply(400, false, "validation");
    fields = parsed.data;
  } else {
    const parsed = careersSchema.safeParse({
      name: text("name"),
      email: text("email"),
      phone: text("phone"),
      position: text("position"),
      message: text("message"),
    });
    if (!parsed.success) return reply(400, false, "validation");
    fields = parsed.data;

    const file = fd.get("resume");
    if (!(file instanceof File) || file.size === 0) return reply(400, false, "validation");
    if (file.size > MAX_RESUME_BYTES || !RESUME_TYPES.includes(file.type)) {
      return reply(400, false, "validation");
    }
    resume = file;
  }

  const payload: Record<string, unknown> = {
    from: FROM,
    to: [TO],
    reply_to: fields.email,
    subject: SUBJECTS[kind],
    text: fieldTable(kind, fields),
  };
  if (resume) {
    payload.attachments = [
      {
        filename: resume.name,
        content: Buffer.from(await resume.arrayBuffer()).toString("base64"),
      },
    ];
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.status === 429) {
      console.error("[submit] resend rate/daily cap hit");
      return reply(503, false, "provider-limit");
    }
    if (!res.ok) {
      console.error(`[submit] resend ${res.status}: ${await res.text().catch(() => "")}`);
      return reply(502, false, "provider");
    }
    return reply(200, true);
  } catch (error) {
    console.error("[submit] resend fetch failed", error);
    return reply(502, false, "provider");
  }
}
