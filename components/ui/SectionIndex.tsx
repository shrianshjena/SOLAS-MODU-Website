import { cn } from "@/lib/cn";

/** Section marker echoing the deck's drafting system: an optional index, a rule,
 *  and the label. Omit `index` for a clean, un-numbered section title. */
export function SectionIndex({
  index,
  label,
  variant = "onDark",
  className,
}: {
  index?: string;
  label: string;
  variant?: "onLight" | "onDark";
  className?: string;
}) {
  const numberCls = variant === "onLight" ? "text-accent" : "text-steel";
  const labelCls = variant === "onLight" ? "text-slate" : "text-meta";
  const ruleCls = variant === "onLight" ? "bg-navy/25" : "bg-[var(--hairline-strong)]";
  return (
    <div
      className={cn(
        "flex items-center gap-4 font-mono text-[0.7rem] uppercase tracking-[0.2em]",
        className,
      )}
    >
      {index ? <span className={numberCls}>{index}</span> : null}
      <span className={cn("h-px w-10", ruleCls)} />
      <span className={labelCls}>{label}</span>
    </div>
  );
}
