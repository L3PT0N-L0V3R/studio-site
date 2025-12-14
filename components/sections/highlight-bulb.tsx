"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  subtitle?: string;
};

export function HighlightBulb({
  title = "Premium polish preview",
  subtitle = "Tap the bulb to toggle an ambient motion layer (subtle).",
}: Props) {
  const [on, setOn] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm">
      {/* Ambient layer */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={false}
        animate={{
          opacity: on ? 1 : 0,
        }}
        transition={{ duration: 0.22 }}
      >
        {/* moving glow blob */}
        <motion.div
          className="absolute -inset-16"
          style={{
            background:
              "radial-gradient(closest-side, rgba(250,204,21,0.28), rgba(250,204,21,0.10), rgba(255,255,255,0) 70%)",
            filter: "blur(26px)",
          }}
          animate={{
            x: on ? [0, 18, -10, 0] : 0,
            y: on ? [0, -10, 14, 0] : 0,
            scale: on ? [1, 1.05, 1.02, 1] : 1,
          }}
          transition={{
            duration: 9,
            repeat: on ? Infinity : 0,
            ease: "easeInOut",
          }}
        />

        {/* faint top sheen */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "linear-gradient(180deg, rgba(250,204,21,0.10) 0%, rgba(255,255,255,0) 55%)",
          }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-zinc-900">{title}</div>
            <div className="mt-1 text-sm text-zinc-600">{subtitle}</div>
          </div>

          <motion.button
            type="button"
            onClick={() => setOn((v) => !v)}
            aria-pressed={on}
            aria-label={on ? "Turn ambient preview off" : "Turn ambient preview on"}
            className={cn(
              "relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border bg-white",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2"
            )}
            whileTap={{ scale: 0.96 }}
            animate={{ y: on ? -1 : 0, scale: on ? 1.03 : 1 }}
            transition={{ type: "spring", stiffness: 520, damping: 32 }}
          >
            {/* halo ring */}
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-2xl"
              initial={false}
              animate={{
                opacity: on ? 1 : 0,
                boxShadow: on
                  ? "0 0 0 1px rgba(0,0,0,0.06), 0 10px 30px rgba(0,0,0,0.10), 0 0 26px rgba(250,204,21,0.55)"
                  : "0 0 0 0 rgba(0,0,0,0)",
              }}
              transition={{ duration: 0.2 }}
            />

            <motion.div
              initial={false}
              animate={{ rotate: on ? 0 : -6 }}
              transition={{ type: "spring", stiffness: 420, damping: 26 }}
            >
              <Lightbulb
                className={cn(
                  "h-5 w-5 transition-colors",
                  on ? "text-amber-500" : "text-zinc-900"
                )}
              />
            </motion.div>
          </motion.button>
        </div>

        {/* Micro copy */}
        <motion.div
          initial={false}
          animate={{ opacity: on ? 1 : 0.65 }}
          transition={{ duration: 0.2 }}
          className="mt-5 text-xs text-zinc-600"
        >
          {on ? "Ambient layer: ON (example of controlled motion)." : "Ambient layer: OFF."}
        </motion.div>
      </div>
    </div>
  );
}
