"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Dot = {
  tx: number; // target x (viewBox coords)
  ty: number; // target y (viewBox coords)
  x: number;
  y: number;
  vx: number;
  vy: number;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduced(!!mq.matches);

    set();
    if (mq.addEventListener) mq.addEventListener("change", set);
    else mq.addListener(set);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", set);
      else mq.removeListener(set);
    };
  }, []);

  return reduced;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function useInViewport<T extends HTMLElement>(threshold = 0.1) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const obs = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? true),
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/**
 * Kinetic dot-grid logo.
 * Default targets match your SVG (3×3 grid at 25/50/75 in viewBox=100).
 * If you ever want 5×5 later, just replace DOT_TARGETS with 5×5 coordinates.
 */
const DOT_TARGETS: Array<[number, number]> = [
  [25, 25],
  [50, 25],
  [75, 25],
  [25, 50],
  [50, 50],
  [75, 50],
  [25, 75],
  [50, 75],
  [75, 75],
];

export function LogoKineticGrid(props: {
  size?: number; // px
  className?: string;
  /** ViewBox dot radius (your SVG uses r=6) */
  dotRadius?: number;
  /** Max displacement in viewBox units */
  maxOffset?: number;
  /** Enables hover repulsion (desktop). Tap still ripples regardless. */
  hoverRepel?: boolean;
  /** aria-label override */
  label?: string;
}) {
  const {
    size = 22,
    className,
    dotRadius = 6,
    maxOffset = 10,
    hoverRepel = true,
    label = "Kinetic Dot Grid Logo",
  } = props;

  const reduced = usePrefersReducedMotion();
  const { ref: wrapRef, inView } = useInViewport<HTMLSpanElement>(0.15);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const hoveredRef = useRef(false);
  const activeRef = useRef(false);

  const pointerRef = useRef<{ x: number; y: number; active: boolean; fine: boolean }>({
    x: 50,
    y: 50,
    active: false,
    fine: true,
  });

  const rippleRef = useRef<{
    t0: number;
    active: boolean;
    ox: number;
    oy: number;
  }>({ t0: 0, active: false, ox: 50, oy: 50 });

  const dotsRef = useRef<Dot[]>([]);

  const dotsInit = useMemo<Dot[]>(
    () =>
      DOT_TARGETS.map(([tx, ty]) => ({
        tx,
        ty,
        x: tx,
        y: ty,
        vx: 0,
        vy: 0,
      })),
    []
  );

  // init dots once
  useEffect(() => {
    dotsRef.current = dotsInit.map((d) => ({ ...d }));
  }, [dotsInit]);

  // size canvas
  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, [reduced, size, wrapRef]);

  const stop = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    activeRef.current = false;
  };

  const start = () => {
    if (rafRef.current != null) return;
    activeRef.current = true;
    rafRef.current = requestAnimationFrame(tick);
  };

  const getWrapRect = () => wrapRef.current?.getBoundingClientRect() ?? null;

  const toViewBox = (clientX: number, clientY: number) => {
    const rect = getWrapRect();
    if (!rect) return { x: 50, y: 50 };
    const nx = (clientX - rect.left) / rect.width;
    const ny = (clientY - rect.top) / rect.height;
    return { x: clamp(nx * 100, 0, 100), y: clamp(ny * 100, 0, 100) };
  };

  const triggerRipple = (clientX: number, clientY: number) => {
    const p = toViewBox(clientX, clientY);
    rippleRef.current = {
      t0: performance.now(),
      active: true,
      ox: p.x,
      oy: p.y,
    };
    start();
  };

  const tick = (t: number) => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) {
      stop();
      return;
    }

    // stop if offscreen and nothing active
    if (!inView && !rippleRef.current.active && !hoveredRef.current) {
      stop();
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      stop();
      return;
    }

    // Parameters tuned for “premium” settle
    const k = 0.14; // spring stiffness
    const damping = 0.82; // velocity damping
    const influenceRadius = 28; // viewBox units
    const repulseStrength = 1.05;

    const dots = dotsRef.current;

    // wave params (short, subtle, quick settle)
    const ripple = rippleRef.current;
    const rippleAge = ripple.active ? t - ripple.t0 : 0;
    const rippleDur = 520; // ms
    const rippleT = ripple.active ? clamp(rippleAge / rippleDur, 0, 1) : 0;

    // taper wave quickly
    const waveEnvelope = ripple.active ? Math.exp(-4.2 * rippleT) : 0;
    const waveSpeed = 10.5;
    const waveFreq = 0.34;
    const waveAmp = 0.85;

    if (ripple.active && rippleAge > rippleDur) {
      rippleRef.current.active = false;
    }

    // color from currentColor
    const color = getComputedStyle(wrap).color;

    // clear
    ctx.clearRect(0, 0, size, size);

    // draw
    const scale = size / 100;

    let maxDisp = 0;
    let maxVel = 0;

    const pointer = pointerRef.current;
    const allowHover = hoverRepel && pointer.fine && hoveredRef.current && pointer.active;

    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];

      // spring force to target
      let fx = (d.tx - d.x) * k;
      let fy = (d.ty - d.y) * k;

      // cursor repulsion (gentle pressure field)
      if (allowHover) {
        const dx = d.x - pointer.x;
        const dy = d.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0.0001 && dist < influenceRadius) {
          const q = 1 - dist / influenceRadius;
          const s = repulseStrength * q * q;
          fx += (dx / dist) * s;
          fy += (dy / dist) * s;
        }
      }

      // ripple impulse
      if (ripple.active) {
        const dx = d.tx - ripple.ox;
        const dy = d.ty - ripple.oy;
        const dist = Math.hypot(dx, dy);

        // radial direction from origin to dot target
        if (dist > 0.0001) {
          const phase = dist * waveFreq - (rippleAge / 1000) * waveSpeed;
          const falloff = Math.exp(-dist * 0.06);
          const w = Math.sin(phase) * waveAmp * falloff * waveEnvelope;

          fx += (dx / dist) * w;
          fy += (dy / dist) * w;
        }
      }

      // integrate
      d.vx = (d.vx + fx) * damping;
      d.vy = (d.vy + fy) * damping;

      d.x += d.vx;
      d.y += d.vy;

      // cap displacement to preserve mark legibility
      const ox = d.x - d.tx;
      const oy = d.y - d.ty;
      const disp = Math.hypot(ox, oy);
      if (disp > maxOffset) {
        const s = maxOffset / disp;
        d.x = d.tx + ox * s;
        d.y = d.ty + oy * s;
        // soften velocity too
        d.vx *= 0.75;
        d.vy *= 0.75;
      }

      maxDisp = Math.max(maxDisp, Math.hypot(d.x - d.tx, d.y - d.ty));
      maxVel = Math.max(maxVel, Math.hypot(d.vx, d.vy));

      // draw dot
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(d.x * scale, d.y * scale, dotRadius * scale, 0, Math.PI * 2);
      ctx.fill();
    }

    // decide whether to keep running
    const settled = maxDisp < 0.06 && maxVel < 0.06;
    const keepAlive = hoveredRef.current || rippleRef.current.active || !settled;

    if (!keepAlive) {
      stop();
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (reduced) {
    // Static fallback SVG (exactly your provided mark)
    return (
      <span
        className={cn("inline-block leading-none text-current", className)}
        style={{ width: size, height: size }}
        aria-label={label}
        role="img"
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <g fill="currentColor">
            <circle cx="25" cy="25" r="6" />
            <circle cx="50" cy="25" r="6" />
            <circle cx="75" cy="25" r="6" />
            <circle cx="25" cy="50" r="6" />
            <circle cx="50" cy="50" r="6" />
            <circle cx="75" cy="50" r="6" />
            <circle cx="25" cy="75" r="6" />
            <circle cx="50" cy="75" r="6" />
            <circle cx="75" cy="75" r="6" />
          </g>
        </svg>
      </span>
    );
  }

  return (
    <span
      ref={wrapRef}
      className={cn("relative inline-block select-none text-current", className)}
      style={{ width: size, height: size }}
      aria-label={label}
      role="img"
      onPointerEnter={() => {
        hoveredRef.current = true;
        start();
      }}
      onPointerLeave={() => {
        hoveredRef.current = false;
        pointerRef.current.active = false;
        start(); // allow it to settle back
      }}
      onPointerMove={(e) => {
        // Only treat hover repulsion as “real” for fine pointers; mobile still gets click ripple.
        pointerRef.current.fine = e.pointerType === "mouse" || e.pointerType === "pen";
        if (!pointerRef.current.fine) return;

        const p = toViewBox(e.clientX, e.clientY);
        pointerRef.current.x = p.x;
        pointerRef.current.y = p.y;
        pointerRef.current.active = true;
        start();
      }}
      onPointerDown={(e) => {
        // Ripple on tap/click without preventing navigation if this is inside a Link.
        triggerRipple(e.clientX, e.clientY);
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        aria-hidden="true"
      />
    </span>
  );
}
