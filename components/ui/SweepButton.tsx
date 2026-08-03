"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { TransitionLink } from "@/components/providers/TransitionProvider";
import { cn } from "@/lib/cn";

interface SweepButtonProps {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

/**
 * DESIGN_SYSTEM.md primary/secondary button: rectangular, zero radius, mono
 * uppercase label, accent fill sweeping in from the left on hover, and a
 * sonar-ping ripple on press. Renders a TransitionLink for any href (the
 * TransitionProvider owns hash scrolling and curtain routing) or a button.
 */
export function SweepButton({
  href,
  onClick,
  type = "button",
  variant = "primary",
  children,
  className,
  disabled,
}: SweepButtonProps) {
  const rippleHost = useRef<HTMLSpanElement>(null);

  const ping = (e: MouseEvent) => {
    const host = rippleHost.current;
    if (!host) return;
    const rect = host.getBoundingClientRect();
    const dot = document.createElement("span");
    dot.className =
      "pointer-events-none absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60";
    dot.style.left = `${e.clientX - rect.left}px`;
    dot.style.top = `${e.clientY - rect.top}px`;
    dot.style.animation = "ping-ring 0.6s ease-out forwards";
    host.appendChild(dot);
    setTimeout(() => dot.remove(), 650);
  };

  const classes = cn(
    "group relative inline-flex items-center justify-center overflow-hidden px-6 py-3.5",
    "font-mono text-[0.6875rem] font-medium uppercase tracking-[0.2em] transition-colors duration-300",
    variant === "primary"
      ? "border border-accent text-white"
      : "border border-steel/28 text-steel hover:border-accent hover:text-white",
    disabled && "pointer-events-none opacity-50",
    className,
  );

  const inner = (
    <>
      {variant === "primary" && (
        <span
          aria-hidden
          className="absolute inset-0 -z-0 origin-left scale-x-0 bg-accent transition-transform duration-[450ms] ease-io group-hover:scale-x-100"
        />
      )}
      <span ref={rippleHost} aria-hidden className="absolute inset-0 overflow-hidden" />
      <span className="relative z-10">{children}</span>
    </>
  );

  if (href) {
    return (
      <TransitionLink
        href={href}
        onClick={(e) => {
          ping(e);
          onClick?.();
        }}
        className={classes}
      >
        {inner}
      </TransitionLink>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={(e) => {
        ping(e);
        onClick?.();
      }}
      className={classes}
    >
      {inner}
    </button>
  );
}
