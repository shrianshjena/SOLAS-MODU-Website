"use client";

import { useId, useRef, useState, type DragEvent } from "react";
import { cn } from "@/lib/cn";

interface FileInputProps {
  label: string;
  name: string;
  /** mono micro helper line, e.g. the resume size note */
  note?: string;
  error?: string;
  required?: boolean;
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

const KB = 1024;

function formatBytes(bytes: number): string {
  if (bytes < KB) return `${bytes} B`;
  if (bytes < KB * KB) return `${Math.round(bytes / KB)} KB`;
  return `${(bytes / (KB * KB)).toFixed(1)} MB`;
}

/**
 * Dashed dropzone for the careers form. Controlled: the parent owns the File
 * and the error string (validation lives with the parent, single source of
 * truth). A real sr-only file input keeps it fully keyboard accessible; drag
 * and drop layers on top. Color-only CSS transitions, safe under reduced
 * motion.
 */
export function FileInput({ label, name, note, error, required, file, onFileSelect }: FileInputProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const noteId = `${id}-note`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const describedBy =
    [error ? errorId : null, note ? noteId : null].filter(Boolean).join(" ") || undefined;

  const acceptDrag = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    onFileSelect(e.dataTransfer.files?.[0] ?? null);
  };

  const clearFile = () => {
    // reset the native input so re-choosing the same file re-fires change
    if (inputRef.current) inputRef.current.value = "";
    onFileSelect(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-mono text-[0.5625rem] uppercase tracking-[0.22em] text-steel"
      >
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>

      <label
        htmlFor={id}
        onDragOver={acceptDrag}
        onDragEnter={acceptDrag}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "relative flex min-h-[7rem] cursor-pointer flex-col items-center justify-center gap-2",
          "border border-dashed px-6 py-6 text-center transition-colors duration-300",
          "focus-within:border-accent",
          error ? "border-flare" : "border-steel/28",
          isDragOver && "border-accent bg-accent/5",
        )}
      >
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="file"
          accept=".pdf,.doc,.docx"
          className="sr-only"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(e) => onFileSelect(e.target.files?.[0] ?? null)}
        />
        <span className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.25em] text-steel">
          <span aria-hidden className="h-[5px] w-[5px] shrink-0 rounded-full border border-accent" />
          Drag + drop or click to browse
        </span>
        {note && (
          <span
            id={noteId}
            className="font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-meta"
          >
            {note}
          </span>
        )}
      </label>

      {file && (
        <div className="flex items-center justify-between gap-4 border border-steel/16 bg-ink-2/60 px-4 py-2.5">
          <span className="min-w-0 truncate font-mono text-[0.625rem] uppercase tracking-[0.15em] text-steel">
            {file.name} · {formatBytes(file.size)}
          </span>
          <button
            type="button"
            aria-label="Remove selected file"
            onClick={clearFile}
            className="flex h-6 w-6 shrink-0 items-center justify-center font-mono text-sm leading-none text-meta transition-colors duration-300 hover:text-flare"
          >
            <span aria-hidden>×</span>
          </button>
        </div>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="font-mono text-[0.5625rem] uppercase tracking-[0.15em] text-flare"
        >
          {error}
        </p>
      )}
    </div>
  );
}
