"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  type Transition,
} from "framer-motion";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { flagshipSteps } from "@/content/flagship";

const TAGS = ["Modular", "Mobile-first", "Performance-aware"];
const STEP_SENTINEL_MIN_H = "min-h-[220px]";

export function FlagshipScroll() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const [scrollDir, setScrollDir] = useState<"down" | "up">("down");

  const listRef = useRef<HTMLDivElement | null>(null);

  const nodesRef = useRef<(HTMLElement | null)[]>([]);
  const ratiosRef = useRef<Map<Element, number>>(new Map());
  const activeRef = useRef(0);

  // ---- Active-card hover tilt ----
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 260, damping: 28, mass: 0.6 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-7, 7]);

  function onTiltMove(e: MouseEvent<HTMLElement>) {
    if (reduceMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    mx.set(px);
    my.set(py);
  }
  function onTiltLeave() {
    mx.set(0);
    my.set(0);
  }

  // ---- Dotted spine: cover height (in px), animated ----
  const coverH = useSpring(0, reduceMotion ? { stiffness: 1, damping: 1 } : { stiffness: 240, damping: 34, mass: 0.9 });

  const updateCoverToIndex = (idx: number) => {
    const listEl = listRef.current;
    const nodeEl = nodesRef.current[idx];
    if (!listEl || !nodeEl) return;

    const listRect = listEl.getBoundingClientRect();
    const nodeRect = nodeEl.getBoundingClientRect();

    // Cover everything ABOVE the active step's center:
    const nodeCenterY = nodeRect.top + nodeRect.height / 2;
    const raw = nodeCenterY - listRect.top;

    // Clamp into list bounds
    const clamped = Math.max(0, Math.min(listRect.height, raw));
    coverH.set(clamped);
  };

  const setNode =
    (idx: number) =>
    (el: HTMLElement | null): void => {
      nodesRef.current[idx] = el;
    };

  const thresholds = useMemo(() => [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1], []);

  useEffect(() => {
    activeRef.current = activeIndex;
    // After the layout changes (active card expands), update cover using real geometry.
    requestAnimationFrame(() => updateCoverToIndex(activeIndex));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  useEffect(() => {
    const onResize = () => updateCoverToIndex(activeRef.current);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let last = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const dir: "down" | "up" = y > last ? "down" : "up";
      last = y;

      setScrollDir((prev) => (prev === dir ? prev : dir));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  useEffect(() => {
    const els = nodesRef.current.filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratiosRef.current.set(e.target, e.intersectionRatio);

        let bestIdx = activeRef.current;
        let bestRatio = -1;

        for (let i = 0; i < els.length; i++) {
          const r = ratiosRef.current.get(els[i]) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            bestIdx = i;
          }
        }

        const current = activeRef.current;
        const currentRatio = ratiosRef.current.get(els[current]) ?? 0;

        // Slight hysteresis so fast scrolling feels less clunky.
        const shouldSwitch =
          bestIdx !== current &&
          (bestRatio > Math.max(0.25, currentRatio + 0.08) ||
            (currentRatio < 0.12 && bestRatio > 0.12));

        if (shouldSwitch) {
          activeRef.current = bestIdx;
          setActiveIndex(bestIdx);

          // reset tilt on active change
          mx.set(0);
          my.set(0);

          // Update cover immediately based on real pixel position
          requestAnimationFrame(() => updateCoverToIndex(bestIdx));
        }
      },
      {
        root: null,
        rootMargin: scrollDir === "up" ? "-25% 0px -55% 0px" : "-40% 0px -40% 0px",
        threshold: thresholds,
      }
    );

    els.forEach((el) => obs.observe(el));
    return () => {
      obs.disconnect();
      ratiosRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thresholds, scrollDir]);

  const spring: Transition = reduceMotion
  ? { duration: 0 }
  : { type: "spring", stiffness: 780, damping: 38, mass: 0.55 };


  // Dots (gold) – uses your --ui-glow
  const dottedLineBase: React.CSSProperties = {
    backgroundImage:
      "radial-gradient(circle at center, hsl(var(--ui-glow) / 0.55) 1.2px, transparent 1.45px)",
    backgroundSize: "6px 14px",
    backgroundRepeat: "repeat-y",
    backgroundPosition: "center top",
  };

  const bg = "hsl(var(--background) / 1)";
  const bg0 = "hsl(var(--background) / 0)";

  return (
    <section className="border-b">
      <Container className="py-14 sm:py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Customizable builds</h2>
            <p className="mt-2 max-w-2xl text-zinc-600">
              Start simple. Scale into premium motion, interactivity, conversion flows, and integrations
              when it makes sense.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-600">
            {TAGS.map((t) => (
              <span key={t} className="rounded-full border px-3 py-1">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div ref={listRef} className="relative mt-10 grid gap-0">
          {/* One continuous dotted spine */}
          {flagshipSteps.length > 1 ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-1/2 w-10 -translate-x-1/2"
            >
              {/* dots */}
              <div className="absolute inset-0" style={dottedLineBase} />

              {/* soft fade top/bottom */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom, ${bg} 0%, ${bg0} 12%, ${bg0} 88%, ${bg} 100%)`,
                }}
              />

              {/* COVER: hides everything above the active step (animated in PX) */}
              <motion.div
                className="absolute left-0 top-0 w-full"
                style={{
                  height: coverH, // <-- KEY: real pixel height, not percentage
                  background: `linear-gradient(to bottom, ${bg} 0%, ${bg} 78%, ${bg0} 100%)`,
                }}
              />
            </div>
          ) : null}

          {flagshipSteps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = idx === activeIndex;

            return (
              <div
                key={s.slug}
                ref={setNode(idx)}
                className={cn("relative", STEP_SENTINEL_MIN_H, "py-12")}
              >
                <motion.div layout transition={spring} className="relative z-10 h-full">
                  <AnimatePresence initial={false} mode="wait">
                    {isActive ? (
                      <motion.div
                        key="expanded"
                        layout
                        transition={spring}
                        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                        exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
                      >
                        <motion.div
                          onMouseMove={onTiltMove}
                          onMouseLeave={onTiltLeave}
                          style={
                            reduceMotion
                              ? undefined
                              : {
                                  rotateX,
                                  rotateY,
                                  transformStyle: "preserve-3d",
                                }
                          }
                          transition={spring}
                          className="will-change-transform"
                        >
                          <Card className={cn("transition-shadow ui-lift-strong", "shadow-md")}>
                            <CardHeader className="space-y-3">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <motion.div
                                    layoutId={`flagship-icon-${s.slug}`}
                                    className="flex h-10 w-10 items-center justify-center rounded-2xl border bg-white"
                                    transition={spring}
                                  >
                                    <Icon className="h-5 w-5 text-zinc-900" />
                                  </motion.div>

                                  <div>
                                    <div className="text-sm text-zinc-600">Step {s.step}</div>
                                    <div className="text-base font-semibold">{s.title}</div>
                                  </div>
                                </div>

                                <Badge variant="secondary" className="px-3 py-1">
                                  Active
                                </Badge>
                              </div>

                              <p className="text-sm text-zinc-600">{s.summary}</p>
                            </CardHeader>

                            <CardContent>
                              <ul className="grid gap-2">
                                {s.bullets.map((b) => (
                                  <li key={b} className="flex items-start gap-2 text-sm text-zinc-700">
                                    <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-zinc-900" />
                                    <span>{b}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="collapsed"
                        layout
                        transition={spring}
                        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
                        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                        exit={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
                        className="flex h-full items-center justify-center"
                      >
                        <motion.div
                          layout
                          transition={spring}
                          className={cn("rounded-2xl border bg-white p-3", "ui-lift", "shadow-sm")}
                        >
                          <motion.div
                            layoutId={`flagship-icon-${s.slug}`}
                            className="flex h-10 w-10 items-center justify-center rounded-2xl border bg-white"
                            transition={spring}
                          >
                            <Icon className="h-5 w-5 text-zinc-900" />
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
