"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/motion/fade-in";
import { ScaleIn } from "@/components/motion/scale-in";
import { InteractiveCard } from "@/components/motion/interactive-card";
import { RocketToRevenue } from "./rocket-to-revenue";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";

type DemoKind = "funnel" | "trend" | "pie";
type DemoCard = { id: string; kind: DemoKind };

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Scroll: 0 near bottom, 1 before top */
function useScrollFillProgress<T extends HTMLElement>(opts?: { startY?: number; endY?: number }) {
  const { startY = 0.92, endY = 0.18 } = opts ?? {};
  const ref = useRef<T | null>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const y = r.top / vh;
      const val = (startY - y) / (startY - endY);
      setP(clamp(val, 0, 1));
    };

    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [startY, endY]);

  return { ref, progress: p };
}

/* -------------------------------------------------------------------------- */
/* Physics card wrapper: parallax + pointer glow + tap bump + sheen sweep      */
/* -------------------------------------------------------------------------- */

function PhysicsCard(props: { children: React.ReactNode; onTapPulse?: () => void; className?: string }) {
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const bumpControls = useAnimationControls();
  const sheenControls = useAnimationControls();

  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [spot, setSpot] = useState({ x: 50, y: 35 });
  const [active, setActive] = useState(false);

  const playTapFx = () => {
    props.onTapPulse?.();
    if (reduceMotion) return;

    // pop / snap
    bumpControls.start({
      scale: [1, 1.035, 1],
      transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
    });

    // sheen sweep (overlay, not the graph)
    sheenControls.set({ x: "-60%", opacity: 0 });
    sheenControls.start({
      x: "140%",
      opacity: [0, 0.18, 0],
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    });
  };

  const onMove = (clientX: number, clientY: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = clamp((clientX - r.left) / r.width, 0, 1);
    const ny = clamp((clientY - r.top) / r.height, 0, 1);

    setSpot({ x: nx * 100, y: ny * 100 });

    if (reduceMotion) return;
    const ry = (nx - 0.5) * 7;
    const rx = -(ny - 0.5) * 6;
    setTilt({ rx, ry });
  };

  return (
    <div
      ref={wrapRef}
      className={props.className}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => {
        setActive(false);
        setTilt({ rx: 0, ry: 0 });
        setSpot({ x: 50, y: 35 });
      }}
      onMouseMove={(e) => onMove(e.clientX, e.clientY)}
      onTouchStart={(e) => {
        setActive(true);
        const t = e.touches[0];
        if (t) onMove(t.clientX, t.clientY);
        playTapFx();
      }}
      onTouchMove={(e) => {
        const t = e.touches[0];
        if (t) onMove(t.clientX, t.clientY);
      }}
      onTouchEnd={() => {
        setActive(false);
        setTilt({ rx: 0, ry: 0 });
      }}
      onClick={() => playTapFx()}
      role="button"
      tabIndex={0}
      aria-label="Interactive metric card"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") playTapFx();
      }}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <motion.div
        className="relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={reduceMotion ? { rotateX: 0, rotateY: 0 } : { rotateX: tilt.rx, rotateY: tilt.ry }}
        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 26 }}
      >
        {/* outer shell */}
        <div
          className="relative rounded-2xl p-[1px]"
          style={{
            background: "linear-gradient(180deg, hsl(var(--ui-glow) / 0.55), rgba(0,0,0,0.06))",
            boxShadow: active ? "0 34px 110px rgba(0,0,0,0.12)" : "0 26px 90px rgba(0,0,0,0.10)",
          }}
        >
          {/* bump is on the inner panel wrapper so it feels like a bubble */}
          <motion.div animate={bumpControls} className="relative">
            <div
              className="relative overflow-hidden rounded-2xl p-4"
              style={{
                background:
                  `radial-gradient(900px circle at ${spot.x}% ${spot.y}%, hsl(var(--ui-glow) / 0.34), transparent 52%),
                   radial-gradient(700px circle at 85% 10%, hsl(var(--ui-glow) / 0.18), transparent 56%),
                   linear-gradient(180deg, rgba(255,255,255,0.94), rgba(255,255,255,0.70))`,
                border: "1px solid hsl(var(--ui-glow) / 0.22)",
              }}
            >
              {/* sheen film */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.55), rgba(255,255,255,0) 45%)",
                  opacity: 0.75,
                }}
              />

              {/* tap sheen sweep (does not alter graph) */}
              {!reduceMotion ? (
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  animate={sheenControls}
                  style={{
                    width: "55%",
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

              {/* ambient energy haze */}
              {!reduceMotion ? (
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-10 rounded-[32px]"
                  style={{
                    background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, hsl(var(--ui-glow) / 0.22), transparent 60%)`,
                    opacity: active ? 0.85 : 0.65,
                  }}
                />
              ) : null}

              <div className="relative">{props.children}</div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Visuals                                                                     */
/* -------------------------------------------------------------------------- */

function FunnelViz(props: { t: number; reduceMotion: boolean }) {
  const { t, reduceMotion } = props;
  const rows = [
    clamp(Math.round(Math.pow(t, 0.95) * 100), 0, 100),
    clamp(Math.round(Math.pow(t, 1.08) * 100), 0, 100),
    clamp(Math.round(Math.pow(t, 1.22) * 100), 0, 100),
  ];

  return (
    <div className="space-y-3">
      {rows.map((v, i) => (
        <div key={i} className="relative h-2 rounded-full" style={{ background: "rgba(0,0,0,0.08)" }}>
          <motion.div
            className="h-2 rounded-full"
            initial={false}
            animate={{ width: `${v}%` }}
            transition={
              reduceMotion ? { duration: 0 } : { duration: 0.18, ease: [0.22, 1, 0.36, 1], delay: i * 0.02 }
            }
            style={{
              background: "linear-gradient(90deg, hsl(var(--ui-glow) / 0.98), hsl(var(--ui-glow) / 0.45))",
              boxShadow: "0 10px 22px rgba(0,0,0,0.08)",
            }}
          />
        </div>
      ))}
    </div>
  );
}

function TrendViz(props: { t: number; reduceMotion: boolean }) {
  const { t, reduceMotion } = props;

  const baseLine = [38, 41, 40, 43, 45, 47, 46, 49];
  const targetLine = [50, 54, 53, 58, 62, 66, 65, 70];
  const line = baseLine.map((v, i) => Math.round(lerp(v, targetLine[i], t)));

  const w = 300;
  const h = 70;
  const pad = 8;

  const max = Math.max(...line, 1);
  const min = Math.min(...line, 0);
  const toY = (v: number) => {
    const tt = (v - min) / Math.max(1, max - min);
    return pad + (1 - tt) * (h - pad * 2);
  };
  const step = (w - pad * 2) / (line.length - 1);
  const pts = line.map((v, i) => ({ x: pad + i * step, y: toY(v) }));
  const poly = pts.map((p) => `${p.x},${p.y}`).join(" ");

  const total = 520;

  return (
    <div
      className="rounded-xl border p-3"
      style={{
        background: "rgba(255,255,255,0.82)",
        borderColor: "hsl(var(--ui-glow) / 0.20)",
        boxShadow: "0 14px 30px rgba(0,0,0,0.06)",
      }}
    >
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="block">
        <polyline
          points={poly}
          fill="none"
          stroke="hsl(var(--ui-glow) / 0.98)"
          strokeWidth="3.0"
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{
            strokeDasharray: total,
            strokeDashoffset: (1 - clamp(t, 0, 1)) * total,
            transition: reduceMotion ? "none" : "stroke-dashoffset 180ms ease-out",
            filter: "drop-shadow(0 12px 22px rgba(0,0,0,0.10))",
          }}
        />
      </svg>

      <div className="mt-3 grid grid-cols-12 items-end gap-2">
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const base = [12, 14, 13, 16, 15, 18][i];
          const target = [28, 33, 32, 39, 37, 44][i];
          const v = Math.round(lerp(base, target, t));
          const hh = Math.max(10, Math.round((v / 44) * 42));
          return (
            <motion.div
              key={i}
              className="col-span-2 rounded-md border"
              initial={false}
              animate={{ height: hh }}
              transition={
                reduceMotion ? { duration: 0 } : { duration: 0.16, ease: [0.22, 1, 0.36, 1], delay: i * 0.01 }
              }
              style={{
                background: "linear-gradient(180deg, hsl(var(--ui-glow) / 0.40), rgba(255,255,255,0.88))",
                borderColor: "hsl(var(--ui-glow) / 0.22)",
                boxShadow: "0 14px 26px rgba(0,0,0,0.06)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function PieViz(props: { t: number; reduceMotion: boolean }) {
  const { t, reduceMotion } = props;
  const pct = clamp(Math.round(lerp(0, 100, t)), 0, 100);

  const r = 16;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  const gap = c - dash;

  return (
    <div className="grid place-items-center py-2">
      <div
        className="rounded-full border p-3"
        style={{
          borderColor: "hsl(var(--ui-glow) / 0.22)",
          background: "rgba(255,255,255,0.84)",
          boxShadow: "0 22px 70px rgba(0,0,0,0.08)",
        }}
      >
        <svg viewBox="0 0 50 50" className="h-[96px] w-[96px]">
          <circle cx="25" cy="25" r={r} fill="none" stroke="rgba(0,0,0,0.10)" strokeWidth="8" />
          <motion.circle
            cx="25"
            cy="25"
            r={r}
            fill="none"
            stroke="hsl(var(--ui-glow) / 0.98)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${gap}`}
            transform="rotate(-90 25 25)"
            initial={false}
            animate={{ strokeDasharray: `${dash} ${gap}` }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{ filter: "drop-shadow(0 16px 28px rgba(0,0,0,0.10))" }}
          />
        </svg>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Card: scroll-driven + tap energize                                          */
/* -------------------------------------------------------------------------- */

function ScrollDrivenDemo(props: { kind: DemoKind }) {
  const { kind } = props;
  const reduceMotion = useReducedMotion();
  const { ref, progress } = useScrollFillProgress<HTMLDivElement>({ startY: 0.92, endY: 0.18 });

  // tap/click adds a short “energy boost” (micro interaction)
  const [boost, setBoost] = useState(0);

  useEffect(() => {
    if (boost <= 0) return;
    const id = window.setTimeout(() => setBoost(0), 220);
    return () => window.clearTimeout(id);
  }, [boost]);

  const raw = clamp(progress + boost, 0, 1);

  // KEY FIX: slow the middle card's perceived fill so all three feel synchronized
  const t =
    kind === "trend"
      ? Math.pow(raw, 1.55) // slower early, same endpoint
      : raw;

  return (
    <div ref={ref}>
      <PhysicsCard
        onTapPulse={() => {
          if (reduceMotion) return;
          setBoost(0.12);
        }}
      >
        {kind === "funnel" ? (
          <FunnelViz t={t} reduceMotion={!!reduceMotion} />
        ) : kind === "trend" ? (
          <TrendViz t={t} reduceMotion={!!reduceMotion} />
        ) : (
          <PieViz t={t} reduceMotion={!!reduceMotion} />
        )}
      </PhysicsCard>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Section                                                                     */
/* -------------------------------------------------------------------------- */

export function FeaturedWork() {
  const items: DemoCard[] = useMemo(
    () => [
      { id: "lift", kind: "funnel" },
      { id: "trend", kind: "trend" },
      { id: "pie", kind: "pie" },
    ],
    []
  );

  return (
    <section id="work" className="border-b">
      <Container className="py-14 sm:py-20">
        <div className="mb-10">
          <RocketToRevenue />
        </div>

        <FadeIn>
          <h2 className="text-2xl font-semibold tracking-tight">Clicks → Conversion</h2>
        </FadeIn>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <ScaleIn key={item.id} delay={0.06 * idx} from={0.9}>
              <InteractiveCard className="rounded-2xl">
                <ScrollDrivenDemo kind={item.kind} />
              </InteractiveCard>
            </ScaleIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
