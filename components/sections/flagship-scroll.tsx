"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { flagshipSteps } from "@/content/flagship";

const TAGS = ["Modular", "Mobile-first", "Performance-aware"];

export function FlagshipScroll() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nodesRef = useRef<(HTMLElement | null)[]>([]);
  const ratiosRef = useRef<Map<Element, number>>(new Map());

  const setNode =
    (idx: number) =>
    (el: HTMLElement | null): void => {
      nodesRef.current[idx] = el;
    };

  const thresholds = useMemo(
    () => [0, 0.1, 0.25, 0.4, 0.55, 0.7, 0.85, 1],
    []
  );

  useEffect(() => {
    const els = nodesRef.current.filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          ratiosRef.current.set(e.target, e.intersectionRatio);
        }

        let bestIdx = 0;
        let bestRatio = -1;

        for (let i = 0; i < els.length; i++) {
          const r = ratiosRef.current.get(els[i]) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            bestIdx = i;
          }
        }

        setActiveIndex(bestIdx);
      },
      {
        root: null,
        rootMargin: "-25% 0px -20% 0px",
        threshold: thresholds,
      }
    );

    els.forEach((el) => obs.observe(el));
    return () => {
      obs.disconnect();
      ratiosRef.current.clear();
    };
  }, [thresholds]);

  const bubbleVariants = {
    inactive: {
      opacity: 0.72,
      scale: 0.985,
      y: 10,
      filter: "blur(0px)",
    },
    active: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
    },
  } as const;

  return (
    <section className="border-b">
      <Container className="py-14 sm:py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Customizable builds</h2>
            <p className="mt-2 max-w-2xl text-zinc-600">
              Start simple. Scale into premium motion, interactivity, conversion flows, and
              integrations when it makes sense.
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

        <div className="mt-8 grid gap-4">
          {flagshipSteps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = idx === activeIndex;

            return (
              <div key={s.slug} ref={setNode(idx)}>
                {/* Bubble pop wrapper */}
                <motion.div
                  layout
                  initial={false}
                  animate={isActive ? "active" : "inactive"}
                  variants={bubbleVariants}
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 34,
                    mass: 0.7,
                  }}
                >
                  <Card
                    className={cn(
                      "transition-shadow",
                      // bubble-like: a touch more rounding and shadow when active
                      isActive ? "shadow-md" : "shadow-sm"
                    )}
                  >
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <motion.div
                            className="flex h-10 w-10 items-center justify-center rounded-2xl border bg-white"
                            initial={false}
                            animate={{ scale: isActive ? 1.03 : 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <Icon className="h-5 w-5 text-zinc-900" />
                          </motion.div>

                          <div>
                            <div className="text-sm text-zinc-600">Step {s.step}</div>
                            <div className="text-base font-semibold">{s.title}</div>
                          </div>
                        </div>

                        <motion.div
                          initial={false}
                          animate={{ scale: isActive ? 1.03 : 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 32 }}
                        >
                          <Badge variant="secondary" className="px-3 py-1">
                            {isActive ? "Active" : "Scroll"}
                          </Badge>
                        </motion.div>
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
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
