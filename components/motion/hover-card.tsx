"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUiConfig } from "@/components/providers/ui-config";

export function HoverCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const { motion: motionLevel } = useUiConfig();

  if (reduce) return <div className={className}>{children}</div>;

  const cfg =
    motionLevel === "minimal"
      ? { y: -1, scale: 1.005 }
      : motionLevel === "signature"
      ? { y: -3, scale: 1.015 }
      : { y: -2, scale: 1.01 };

  const tap =
    motionLevel === "minimal"
      ? { y: 0, scale: 0.992 }
      : motionLevel === "signature"
      ? { y: 0, scale: 0.982 }
      : { y: 0, scale: 0.985 };

  return (
    <motion.div
      className={cn("will-change-transform", className)}
      initial={false}
      whileHover={cfg}
      whileTap={tap}
      transition={{ type: "spring", stiffness: 520, damping: 34, mass: 0.6 }}
    >
      {children}
    </motion.div>
  );
}
