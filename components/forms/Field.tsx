"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface FieldProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  children: (props: {
    id: string;
    name: string;
    "aria-invalid": boolean | undefined;
    "aria-describedby": string | undefined;
    className: string;
  }) => ReactNode;
}

/**
 * DESIGN_SYSTEM.md form field: underline-only input on the dark panel, mono
 * uppercase label, accent underline on focus, flare underline + mono message
 * on error (a sanctioned flare use).
 */
export function Field({ label, name, error, required, children }: FieldProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="group/field flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-mono text-[0.5625rem] uppercase tracking-[0.22em] text-steel"
      >
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      {children({
        id,
        name,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
        className: cn(
          "w-full border-0 border-b bg-transparent px-0 py-2.5 text-sm text-white",
          "placeholder:text-white/30 focus:outline-none focus:ring-0",
          "transition-colors duration-300",
          error
            ? "border-flare"
            : "border-steel/28 focus:border-accent",
        ),
      })}
      {error && (
        <p id={errorId} role="alert" className="font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-flare">
          {error}
        </p>
      )}
    </div>
  );
}
