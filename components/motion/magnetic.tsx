"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  strength?: number; // 0.1–0.5 typical (ratio), OR allow px-style values like 16
  hoverScale?: number; // optional, keeps per-instance control
  disabled?: boolean;
};

function strengthToPixels(strength?: number) {
  const s = strength ?? 0.18;
  if (s > 0 && s <= 1) return Math.max(0, Math.min(24, s * 48));
  return Math.max(0, Math.min(32, s));
}

type MQLWithLegacy = MediaQueryList & {
  addListener?: (cb: (e: MediaQueryListEvent) => void) => void;
  removeListener?: (cb: (e: MediaQueryListEvent) => void) => void;
};

export function Magnetic({
  children,
  className,
  strength = 0.18,
  hoverScale,
  disabled,
}: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  // Disable magnetics on devices that don't really have hover (most mobile)
  const [coarse, setCoarse] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(hover: none), (pointer: coarse)") as MQLWithLegacy;

    const update = () => setCoarse(!!mq.matches);
    update();

    if (mq.addEventListener) mq.addEventListener("change", update);
    else mq.addListener?.(update);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", update);
      else mq.removeListener?.(update);
    };
  }, []);

  const isDisabled = !!disabled || !!reduceMotion || coarse;

  const max = strengthToPixels(strength);
  const scale = hoverScale ?? 1.008;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 260, damping: 28, mass: 0.6 });

  const x = useTransform(sx, (v) => Math.max(-max, Math.min(max, v)));
  const y = useTransform(sy, (v) => Math.max(-max, Math.min(max, v)));

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDisabled) return;
    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);

    const nx = dx / Math.max(1, r.width / 2);
    const ny = dy / Math.max(1, r.height / 2);

    mx.set(nx * max);
    my.set(ny * max);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const hoverTransition = {
    type: "spring" as const,
    stiffness: 520,
    damping: 40,
    mass: 0.7,
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={isDisabled ? undefined : { x, y }}
      className={cn("inline-block", className)}
      whileHover={isDisabled ? undefined : { scale }}
      transition={hoverTransition}
    >
      {children}
    </motion.div>
  );
}
