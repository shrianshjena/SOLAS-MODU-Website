"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface LazyMountProps {
  children: ReactNode;
  /** rendered until the real content mounts (and forever under fallback conditions) */
  placeholder?: ReactNode;
  /** IntersectionObserver rootMargin: mount this far before entering the viewport */
  rootMargin?: string;
  /** keep mounted once it has been visible (default) or unmount when far offscreen */
  keepMounted?: boolean;
  className?: string;
}

/**
 * Defers expensive children (WebGL, Spline, Rive) until the slot approaches
 * the viewport. Pair with next/dynamic({ ssr: false }) imports so heavy
 * runtimes stay out of the shared bundle entirely.
 */
export function LazyMount({
  children,
  placeholder = null,
  rootMargin = "200px",
  keepMounted = true,
  className,
}: LazyMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const everVisible = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          everVisible.current = true;
          setVisible(true);
          if (keepMounted) io.disconnect();
        } else if (!keepMounted && everVisible.current) {
          setVisible(false);
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, keepMounted]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {visible ? children : placeholder}
    </div>
  );
}
