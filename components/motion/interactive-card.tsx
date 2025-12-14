"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useMotionTemplate,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { useUiConfig } from "@/components/providers/ui-config";

function getConfig(level: "minimal" | "premium" | "signature") {
  if (level === "minimal") {
    return {
      maxTilt: 2.2,          // degrees
      hoverScale: 1.006,
      liftY: -1,
      glareOpacity: 0.08,
    };
  }
  if (level === "signature") {
    return {
      maxTilt: 6.0,
      hoverScale: 1.015,
      liftY: -3,
      glareOpacity: 0.18,
    };
  }
  return {
    maxTilt: 4.2,
    hoverScale: 1.01,
    liftY: -2,
    glareOpacity: 0.14,
  };
}

export function InteractiveCard({
  children,
  className,
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const reduce = useReducedMotion();
  const { motion: motionLevel } = useUiConfig();

  const [finePointer, setFinePointer] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setFinePointer(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  const isOff = !!disabled || !!reduce || !finePointer;

  const cfg = getConfig(motionLevel);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50); // glare x in %
  const gy = useMotionValue(35); // glare y in %

  const srx = useSpring(rx, { stiffness: 420, damping: 32, mass: 0.7 });
  const sry = useSpring(ry, { stiffness: 420, damping: 32, mass: 0.7 });
  const sgx = useSpring(gx, { stiffness: 260, damping: 28, mass: 0.6 });
  const sgy = useSpring(gy, { stiffness: 260, damping: 28, mass: 0.6 });

  const glareBg = useMotionTemplate`radial-gradient(600px circle at ${sgx}% ${sgy}%, rgba(255,255,255,${cfg.glareOpacity}), rgba(255,255,255,0) 55%)`;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isOff) return;
    if (e.pointerType && e.pointerType !== "mouse") return;

    const el = e.currentTarget;
    const r = el.getBoundingClientRect();

    const px = e.clientX - r.left;
    const py = e.clientY - r.top;

    const nx = (px / r.width) * 2 - 1; // -1..1
    const ny = (py / r.height) * 2 - 1;

    // Tilt: move left/right rotates Y, move up/down rotates X
    ry.set(nx * cfg.maxTilt);
    rx.set(-ny * cfg.maxTilt);

    // Glare follows pointer
    gx.set((px / r.width) * 100);
    gy.set((py / r.height) * 100);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    gx.set(50);
    gy.set(35);
  };

  if (isOff) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn("relative will-change-transform", className)}
      style={{
        transformStyle: "preserve-3d",
        rotateX: srx,
        rotateY: sry,
      }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      whileHover={{ y: cfg.liftY, scale: cfg.hoverScale }}
      whileTap={{ y: 0, scale: 0.985 }}
      transition={{ type: "spring", stiffness: 520, damping: 34, mass: 0.65 }}
    >
      {/* Glare overlay */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{ backgroundImage: glareBg }}
      />

      {/* Content (keeps corners matching the glare) */}
      <div className="relative">{children}</div>
    </motion.div>
  );
}
