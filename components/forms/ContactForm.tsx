"use client";

import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Field } from "./Field";
import { SweepButton } from "@/components/ui/SweepButton";
import { contactSchema, issuesToMap } from "@/lib/validation";
import { MIN_FILL_MS, mailtoFallback, submitForm } from "@/lib/forms";
import { home } from "@/content/pages/home";

type Status = "idle" | "sending" | "sent" | "failed";

/**
 * Home contact form. Zod-validated, honeypot + minimum-fill-time bot checks,
 * /api/submit transport (Resend relay) with a mailto fallback so no inquiry is ever lost.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const mountedAt = useRef(Date.now());
  const services = home.services.items.map((s) => s.title);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const fd = new FormData(form);

    const raw = {
      name: (fd.get("name") as string) ?? "",
      email: (fd.get("email") as string) ?? "",
      phone: (fd.get("phone") as string) ?? "",
      service: (fd.get("service") as string) ?? "",
      message: (fd.get("message") as string) ?? "",
    };
    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      setErrors(issuesToMap(parsed.error));
      return;
    }
    setErrors({});

    // bot checks after validation: an instant invalid submit still surfaces
    // field errors; only a valid-looking bot submit gets the fake success
    if ((fd.get("_honey") as string) || Date.now() - mountedAt.current < MIN_FILL_MS) {
      setStatus("sent"); // pretend success; nothing is sent
      return;
    }
    setStatus("sending");

    const result = await submitForm("inquiry", {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? "",
      service: parsed.data.service ?? "",
      message: parsed.data.message,
    });

    if (result.ok) {
      setStatus("sent");
      form.reset();
    } else {
      setStatus("failed");
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      {/* honeypot: visually hidden, tempting name */}
      <input
        type="text"
        name="_honey"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your Name" name="name" required error={errors.name}>
          {(p) => <input {...p} type="text" autoComplete="name" />}
        </Field>
        <Field label="Email" name="email" required error={errors.email}>
          {(p) => <input {...p} type="email" autoComplete="email" />}
        </Field>
        <Field label="Phone" name="phone" error={errors.phone}>
          {(p) => <input {...p} type="tel" autoComplete="tel" />}
        </Field>
        <Field label="Service" name="service" error={errors.service}>
          {(p) => (
            <select {...p} defaultValue="">
              <option value="" className="bg-ink-2">
                Select a service (optional)
              </option>
              {services.map((s) => (
                <option key={s} value={s} className="bg-ink-2">
                  {s}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>
      <Field label="Message" name="message" required error={errors.message}>
        {(p) => <textarea {...p} rows={5} className={`${p.className} resize-y`} />}
      </Field>

      <div className="flex flex-wrap items-center gap-5">
        <SweepButton type="submit" variant="primary" disabled={status === "sending"}>
          {status === "sending" ? "Transmitting..." : "Send Inquiry"}
        </SweepButton>

        <AnimatePresence mode="wait">
          {status === "sent" && (
            <motion.p
              key="sent"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="status"
              className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-steel"
            >
              Message received. We will get back to you shortly.
            </motion.p>
          )}
          {status === "failed" && (
            <motion.p
              key="failed"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="alert"
              className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-flare"
            >
              Transmission failed.{" "}
              <a href={mailtoFallback("inquiry")} className="underline underline-offset-4">
                Email us directly
              </a>{" "}
              instead.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
