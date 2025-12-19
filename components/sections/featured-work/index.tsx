"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/motion/fade-in";
import { RocketToRevenue } from "./rocket-to-revenue";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}
function smoothstep(t: number) {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * Ultra-smooth scroll progress (mobile-friendly):
 * - raw scroll progress
 * - low-pass smoothing via RAF
 */
function useSmoothScrollFill<T extends HTMLElement>(opts?: {
  startY?: number;
  endY?: number;
  smoothing?: number; // 0..1 (higher = smoother / more lag)
}) {
  const { startY = 0.92, endY = 0.18, smoothing = 0.16 } = opts ?? {};
  const ref = useRef<T | null>(null);

  const [progress, setProgress] = useState(0);
  const rawRef = useRef(0);
  const smoothRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const computeRaw = () => {
      if (!ref.current) return 0;
      const r = ref.current.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const y = r.top / vh;
      const val = (startY - y) / (startY - endY);
      return clamp(val, 0, 1);
    };

    const tick = () => {
      const raw = rawRef.current;
      smoothRef.current = lerp(smoothRef.current, raw, 1 - smoothing);
      setProgress(smoothRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    const onScrollOrResize = () => {
      rawRef.current = computeRaw();
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(tick);
    };

    rawRef.current = computeRaw();
    smoothRef.current = rawRef.current;
    setProgress(smoothRef.current);

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [startY, endY, smoothing]);

  return { ref, progress };
}

/* -------------------------------------------------------------------------- */
/* Tap burst (overlay only; does not affect bars)                              */
/* -------------------------------------------------------------------------- */

function TapBurst(props: { k: number; xPct: number; yPct: number; reduceMotion: boolean }) {
  const { k, xPct, yPct, reduceMotion } = props;
  if (reduceMotion) return null;

  const blobs = [
    { dx: -34, dy: -18, s: 1.0, r: 12 },
    { dx: 18, dy: -28, s: 0.9, r: 10 },
    { dx: 36, dy: 10, s: 0.85, r: 11 },
    { dx: -16, dy: 28, s: 0.82, r: 10 },
    { dx: 0, dy: -38, s: 0.75, r: 9 },
    { dx: 22, dy: 26, s: 0.72, r: 8 },
  ];

  return (
    <div key={k} aria-hidden className="pointer-events-none absolute inset-0">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ opacity: 0, scale: 0.6, x: 0, y: 0 }}
          animate={{
            opacity: [0, 0.26, 0],
            scale: [0.6, 1.12 * b.s, 0.95],
            x: b.dx,
            y: b.dy,
          }}
          transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
          style={{
            left: `${xPct}%`,
            top: `${yPct}%`,
            width: b.r,
            height: b.r,
            borderRadius: 999,
            transform: "translate(-50%, -50%)",
            background: "hsl(var(--ui-glow) / 0.34)",
            boxShadow: "0 18px 38px rgba(0,0,0,0.10)",
            filter: "blur(0.2px)",
          }}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Full-width meter with click/tap feedback                                    */
/* -------------------------------------------------------------------------- */

function FullWidthMeter() {
  const reduceMotion = useReducedMotion();
  const { ref, progress } = useSmoothScrollFill<HTMLDivElement>({
    startY: 0.92,
    endY: 0.18,
    smoothing: 0.16,
  });

  const t = smoothstep(progress);

  const rows = useMemo(() => {
    return [
      clamp(Math.round(Math.pow(t, 0.92) * 100), 0, 100),
      clamp(Math.round(Math.pow(t, 1.05) * 100), 0, 100),
      clamp(Math.round(Math.pow(t, 1.22) * 100), 0, 100),
    ];
  }, [t]);

  // interaction FX
  const shellRef = useRef<HTMLDivElement | null>(null);
  const skinControls = useAnimationControls();
  const sheenControls = useAnimationControls();

  const [spot, setSpot] = useState({ x: 22, y: 30 });
  const [burstKey, setBurstKey] = useState(0);
  const [burstAt, setBurstAt] = useState({ x: 50, y: 50 });

  const setSpotFromClient = (clientX: number, clientY: number) => {
    const el = shellRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = clamp((clientX - r.left) / r.width, 0, 1);
    const ny = clamp((clientY - r.top) / r.height, 0, 1);
    const next = { x: nx * 100, y: ny * 100 };
    setSpot(next);
    setBurstAt(next);
  };

  const playTapFx = () => {
    if (reduceMotion) return;

    // pop the SKIN only (bars are in content layer)
    skinControls.start({
      scale: [1, 1.02, 1],
      transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
    });

    // sheen sweep
    sheenControls.set({ x: "-60%", opacity: 0 });
    sheenControls.start({
      x: "140%",
      opacity: [0, 0.18, 0],
      transition: { duration: 0.50, ease: [0.22, 1, 0.36, 1] },
    });

    // micro particle burst
    setBurstKey((k) => k + 1);
  };

  return (
    <div ref={ref}>
      <div
        ref={shellRef}
        className="relative rounded-2xl p-[1px]"
        role="button"
        tabIndex={0}
        aria-label="Interactive conversion meter"
        onMouseMove={(e) => setSpotFromClient(e.clientX, e.clientY)}
        onMouseDown={(e) => {
          setSpotFromClient(e.clientX, e.clientY);
          playTapFx();
        }}
        onTouchStart={(e) => {
          const t = e.touches[0];
          if (t) setSpotFromClient(t.clientX, t.clientY);
          playTapFx();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") playTapFx();
        }}
        style={{
          background: "linear-gradient(180deg, hsl(var(--ui-glow) / 0.55), rgba(0,0,0,0.06))",
          boxShadow: "0 26px 90px rgba(0,0,0,0.10)",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <div className="relative overflow-hidden rounded-2xl border" style={{ borderColor: "hsl(var(--ui-glow) / 0.22)" }}>
          {/* SKIN (reacts to taps/clicks) */}
          <motion.div animate={skinControls} className="absolute inset-0" style={{ transformOrigin: "50% 50%" }}>
            <div
              className="absolute inset-0"
              style={{
                background:
                  `radial-gradient(1100px circle at ${spot.x}% ${spot.y}%, hsl(var(--ui-glow) / 0.30), transparent 56%),` +
                  `radial-gradient(900px circle at 88% 12%, hsl(var(--ui-glow) / 0.14), transparent 56%),` +
                  `linear-gradient(180deg, rgba(255,255,255,0.94), rgba(255,255,255,0.72))`,
              }}
            />

            {/* film */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.55), rgba(255,255,255,0) 45%)",
                opacity: 0.75,
              }}
            />

            {/* sheen sweep */}
            {!reduceMotion ? (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                animate={sheenControls}
                style={{
                  width: "52%",
                  height: "140%",
                  top: "-20%",
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))",
                  transform: "skewX(-18deg)",
                  filter: "blur(1px)",
                  mixBlendMode: "soft-light",
                }}
              />
            ) : null}

            {/* tap burst */}
            <TapBurst k={burstKey} xPct={burstAt.x} yPct={burstAt.y} reduceMotion={!!reduceMotion} />
          </motion.div>

          {/* CONTENT (stable; meters do not scale/bounce) */}
          <div
            className="relative p-5 sm:p-6"
            style={{
              // keep a tiny inset shadow so it still reads like “glass”
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
            }}
          >
            <div className="space-y-4">
              {rows.map((v, i) => (
                <div
                  key={i}
                  className="relative h-3 sm:h-3.5 rounded-full"
                  style={{
                    background: "rgba(0,0,0,0.08)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
                  }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    initial={false}
                    animate={{ width: `${v}%` }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : {
                            duration: 0.12,
                            ease: [0.22, 1, 0.36, 1],
                          }
                    }
                    style={{
                      background:
                        "linear-gradient(90deg, hsl(var(--ui-glow) / 0.98), hsl(var(--ui-glow) / 0.45))",
                      boxShadow: "0 14px 34px rgba(0,0,0,0.08)",
                    }}
                  />

                  {/* specular highlight riding the fill (visual only) */}
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute top-0 h-full w-10 rounded-full"
                    initial={false}
                    animate={{ left: `calc(${v}% - 20px)` }}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))",
                      opacity: 0.55,
                      mixBlendMode: "soft-light",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Section                                                                     */
/* -------------------------------------------------------------------------- */

export function FeaturedWork() {
  return (
    <section id="work" className="border-b">
      <Container className="py-14 sm:py-20">
        <div className="mb-10">
          <RocketToRevenue />
        </div>

        <FadeIn>
          <h2 className="text-2xl font-semibold tracking-tight">Clicks → Conversion</h2>
        </FadeIn>

        <div className="mt-8">
          <FullWidthMeter />
        </div>
      </Container>
    </section>
  );
}
