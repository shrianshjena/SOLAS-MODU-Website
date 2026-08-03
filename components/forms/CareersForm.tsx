"use client";

import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Field } from "./Field";
import { FileInput } from "./FileInput";
import { SweepButton } from "@/components/ui/SweepButton";
import { RiveIcon } from "@/components/rive/RiveIcon";
import { careersSchema, issuesToMap, validateResume } from "@/lib/validation";
import { MIN_FILL_MS, mailtoFallback, submitForm } from "@/lib/forms";
import { CUBIC, DUR } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { careersPage } from "@/content/pages/careers";

type Status = "idle" | "sending" | "sent" | "failed";

const CHECK_PATH = "M16.5 25.5l5 5L31.5 19";

/**
 * Careers application form: the ContactForm pattern (zod validation, honeypot
 * + minimum-fill-time bot checks, /api/submit transport, mailto fallback) plus
 * the resume dropzone. Motion owns the micro-state confirmations; the success
 * confirmation is a RiveIcon slot (/rive/success-buoy.riv) whose SVG fallback,
 * a buoy with a check, draws in with motion path tokens.
 */

/** Fallback twin for the success Rive slot: lifebuoy rings + accent check. */
function BuoyCheckSvg({ reduced }: { reduced: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 48 48" fill="none" className="h-full w-full">
      <g stroke="currentColor" strokeWidth="1.5" className="text-steel">
        {reduced ? (
          <circle cx="24" cy="24" r="20" strokeOpacity="0.9" />
        ) : (
          <motion.circle
            cx="24"
            cy="24"
            r="20"
            strokeOpacity="0.9"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: DUR.base, ease: CUBIC.expo }}
          />
        )}
        <circle cx="24" cy="24" r="13" strokeOpacity="0.5" />
        {/* quadrant spokes between the rings */}
        <path
          strokeOpacity="0.5"
          d="M33.19 14.81 38.14 9.86M33.19 33.19 38.14 38.14M14.81 33.19 9.86 38.14M14.81 14.81 9.86 9.86"
        />
      </g>
      <g
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-accent"
      >
        {reduced ? (
          <path d={CHECK_PATH} />
        ) : (
          <motion.path
            d={CHECK_PATH}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: DUR.fast, duration: DUR.fast, ease: CUBIC.expo }}
          />
        )}
      </g>
    </svg>
  );
}
export function CareersForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resume, setResume] = useState<File | null>(null);
  const mountedAt = useRef(Date.now());
  const reduced = useReducedMotion();
  const { form } = careersPage;

  const onResumeSelect = (file: File | null) => {
    setResume(file);
    // validate on select; a cleared file only surfaces its error on submit
    const resumeError = file ? validateResume(file) : null;
    setErrors((prev) => {
      const { resume: _cleared, ...rest } = prev;
      return resumeError ? { ...rest, resume: resumeError } : rest;
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const formEl = e.currentTarget;
    const fd = new FormData(formEl);

    const raw = {
      name: (fd.get("name") as string) ?? "",
      email: (fd.get("email") as string) ?? "",
      phone: (fd.get("phone") as string) ?? "",
      position: (fd.get("position") as string) ?? "",
      message: (fd.get("message") as string) ?? "",
    };
    const parsed = careersSchema.safeParse(raw);
    const resumeError = validateResume(resume);
    if (!parsed.success || resumeError) {
      setErrors({
        ...(parsed.success ? {} : issuesToMap(parsed.error)),
        ...(resumeError ? { resume: resumeError } : {}),
      });
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

    const result = await submitForm(
      "application",
      {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone ?? "",
        position: parsed.data.position,
        message: parsed.data.message,
      },
      resume ? { fieldName: "resume", file: resume } : null,
    );

    if (result.ok) {
      setStatus("sent");
      formEl.reset();
      setResume(null);
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
        <Field label="Discipline" name="position" required error={errors.position}>
          {(p) => (
            <select {...p} defaultValue="">
              <option value="" className="bg-ink-2">
                Select a discipline
              </option>
              {form.positions.map((position) => (
                <option key={position} value={position} className="bg-ink-2">
                  {position}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>

      <Field label="Message" name="message" error={errors.message}>
        {(p) => <textarea {...p} rows={5} className={`${p.className} resize-y`} />}
      </Field>

      <FileInput
        label="Resume"
        name="resume"
        required
        note={form.resumeNote}
        error={errors.resume}
        file={resume}
        onFileSelect={onResumeSelect}
      />

      <div className="flex flex-wrap items-center gap-5">
        <SweepButton type="submit" variant="primary" disabled={status === "sending"}>
          {status === "sending" ? "Transmitting..." : form.submitLabel}
        </SweepButton>

        <AnimatePresence mode="wait">
          {status === "sent" && (
            <motion.div
              key="sent"
              data-careers-success
              role="status"
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DUR.fast, ease: CUBIC.expo }}
              className="flex items-center gap-3"
            >
              <RiveIcon
                src="/rive/success-buoy.riv"
                size={48}
                className="shrink-0"
                fallback={<BuoyCheckSvg reduced={reduced} />}
              />
              <p className="max-w-md font-mono text-[0.625rem] uppercase tracking-[0.2em] text-steel">
                {form.success}
              </p>
            </motion.div>
          )}
          {status === "failed" && (
            <motion.p
              key="failed"
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DUR.fast, ease: CUBIC.expo }}
              role="alert"
              className="max-w-md font-mono text-[0.625rem] uppercase tracking-[0.2em] text-flare"
            >
              {form.error}{" "}
              <a href={mailtoFallback("application")} className="underline underline-offset-4">
                Email your application
              </a>{" "}
              instead.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
