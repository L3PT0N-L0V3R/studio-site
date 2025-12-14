"use client";

import * as React from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUiConfig } from "@/components/providers/ui-config";

type Props = {
  children: React.ReactNode;
  className?: string;
  strength?: number; // 0.1–0.5 is typical
  disabled?: boolean;
};

export function Magnetic({
  children,
  className,
  strength = 0.25,
  disabled,
}: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  const reduceMotion = useReducedMotion();
  const { motion: motionLevel } = useUiConfig();

  const [canUseFinePointer, setCanUseFinePointer] = React.useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const sx = useSpring(x, { stiffness: 220, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 220, damping: 22, mass: 0.6 });

  React.useEffect(() => {
    // Only enable on devices that support hover + fine pointer (mouse/trackpad)
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanUseFinePointer(mql.matches);
    update();
    mql.addEventListener?.("change", update);
    return () => mql.removeEventListener?.("change", update);
  }, []);

  const isDisabled =
    !!disabled || !!reduceMotion || motionLevel === "minimal" || !canUseFinePointer;

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (isDisabled) return;

    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const px = e.clientX - (r.left + r.width / 2);
    const py = e.clientY - (r.top + r.height / 2);

    // Clamp to keep it subtle
    const maxX = r.width * 0.18;
    const maxY = r.height * 0.18;

    const nx = Math.max(-maxX, Math.min(maxX, px * strength));
    const ny = Math.max(-maxY, Math.min(maxY, py * strength));

    x.set(nx);
    y.set(ny);
  }

  function onPointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={isDisabled ? undefined : { x: sx, y: sy }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </motion.div>
  );
}
