"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { Rocket, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase = "idle" | "flying" | "done";

const BTN = 56; // px (h-14 / w-14)
const PAD = 24; // px — matches typical Container padding (px-6)

export function RocketToRevenue(props?: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const controls = useAnimationControls();

  const railRef = useRef<HTMLDivElement | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [travel, setTravel] = useState(0);

  const spring = useMemo(() => {
    return reduceMotion
      ? { duration: 0 }
      : { type: "spring", stiffness: 520, damping: 42, mass: 0.75 };
  }, [reduceMotion]);

  // Measure available travel distance inside the rail.
  const recompute = () => {
    const el = railRef.current;
    if (!el) return;

    const w = el.getBoundingClientRect().width;

    // Keep the button comfortably inside the rail on both sides.
    // left = PAD
    // right = w - PAD - BTN
    const nextTravel = Math.max(0, Math.floor(w - PAD * 2 - BTN));
    setTravel(nextTravel);
  };

  useEffect(() => {
    recompute();

    const el = railRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => recompute());
    ro.observe(el);

    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Drive motion from phase changes.
  useEffect(() => {
    if (phase === "idle") {
      controls.set({ x: 0 });
      return;
    }

    if (phase === "flying") {
      controls
        .start({ x: travel, transition: spring })
        .then(() => setPhase("done"))
        .catch(() => {
          // If interrupted/unmounted, just safely no-op.
        });
      return;
    }

    if (phase === "done") {
      // stays parked at the end
      controls.set({ x: travel });
    }
  }, [phase, travel, controls, spring]);

  const onClick = () => {
    if (phase === "idle") setPhase("flying");
    else if (phase === "done") setPhase("idle");
  };

  const isFlying = phase === "flying";
  const isDone = phase === "done";

  // Dotted line: between centers of start and end positions (center distance = travel)
  const lineLeft = PAD + BTN / 2;
  const lineWidth = Math.max(0, travel);

  return (
    <div className={cn("relative", props?.className)}>
      {/* The rail provides a safe measurement box and prevents accidental horizontal scroll */}
      <div ref={railRef} className="relative w-full overflow-hidden">
        {/* Give it vertical room, like your screenshot spacing */}
        <div className="relative h-[140px] sm:h-[160px]">
          {/* Dotted path (behind the button) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 -translate-y-1/2"
            style={{
              left: lineLeft,
              width: lineWidth,
              height: 10,
              // Dots
              backgroundImage:
                "radial-gradient(circle, hsl(var(--ui-glow) / 0.95) 1.6px, transparent 1.7px)",
              backgroundSize: "16px 10px",
              backgroundRepeat: "repeat-x",
              // Subtle fade on both ends (keeps your “gradient” look)
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
              opacity: 1,
            }}
          />

          {/* The moving tile */}
          <motion.button
            type="button"
            onClick={onClick}
            disabled={isFlying}
            className={cn(
              "absolute top-1/2 -translate-y-1/2",
              "h-14 w-14 rounded-2xl border bg-white",
              "shadow-sm transition-shadow",
              "ui-lift",
              isDone ? "ui-ambient-active" : "ui-ambient-hover",
              isFlying ? "cursor-default opacity-95" : "cursor-pointer"
            )}
            style={{ left: PAD }}
            animate={controls}
          >
            <span className="sr-only">
              {isDone ? "Reset rocket" : "Launch rocket"}
            </span>

            <div className="flex h-full w-full items-center justify-center">
              {isDone ? (
                <DollarSign className="h-5 w-5" style={{ color: "hsl(var(--ui-glow) / 1)" }} />
              ) : (
                <Rocket className="h-5 w-5 text-zinc-900" />
              )}
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
