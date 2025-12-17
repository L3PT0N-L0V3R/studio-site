"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScaleIn } from "@/components/motion/scale-in";
import { HoverCard } from "@/components/motion/hover-card";
import { tiers } from "@/content/services";
import { ServiceQuiz } from "@/components/sections/service-quiz";

type TierLike = {
  name?: string;
  title?: string;
  description?: string;
  desc?: string;
  badge?: string;
  price?: string;
  features?: string[];
  includes?: string[];
  bullets?: string[];
  items?: string[];
};

function getTierName(t: TierLike) {
  return t.name ?? t.title ?? "Service";
}

function getTierDesc(t: TierLike) {
  return t.description ?? t.desc ?? "";
}

function getTierFeatures(t: TierLike): string[] {
  const maybe = t.features ?? t.includes ?? t.bullets ?? t.items ?? [];
  return Array.isArray(maybe) ? maybe : [];
}

type HeaderPill = {
  id: "conversion" | "mobile" | "performance";
  label: string;
  headline: string;
  body: string;
  bullets: string[];
};

const headerPills: HeaderPill[] = [
  {
    id: "conversion",
    label: "Conversion-ready",
    headline: "Conversion-ready by design",
    body:
      "We structure the page so the offer is clear, the path to action is frictionless, and you can measure what’s working.",
    bullets: ["Clear CTA hierarchy", "Event tracking hooks", "Copy + layout for intent"],
  },
  {
    id: "mobile",
    label: "Mobile-first",
    headline: "Mobile-first UX",
    body:
      "Layouts, spacing, and interactions are designed for small screens first—then enhanced for larger displays.",
    bullets: ["Responsive grids", "Thumb-friendly interactions", "Readable type scale"],
  },
  {
    id: "performance",
    label: "Performance-aware",
    headline: "Performance-aware build",
    body:
      "We treat speed as a feature, designing and implementing with Core Web Vitals and real user experience in mind.",
    bullets: ["Core Web Vitals targets", "Image/code optimization", "No heavyweight UI patterns"],
  },
];

const pill =
  "rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-700 shadow-sm transition-all";
const chip =
  "rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-700";

export function Services() {
  const reduceMotion = useReducedMotion();
  const [openPill, setOpenPill] = useState<HeaderPill["id"] | null>(null);

  const selectedPill = useMemo(
    () => headerPills.find((p) => p.id === openPill) ?? null,
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

  return (
    <section id="services" className="border-b">
      <Container className="py-14 sm:py-20">
        <ScaleIn>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Customizable builds</h2>
              <p className="mt-2 max-w-2xl text-zinc-600">
                Start simple. Scale into premium motion, interactivity, conversion flows, and
                integrations when it makes sense.
              </p>
            </div>

            {/* Clickable header pills */}
            <div className="flex items-center gap-2">
              {headerPills.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setOpenPill((prev) => (prev === p.id ? null : p.id))}
                  className={cn(
                    pill,
                    "hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-300"
                  )}
                  aria-haspopup="dialog"
                  aria-expanded={openPill === p.id}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </ScaleIn>

        {/* Quiz only (Configurator removed) */}
        <div className="mt-6">
          <ServiceQuiz />
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {(tiers as TierLike[]).map((t, idx) => {
            const name = getTierName(t);
            const desc = getTierDesc(t);
            const features = getTierFeatures(t);

            return (
              <ScaleIn key={name} delay={0.06 * idx} from={0.92}>
                <HoverCard>
                  <Card className="h-full rounded-2xl transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-base font-semibold">{name}</div>
                        {t.badge ? <Badge variant="secondary">{t.badge}</Badge> : null}
                      </div>
                      {desc ? <div className="mt-2 text-sm text-zinc-600">{desc}</div> : null}
                    </CardHeader>

                    <CardContent className="flex h-full flex-col">
                      <div className="flex flex-wrap gap-2">
                        {features.map((f) => (
                          <span key={f} className={chip}>
                            {f}
                          </span>
                        ))}
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm font-semibold">{t.price ?? ""}</div>
                        <Button asChild size="sm" variant="outline">
                          <a href="#contact">Ask about this</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </HoverCard>
              </ScaleIn>
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
