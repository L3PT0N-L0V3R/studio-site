"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  type Transition,
} from "framer-motion";

import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { flagshipSteps } from "@/content/flagship";

type HeaderPill = {
  id: "narrative" | "mobile" | "performance";
  label: string;
  headline: string;
  body: string;
  bullets: string[];
};

const HEADER_PILLS: HeaderPill[] = [
  {
    id: "narrative",
    label: "Narrative-led",
    headline: "Narrative-led motion",
    body:
      "Scroll pacing and transitions guide attention and hierarchy—so the experience feels premium and intentional, not noisy.",
    bullets: [
      "Controlled reveals (scale/blur/parallax—subtle)",
      "Section-to-section rhythm",
      "Clear story beats",
    ],
  },
  {
    id: "mobile",
    label: "Mobile-first",
    headline: "Mobile-first motion",
    body:
      "Motion is tuned for small screens: readable, responsive, and never janky—so it feels high-end across devices.",
    bullets: ["Responsive layout + spacing", "Thumb-friendly interaction zones", "Avoid layout thrash"],
  },
  {
    id: "performance",
    label: "Performance-aware",
    headline: "Performance-aware implementation",
    body:
      "We keep motion lightweight and predictable so you hit Core Web Vitals targets and avoid stutters on real devices.",
    bullets: ["GPU-friendly patterns", "Avoid heavy runtime effects", "Performance-safe motion (no jank on mobile)"],
  },
];

const STEP_SENTINEL_MIN_H = "min-h-[220px]";

/**
 * Per-step tone selection (themeable).
 * Define these in globals.css:
 *   --tone-1..--tone-6 = "H S L" triplets, e.g. "221 83% 53%"
 */
function toneForIndex(idx: number) {
  const n = (idx % 6) + 1;
  return `hsl(var(--tone-${n}) / 1)`;
}

export function FlagshipScroll() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const [scrollDir, setScrollDir] = useState<"down" | "up">("down");

  // Header pill modal state
  const [openPill, setOpenPill] = useState<HeaderPill["id"] | null>(null);
  const selectedPill = useMemo(
    () => HEADER_PILLS.find((p) => p.id === openPill) ?? null,
    [openPill]
  );

  useEffect(() => {
    if (!openPill) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenPill(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openPill]);

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
  const coverH = useSpring(
    0,
    reduceMotion ? { stiffness: 1, damping: 1 } : { stiffness: 240, damping: 34, mass: 0.9 }
  );

  const updateCoverToIndex = (idx: number) => {
    const listEl = listRef.current;
    const nodeEl = nodesRef.current[idx];
    if (!listEl || !nodeEl) return;

    const listRect = listEl.getBoundingClientRect();
    const nodeRect = nodeEl.getBoundingClientRect();

    const nodeCenterY = nodeRect.top + nodeRect.height / 2;
    const raw = nodeCenterY - listRect.top;

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

        const shouldSwitch =
          bestIdx !== current &&
          (bestRatio > Math.max(0.25, currentRatio + 0.08) ||
            (currentRatio < 0.12 && bestRatio > 0.12));

        if (shouldSwitch) {
          activeRef.current = bestIdx;
          setActiveIndex(bestIdx);

          mx.set(0);
          my.set(0);

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

  // Dotted line uses --ui-glow
  const dottedLineBase: React.CSSProperties = {
    backgroundImage:
      "radial-gradient(circle at center, hsl(var(--ui-glow) / 0.55) 1.2px, transparent 1.45px)",
    backgroundSize: "6px 14px",
    backgroundRepeat: "repeat-y",
    backgroundPosition: "center top",
  };

  // --- Spine masking (no background overlays) ---
  // We use CSS masking instead of painting over the spine with a solid background,
  // so the effect works on gradient/washed backgrounds without leaving a vertical seam.
  const spineEdgeMask =
    "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)";
  const spineProgressMask = useMotionTemplate`linear-gradient(
    to bottom,
    transparent 0px,
    transparent ${coverH}px,
    black calc(${coverH}px + 44px),
    black 100%
  )`;

  return (
    <section className="border-b">
      <Container className="py-14 sm:py-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Guided user experience</h2>
            <p className="mt-2 max-w-2xl text-zinc-600">
              Turn your site into a guided experience: pacing, hierarchy, and motion that move people
              from curiosity to action.
            </p>
          </div>

          {/* Clickable header pills */}
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            {HEADER_PILLS.map((p) => {
              const isActive = openPill === p.id;

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setOpenPill((prev) => (prev === p.id ? null : p.id))}
                  className={cn(
                    "rounded-full border bg-white px-3 py-1 shadow-sm transition-all",
                    "hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-300",
                    isActive ? "ui-border-accent" : "border-border"
                  )}
                  aria-haspopup="dialog"
                  aria-expanded={isActive}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <div ref={listRef} className="relative mt-10 grid gap-0">
          {/* One continuous dotted spine */}
          {flagshipSteps.length > 1 ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-1/2 w-10 -translate-x-1/2"
              style={{
                WebkitMaskImage: spineEdgeMask,
                maskImage: spineEdgeMask,
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskSize: "100% 100%",
                maskSize: "100% 100%",
              }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  ...dottedLineBase,
                  WebkitMaskImage: spineProgressMask,
                  maskImage: spineProgressMask,
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskSize: "100% 100%",
                  maskSize: "100% 100%",
                }}
              />
            </div>
          ) : null}

          {flagshipSteps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = idx === activeIndex;

            const iconColor = toneForIndex(idx);

            const iconWrapStyle: React.CSSProperties = {
              backgroundColor: "hsl(var(--background) / 1)", // neutral
              borderColor: "hsl(var(--border))",
            };

            return (
              <div key={s.slug} ref={setNode(idx)} className={cn("relative", STEP_SENTINEL_MIN_H, "py-12")}>
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
                                    className="flex h-10 w-10 items-center justify-center rounded-2xl border"
                                    style={iconWrapStyle}
                                    transition={spring}
                                  >
                                    <Icon className="h-5 w-5" style={{ color: iconColor }} />
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
                            className="flex h-10 w-10 items-center justify-center rounded-2xl border"
                            style={iconWrapStyle}
                            transition={spring}
                          >
                            <Icon className="h-5 w-5" style={{ color: iconColor }} />
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

        {/* Header pill modal */}
        <AnimatePresence>
          {selectedPill ? (
            <>
              <motion.div
                className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[1px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpenPill(null)}
              />

              <motion.div
                className="fixed inset-0 z-50 grid place-items-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 520, damping: 42, mass: 0.85 }
                  }
                  className="w-full max-w-xl overflow-hidden rounded-2xl border bg-white shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                  role="dialog"
                  aria-modal="true"
                  aria-label={selectedPill.headline}
                >
                  <div className="flex items-start justify-between gap-4 p-6">
                    <div className="min-w-0">
                      <div className="text-sm text-muted-foreground">{selectedPill.label}</div>
                      <div className="mt-1 text-2xl font-semibold tracking-tight">
                        {selectedPill.headline}
                      </div>
                      <p className="mt-3 text-muted-foreground">{selectedPill.body}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setOpenPill(null)}
                      className="shrink-0 rounded-xl border bg-white px-3 py-2 text-sm hover:shadow-sm"
                    >
                      Close
                    </button>
                  </div>

                  <div className="border-t px-6 py-5">
                    <div className="text-sm font-semibold">Includes</div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {selectedPill.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>
      </Container>
    </section>
  );
}
