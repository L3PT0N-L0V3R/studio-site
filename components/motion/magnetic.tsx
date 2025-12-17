"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  strength?: number; // 0.1–0.5 typical (ratio), OR allow px-style values like 16
  hoverScale?: number; // optional, keeps per-instance control
  disabled?: boolean;
};

function strengthToPixels(strength?: number) {
  // Supports two calling styles:
  // - ratio style: 0.1–0.5 (typical)
  // - pixel style: 8–24 (common in “magnetic” demos)
  const s = strength ?? 0.18;

  // If it looks like a ratio, convert to pixels with a sane cap.
  if (s > 0 && s <= 1) return Math.max(0, Math.min(24, s * 48));

  // If it looks like pixels already, clamp it.
  return Math.max(0, Math.min(32, s));
}

export function Magnetic({
  children,
  className,
  strength = 0.18,
  hoverScale,
  disabled,
}: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  const max = strengthToPixels(strength);
  const scale = hoverScale ?? 1.008;

  // Motion values in “raw px”
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // Smooth it
  const sx = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 260, damping: 28, mass: 0.6 });

  // Clamp the springed value to a max range
  const x = useTransform(sx, (v) => Math.max(-max, Math.min(max, v)));
  const y = useTransform(sy, (v) => Math.max(-max, Math.min(max, v)));

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);

    // Normalize by size so large buttons don’t overreact
    const nx = dx / Math.max(1, r.width / 2);
    const ny = dy / Math.max(1, r.height / 2);

    mx.set(nx * max);
    my.set(ny * max);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  // IMPORTANT: keep "spring" as a literal type (prevents TS “string not assignable” issues)
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
      style={disabled ? undefined : { x, y }}
      className={cn("inline-block", className)}
      whileHover={disabled ? undefined : { scale }}
      transition={hoverTransition}
    >
      {children}
    </motion.div>
  );
}
