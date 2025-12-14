"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function HoldToEnter({
  onComplete,
  holdMs = 900,
  className,
}: {
  onComplete: () => void;
  holdMs?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  // Reduced motion: no hold requirement.
  if (reduce) {
    return (
      <button
        onClick={onComplete}
        className={cn(
          "w-full rounded-2xl border bg-white px-5 py-4 text-sm font-medium shadow-sm",
          "active:scale-[0.99]",
          className
        )}
      >
        Enter
      </button>
    );
  }

  const stop = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    timerRef.current = null;
    rafRef.current = null;
    setProgress(0);
  };

  const start = () => {
    startRef.current = performance.now();
    timerRef.current = window.setTimeout(() => {
      stop();
      onComplete();
    }, holdMs);

    const tick = () => {
      const elapsed = performance.now() - startRef.current;
      setProgress(Math.min(1, elapsed / holdMs));
      rafRef.current = window.requestAnimationFrame(tick);
    };
    rafRef.current = window.requestAnimationFrame(tick);
  };

  useEffect(() => stop, []);

  return (
    <div className={cn("select-none", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-2xl border bg-white px-5 py-5 shadow-sm",
          "touch-manipulation"
        )}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          start();
        }}
        onPointerUp={stop}
        onPointerCancel={stop}
        role="button"
        tabIndex={0}
        aria-label="Press and hold to enter"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            start();
          }
        }}
        onKeyUp={(e) => {
          if (e.key === "Enter" || e.key === " ") stop();
        }}
      >
        {/* Logo mark placeholder */}
        <div className="text-lg font-semibold tracking-tight">Studio</div>

        {/* Progress ring */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: `conic-gradient(rgba(24,24,27,0.85) ${progress * 360}deg, rgba(24,24,27,0.08) 0deg)`,
            maskImage:
              "radial-gradient(transparent 62%, black 63%)",
            WebkitMaskImage:
              "radial-gradient(transparent 62%, black 63%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: progress > 0 ? 1 : 0 }}
          transition={{ duration: 0.12 }}
        />
      </div>

      <div className="mt-3 text-center text-xs text-zinc-600">
        Press & hold to enter
      </div>
    </div>
  );
}
