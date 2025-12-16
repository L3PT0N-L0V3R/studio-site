"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { DollarSign, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "home" | "toEnd" | "end" | "toHome";

const BTN = 56; // px (h-14 w-14)
const PAD = 24; // px (matches typical px-6 rhythm)

export function RocketToRevenue(props: { className?: string }) {
  const { className } = props;
  const reduceMotion = useReducedMotion();

  const railRef = useRef<HTMLDivElement | null>(null);
  const [travel, setTravel] = useState(0);
  const [phase, setPhase] = useState<Phase>("home");

  // Compute travel distance inside the rail (no vw / w-screen)
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;

    const recompute = () => {
      const w = el.clientWidth || 0;
      // Button starts at left PAD and must end before right PAD.
      const nextTravel = Math.max(0, Math.floor(w - PAD * 2 - BTN));
      setTravel(nextTravel);
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const spring = reduceMotion
    ? ({ duration: 0 } as const)
    : ({ type: "spring" as const, stiffness: 520, damping: 42, mass: 0.75 } as const);

  const isAnimating = phase === "toEnd" || phase === "toHome";
  const isEnd = phase === "end" || phase === "toHome";

  const x =
    phase === "home" ? 0 :
    phase === "toEnd" ? travel :
    phase === "end" ? travel :
    0; // toHome

  const onClick = () => {
    if (isAnimating || travel === 0) return;

    if (phase === "home") setPhase("toEnd");
    else if (phase === "end") setPhase("toHome");
  };

  // Dotted line geometry (between start & end centers)
  const lineLeft = PAD + BTN / 2;
  const lineWidth = Math.max(0, travel);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Overflow fix stays local to this component */}
      <div ref={railRef} className="relative w-full overflow-hidden">
        <div className="relative h-[120px] sm:h-[140px]">
          {/* Dotted line (behind button) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 -translate-y-1/2"
            style={{
              left: lineLeft,
              width: lineWidth,
              height: 10,
              backgroundImage:
                "radial-gradient(circle, hsl(var(--ui-glow) / 0.95) 1.6px, transparent 1.7px)",
              backgroundSize: "16px 10px",
              backgroundRepeat: "repeat-x",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
              opacity: 1,
            }}
          />

          {/* Moving tile */}
          <motion.button
            type="button"
            onClick={onClick}
            disabled={isAnimating || travel === 0}
            className={cn(
              "absolute top-1/2 -translate-y-1/2",
              "h-14 w-14 rounded-2xl border bg-white shadow-sm transition-shadow",
              "ui-lift",
              isAnimating ? "cursor-default opacity-95" : "cursor-pointer"
            )}
            style={{ left: PAD }}
            animate={{ x }}
            transition={spring}
            onAnimationComplete={() => {
              if (phase === "toEnd") setPhase("end");
              if (phase === "toHome") setPhase("home");
            }}
            aria-label={phase === "end" ? "Reset rocket" : "Launch rocket"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isEnd ? (
                <motion.span
                  key="dollar"
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                  exit={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
                  transition={spring}
                  className="grid h-full w-full place-items-center"
                >
                  <DollarSign className="h-5 w-5" style={{ color: "hsl(var(--ui-glow) / 1)" }} />
                </motion.span>
              ) : (
                <motion.span
                  key="rocket"
                  initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                  exit={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
                  transition={spring}
                  className="grid h-full w-full place-items-center"
                >
                  <Rocket className="h-5 w-5 text-zinc-900" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
