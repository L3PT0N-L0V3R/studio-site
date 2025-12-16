"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { flagshipSteps } from "@/content/flagship";

const TAGS = ["Modular", "Mobile-first", "Performance-aware"];

// Keeps stable scroll geometry for the observer even when the UI collapses to an icon.
const STEP_SENTINEL_MIN_H = "min-h-[220px]";

export function FlagshipScroll() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  const nodesRef = useRef<(HTMLElement | null)[]>([]);
  const ratiosRef = useRef<Map<Element, number>>(new Map());

  // Hysteresis: prevents rapid toggles / “skipping” feel on fast scroll.
  const activeRef = useRef(0);

  const setNode =
    (idx: number) =>
    (el: HTMLElement | null): void => {
      nodesRef.current[idx] = el;
    };

  const thresholds = useMemo(() => [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1], []);

  useEffect(() => {
    activeRef.current = activeIndex;
  }, [activeIndex]);

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

        // Only switch when the candidate is meaningfully “more dominant”
        // or when the current is effectively leaving the active band.
        const shouldSwitch =
          bestIdx !== current &&
          (bestRatio > Math.max(0.25, currentRatio + 0.08) ||
            (currentRatio < 0.12 && bestRatio > 0.12));

        if (shouldSwitch) {
          activeRef.current = bestIdx;
          setActiveIndex(bestIdx);
        }
      },
      {
        root: null,
        // Narrow active band (snappier) — middle ~20% of viewport.
        rootMargin: "-40% 0px -40% 0px",
        threshold: thresholds,
      }
    );

    els.forEach((el) => obs.observe(el));
    return () => {
      obs.disconnect();
      ratiosRef.current.clear();
    };
  }, [thresholds]);

  const spring = reduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 620, damping: 46, mass: 0.65 };

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

        {/* More breathing room between steps */}
        <div className="mt-10 grid gap-10">
          {flagshipSteps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = idx === activeIndex;

            return (
              <div
                key={s.slug}
                ref={setNode(idx)}
                className={cn("relative", STEP_SENTINEL_MIN_H, "py-10")}
              >
                <motion.div layout transition={spring} className="h-full">
                  <AnimatePresence initial={false} mode="wait">
                    {isActive ? (
                      <motion.div
                        key="expanded"
                        layout
                        transition={spring}
                        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                        exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
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
