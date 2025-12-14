"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HoldToEnter } from "@/components/intro/hold-to-enter";
import { useSitePreferences, type FocusMode } from "@/components/providers/site-preferences";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

type Stage = "locked" | "calibrate";

const focusOptions: { key: Exclude<FocusMode, null>; title: string; desc: string }[] = [
  { key: "design", title: "Design", desc: "Typography, layout, and visual polish." },
  { key: "performance", title: "Performance", desc: "Speed, SEO, and core web vitals." },
  { key: "motion", title: "Motion", desc: "Scroll narratives and micro-interactions." },
  { key: "conversion", title: "Conversion", desc: "Offer clarity and funnel mechanics." },
];

export function IntroGate() {
  const { introDismissed, setIntroDismissed, setFocus } = useSitePreferences();
  const reduce = useReducedMotion();
  const [stage, setStage] = useState<Stage>("locked");

  const shouldShow = useMemo(() => !introDismissed, [introDismissed]);
  if (!shouldShow) return null;

  const skip = () => setIntroDismissed(true);

  const completeCalibration = (mode: Exclude<FocusMode, null>) => {
    setFocus(mode);
    setIntroDismissed(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute right-4 top-4">
          <Button variant="outline" size="sm" onClick={skip}>
            Skip
          </Button>
        </div>

        <div className="flex h-full items-center justify-center px-4">
          <div className="w-full max-w-md">
            <AnimatePresence mode="wait">
              {stage === "locked" ? (
                <motion.div
                  key="locked"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <div className="mb-6 text-center">
                    <div className="text-sm font-medium text-zinc-600">Welcome</div>
                    <div className="mt-2 text-2xl font-semibold tracking-tight">
                      A premium web experience, tuned to you.
                    </div>
                    <div className="mt-2 text-sm text-zinc-600">
                      One quick interaction to set the tone.
                    </div>
                  </div>

                  <HoldToEnter
                    onComplete={() => setStage("calibrate")}
                    className="mx-auto"
                  />

                  {reduce ? (
                    <div className="mt-6 text-center text-xs text-zinc-600">
                      Reduced motion enabled — simplified entry.
                    </div>
                  ) : null}
                </motion.div>
              ) : (
                <motion.div
                  key="calibrate"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <div className="mb-6 text-center">
                    <div className="text-sm font-medium text-zinc-600">Calibration</div>
                    <div className="mt-2 text-2xl font-semibold tracking-tight">
                      What matters most right now?
                    </div>
                    <div className="mt-2 text-sm text-zinc-600">
                      We’ll highlight the work that matches your focus.
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {focusOptions.map((o) => (
                      <button
                        key={o.key}
                        onClick={() => completeCalibration(o.key)}
                        className={cn(
                          "rounded-2xl border bg-white p-4 text-left shadow-sm",
                          "transition active:scale-[0.99]"
                        )}
                      >
                        <div className="text-sm font-semibold">{o.title}</div>
                        <div className="mt-1 text-xs text-zinc-600">{o.desc}</div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 flex justify-center">
                    <Button variant="ghost" onClick={() => setStage("locked")}>
                      Back
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
