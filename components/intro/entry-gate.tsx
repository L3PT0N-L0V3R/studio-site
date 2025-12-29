"use client";

import * as React from "react";
import {
  motion,
  type MotionValue,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

type EntryGateProps = {
  children: React.ReactNode;
  /** localStorage key for remembering the user */
  storageKey?: string;
  /** ms required to hold */
  holdMs?: number;
};

function clamp(n: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, n));
}

export function EntryGate({
  children,
  storageKey = "qube_entered_v1",
  holdMs = 950,
}: EntryGateProps) {
  const reduced = !!useReducedMotion();

  const [ready, setReady] = React.useState(false);
  const [shown, setShown] = React.useState(true);
  const [completed, setCompleted] = React.useState(false);

  const holdingRef = React.useRef(false);
  const startRef = React.useRef<number | null>(null);
  const rafRef = React.useRef<number | null>(null);

  // progress 0..1
  const p = useMotionValue(0);

  // 0 = not holding, 1 = holding (used to keep static logo crisp)
  const holdGate = useMotionValue(0);

  // --- transforms (declared at top-level; hook-safe) ---
  const bgGlow = useTransform(p, [0, 1], [0.10, 0.32]);
  const bgBlurPx = useTransform(p, [0, 1], [0, 22]);
  const bgBlurFilter = useTransform(bgBlurPx, (b) => `blur(${b}px)`);

  const logoScale = useTransform(p, [0, 0.65, 1], [1, 1.08, 1.12]);
  const logoRotate = useTransform(p, [0, 1], [0, 10]);

  React.useEffect(() => {
    // Force intro when ?intro=1 is present
    const force =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("intro") === "1";

    if (force) {
      setReady(true);
      setShown(true);
      setCompleted(false);
      try {
        localStorage.removeItem(storageKey);
      } catch {}
      return;
    }

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === "1") {
        setShown(false);
        setReady(true);
        return;
      }
    } catch {}

    setReady(true);
    setShown(true);
  }, [storageKey]);

  React.useEffect(() => {
    if (!shown) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [shown]);

  const stopRaf = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const endHold = () => {
    holdGate.set(0);

    holdingRef.current = false;
    startRef.current = null;
    stopRaf();

    if (completed) return;

    // ease back to rest if they let go early
    if (reduced) {
      p.set(0);
      return;
    }

    const t0 = performance.now();
    const from = p.get();
    const dur = 220;

    const tick = (t: number) => {
      const tt = clamp((t - t0) / dur, 0, 1);
      const eased = 1 - Math.pow(1 - tt, 3);
      p.set(from * (1 - eased));
      if (tt < 1 && !holdingRef.current && !completed) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        stopRaf();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const complete = () => {
    holdGate.set(0);

    setCompleted(true);
    holdingRef.current = false;
    startRef.current = null;
    stopRaf();

    try {
      localStorage.setItem(storageKey, "1");
    } catch {}

    // let the exit animation play
    window.setTimeout(() => {
      setShown(false);
    }, reduced ? 60 : 520);
  };

  const startHold = () => {
    if (!shown || completed) return;

    holdGate.set(1);

    holdingRef.current = true;
    startRef.current = performance.now();
    stopRaf();

    const tick = (t: number) => {
      if (!holdingRef.current || completed) return;

      const start = startRef.current ?? t;
      const prog = clamp((t - start) / holdMs, 0, 1);
      p.set(prog);

      if (prog >= 1) {
        p.set(1);
        complete();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    startHold();
  };

  const onPointerUp = () => endHold();
  const onPointerCancel = () => endHold();
  const onPointerLeave = () => endHold();

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.repeat) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      startHold();
    }
  };

  const onKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      endHold();
    }
  };

  if (!ready) return null;

  return (
    <>
      {children}

      {shown ? (
        <motion.div
          className={cn("fixed inset-0 z-[100] grid place-items-center bg-white")}
          initial={{ opacity: 1 }}
          animate={{ opacity: completed ? 0 : 1 }}
          transition={{ duration: reduced ? 0.12 : 0.55, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {/* Very soft page atmosphere */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(1200px 700px at 22% 18%, rgba(0,0,0,0.05) 0%, transparent 55%), radial-gradient(900px 520px at 78% 20%, rgba(0,0,0,0.035) 0%, transparent 56%)",
            }}
          />

          {/* Reacting glow (still minimal, but premium) */}
          <motion.div
            aria-hidden
            className="absolute inset-0"
            style={{
              filter: bgBlurFilter,
              opacity: bgGlow,
              background:
                "radial-gradient(900px 620px at 50% 42%, hsl(var(--ui-glow) / 0.34), transparent 62%)",
            }}
          />

          <div className="relative grid place-items-center gap-6 px-6">
            {/* Minimal text only */}
            <div className="text-center">
              <div className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                Hold to enter
              </div>
            </div>

            {/* Only the mark is interactive (no card/panel/UI) */}
            <motion.button
              type="button"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerCancel}
              onPointerLeave={onPointerLeave}
              onKeyDown={onKeyDown}
              onKeyUp={onKeyUp}
              className={cn(
                "grid place-items-center rounded-full",
                "h-[220px] w-[220px] sm:h-[260px] sm:w-[260px]",
                "bg-transparent",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-4 focus-visible:ring-offset-white",
                "select-none touch-none"
              )}
              aria-label="Hold to enter"
            >
              <MotionDotLogo
                energy={p}
                hold={holdGate}
                scale={logoScale}
                rotate={logoRotate}
                reduced={reduced}
              />

              {/* Hidden helper for screen readers (keeps UI visually minimal) */}
              <span className="sr-only">Press and hold to enter. Release to cancel.</span>
            </motion.button>
          </div>
        </motion.div>
      ) : null}
    </>
  );
}

