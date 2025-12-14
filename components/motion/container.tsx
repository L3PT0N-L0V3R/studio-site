"use client";

import { motion, useReducedMotion } from "framer-motion";

export function ScaleIn({
  children,
  delay = 0,
  from = 0.94,
}: {
  children: React.ReactNode;
  delay?: number;
  from?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? undefined : { opacity: 0, y: 14, scale: from, filter: "blur(6px)" }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1], // smooth "premium" easing
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