/**
 * Premium minimal animated mark:
 * - Dots start black
 * - Progressively bloom into soft colors
 * - Fade near completion
 * - Static state stays crisp (no blur when not holding)
 */
function MotionDotLogo(props: {
  energy: MotionValue<number>;
  hold: MotionValue<number>;
  scale: MotionValue<number>;
  rotate: MotionValue<number>;
  reduced: boolean;
}) {
  const { energy, hold, scale, rotate, reduced } = props;

  const t = useMotionValue(0);

  React.useEffect(() => {
    if (reduced) return;
    let raf: number | null = null;
    let t0 = performance.now();

    const tick = (now: number) => {
      const dt = now - t0;
      t0 = now;
      t.set(t.get() + dt / 1000);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, [reduced, t]);

  // Thin progress ring (part of the mark; replaces the old UI bar)
  const ringOpacity = useTransform(energy, [0, 1], [0.18, 0.62]);
  const ringDash = useTransform(energy, (v) => `${clamp(v, 0, 1)} 1`);
  const ringFade = useTransform(energy, [0.9, 1], [1, 0]); // fades out at the end

  const haloOpacity = useTransform(energy, [0, 1], [0.12, 0.36]);
  const haloBlur = useTransform(energy, [0, 1], [0, 14]);
  const haloFilter = useTransform(haloBlur, (b) => (b <= 0.01 ? "none" : `blur(${b.toFixed(2)}px)`));

  const centers: Array<[number, number]> = [
    [30, 30],
    [50, 30],
    [70, 30],
    [30, 50],
    [50, 50],
    [70, 50],
    [30, 70],
    [50, 70],
    [70, 70],
  ];

  return (
    <motion.div className="relative grid place-items-center" style={{ scale, rotate }}>
      {/* Subtle circular glass halo behind the mark (not a “panel”) */}
      <motion.div
        aria-hidden
        className="absolute rounded-full"
        style={{
          width: 200,
          height: 200,
          filter: haloFilter,
          opacity: haloOpacity,
          background:
            "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.98), rgba(255,255,255,0.72))",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04)",
        }}
      />

      <motion.svg width="220" height="220" viewBox="0 0 100 100" className="relative">
        {/* Minimal progress ring */}
        <motion.circle
          cx="50"
          cy="50"
          r="43.5"
          fill="none"
          stroke="hsl(var(--ui-glow) / 0.70)"
          strokeWidth="1"
          pathLength={1}
          style={{
            opacity: ringOpacity,
            strokeDasharray: ringDash,
            strokeDashoffset: 0,
            transformOrigin: "50% 50%",
            transform: "rotate(-90deg)",
          }}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="43.5"
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="1"
          pathLength={1}
          style={{
            opacity: ringFade,
            strokeDasharray: "1 1",
            strokeDashoffset: 0,
            transformOrigin: "50% 50%",
            transform: "rotate(-90deg)",
          }}
        />

        {centers.map(([cx, cy], i) => (
          <Dot key={i} i={i} cx={cx} cy={cy} t={t} energy={energy} hold={hold} />
        ))}
      </motion.svg>
    </motion.div>
  );
}

function Dot(props: {
  i: number;
  cx: number;
  cy: number;
  t: MotionValue<number>;
  energy: MotionValue<number>;
  hold: MotionValue<number>;
}) {
  const { i, cx, cy, t, energy, hold } = props;

  // Soft premium palette (target colors). Dots start black and bloom into these.
  const palette = [
    "hsl(222 78% 58%)", // blue
    "hsl(238 74% 62%)", // indigo
    "hsl(258 72% 64%)", // violet
    "hsl(200 68% 56%)", // cyan-blue
    "hsl(186 60% 52%)", // teal
    "hsl(168 58% 48%)", // green-teal
    "hsl(210 72% 60%)", // sky
    "hsl(245 66% 64%)", // periwinkle
    "hsl(280 62% 64%)", // soft purple accent
  ];

  const a = (i * Math.PI) / 4.2;
  const b = (i * Math.PI) / 2.8;
  const c = (i * Math.PI) / 1.9;

  // movement intensity scales with hold progress
  const amp = useTransform(energy, [0, 1], [0, 16]);
  const amp2 = useTransform(energy, [0, 1], [0, 10]);

  const x = useTransform([t, amp, amp2] as MotionValue<number>[], (v: number[]) => {
    const tt = v[0] ?? 0;
    const a1 = v[1] ?? 0;
    const a2 = v[2] ?? 0;

    const orbit = Math.sin(tt * (2.6 + i * 0.07) + a) * a1;
    const jitter = Math.sin(tt * (7.4 + i * 0.12) + b) * a2;
    const drift = Math.cos(tt * (3.2 + i * 0.05) + c) * (a2 * 0.55);
    return orbit + jitter + drift;
  });

  const y = useTransform([t, amp, amp2] as MotionValue<number>[], (v: number[]) => {
    const tt = v[0] ?? 0;
    const a1 = v[1] ?? 0;
    const a2 = v[2] ?? 0;

    const orbit = Math.cos(tt * (2.3 + i * 0.06) + a) * a1;
    const jitter = Math.cos(tt * (6.9 + i * 0.11) + b) * a2;
    const drift = Math.sin(tt * (3.5 + i * 0.05) + c) * (a2 * 0.55);
    return orbit + jitter + drift;
  });

  // Crisp at rest; blur ramps only while holding (and as hold continues)
  const timeRamp = useTransform(t, (tt: number) => clamp((tt - 0.05) / 1.25, 0, 1));

  const dotBlur = useTransform([energy, timeRamp, hold] as MotionValue<number>[], (v: number[]) => {
    const e = v[0] ?? 0;
    const tr = v[1] ?? 0;
    const h = v[2] ?? 0;

    // Not holding or basically idle: force crisp.
    if (h < 0.5 || e < 0.02) return 0;

    const mix = 0.35 * e + 0.65 * tr;
    return mix * 1.25;
  });

  const dotFilter = useTransform(dotBlur, (bb: number) =>
    bb <= 0.01 ? "none" : `blur(${bb.toFixed(2)}px)`
  );

  // Color bloom: stagger each dot slightly so it feels “alive” and premium.
  const colorProg = useTransform(energy, (e: number) => {
    const delay = i * 0.04;
    return clamp((e - delay) / 0.72, 0, 1);
  });

  const fillColor = useTransform(colorProg, [0, 1], ["#0B0B0C", palette[i] ?? "hsl(222 78% 58%)"]);

  // Fade near completion (dots fade as the hold completes)
  const dotOpacity = useTransform(energy, [0, 0.82, 1], [1, 1, 0.1]);
  const strokeOpacity = useTransform(energy, [0, 1], [0.14, 0.08]);

  return (
    <motion.g style={{ x, y }}>
      <motion.circle
        cx={cx}
        cy={cy}
        r={6}
        style={{
          fill: fillColor,
          filter: dotFilter,
          opacity: dotOpacity,
        }}
      />
      <motion.circle
        cx={cx}
        cy={cy}
        r={6}
        fill="none"
        stroke="rgba(0,0,0,0.14)"
        strokeWidth="0.75"
        style={{ opacity: strokeOpacity }}
      />
    </motion.g>
  );
}
