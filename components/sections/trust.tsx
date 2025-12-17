"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";

import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";

type TrustItem = {
  label: string;
  sublabel?: string;
};

type TrustDetail = {
  headline: string;
  body: string;
  bullets: string[];
};

const detailByLabel: Record<string, TrustDetail> = {
  "HIPAA-ready": {
    headline: "HIPAA-ready safeguards (scope first)",
    body:
      "We define what’s in/out of scope, then implement safeguards aligned to the HIPAA Security Rule for the systems and data you actually operate. This supports compliance workstreams without implying certification.",
    bullets: [
      "System boundary + data flow documentation",
      "Access control and audit logging baseline",
      "Security defaults (sessions, storage, secrets, backups) aligned to scope",
    ],
  },
  "HITRUST-aligned": {
    headline: "HITRUST-aligned control mapping",
    body:
      "We map controls to your architecture and generate evidence-friendly documentation so an assessor can validate implementation later. Alignment is implementation-dependent and not an assessment result.",
    bullets: [
      "Control-to-feature mapping with ownership",
      "Evidence capture plan (what logs/docs prove what)",
      "Gap list and remediation plan by priority",
    ],
  },
  "PCI-aware": {
    headline: "PCI-aware payment architecture",
    body:
      "We design payment flows to minimize PCI scope by keeping cardholder data out of your app wherever possible, using proven Stripe/Shopify patterns and tokenization.",
    bullets: [
      "Hosted checkout / payment links when appropriate",
      "Tokenized payments (no raw card data stored/processed)",
      "Clear separation of payment components and audit trails",
    ],
  },
  "Audit-ready": {
    headline: "Audit-ready logging and traceability",
    body:
      "We implement structured logs and traceability patterns that make audits, debugging, and incident response straightforward—without turning your stack into a compliance-only burden.",
    bullets: [
      "Structured logs + correlation/trace IDs",
      "Change history patterns (who/what/when)",
      "Operational visibility for audits and incident response",
    ],
  },
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function Trust({
  eyebrow = "Security posture",
  headline = "Security-first builds with compliance-ready foundations*",
  highlight = ["Security-first", "compliance-ready"],
  copy = "We implement modern security defaults and document the system boundary. For regulated environments, we scope requirements properly (what’s in/out), align controls, and support audits—without making misleading certification claims.",
  items = [
    { label: "HIPAA-ready", sublabel: "scoped safeguards" },
    { label: "HITRUST-aligned", sublabel: "control mapping" },
    { label: "PCI-aware", sublabel: "Stripe/Shopify flows" },
    { label: "Audit-ready", sublabel: "logs + traceability" },
  ],
}: {
  eyebrow?: string;
  headline?: string;
  highlight?: string[];
  copy?: string;
  items?: TrustItem[];
}) {
  const reduceMotion = useReducedMotion();

  const enriched = useMemo(() => {
    return items.map((it) => {
      const id = slugify(it.label);
      const detail =
        detailByLabel[it.label] ?? {
          headline: it.label,
          body: it.sublabel ?? "",
          bullets: [],
        };
      return { ...it, id, detail };
    });
  }, [items]);

  const [openId, setOpenId] = useState<string | null>(null);
  const selected = useMemo(() => enriched.find((x) => x.id === openId) ?? null, [enriched, openId]);

  // Esc closes
  useEffect(() => {
    if (!openId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openId]);

  return (
    <section className="border-b bg-zinc-50/60">
      <Container className="py-14 sm:py-20">
        <FadeIn>
          <p className="text-sm font-medium text-zinc-600">{eyebrow}</p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            <HighlightWords text={headline} words={highlight} />
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600">{copy}</p>

          <LayoutGroup>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {enriched.map((it) => {
                const isActive = openId === it.id;

                return (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => setOpenId((prev) => (prev === it.id ? null : it.id))}
                    className={[
                      "group relative flex items-center gap-2 rounded-2xl px-4 py-2 text-left",
                      "hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-zinc-300",
                    ].join(" ")}
                    aria-haspopup="dialog"
                    aria-expanded={isActive}
                  >
                    {/* Background-only morph (prevents text stretching) */}
                    <motion.span
                      layoutId={`trust-bg-${it.id}`}
                      className={[
                        "absolute inset-0 rounded-2xl border bg-white shadow-sm transition-colors",
                        isActive ? "border-zinc-900" : "border-border",
                      ].join(" ")}
                    />

                    <span className="relative z-10 flex items-center gap-2">
                      <Badge variant="secondary" className="rounded-full">
                        {it.label}
                      </Badge>
                      {it.sublabel ? <span className="text-sm text-zinc-600">{it.sublabel}</span> : null}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-4 text-xs text-zinc-500">
              *“Ready/aligned/aware” depends on scope and implementation details. Certifications
              require formal assessment.
            </p>

            <AnimatePresence>
              {selected ? (
                <>
                  <motion.div
                    className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[1px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setOpenId(null)}
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
                      className="relative w-full max-w-2xl overflow-hidden rounded-2xl"
                      onClick={(e) => e.stopPropagation()}
                      role="dialog"
                      aria-modal="true"
                      aria-label={selected.detail.headline}
                    >
                      {/* Background-only morph (no text scaling) */}
                      <motion.div
                        layoutId={`trust-bg-${selected.id}`}
                        className="absolute inset-0 rounded-2xl border bg-white shadow-xl"
                      />

                      <div className="relative z-10">
                        <div className="flex items-start justify-between gap-4 p-6">
                          <div className="min-w-0">
                            <div className="text-sm text-muted-foreground">{selected.label}</div>
                            <div className="mt-1 text-2xl font-semibold tracking-tight">
                              {selected.detail.headline}
                            </div>
                            <p className="mt-3 text-muted-foreground">{selected.detail.body}</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => setOpenId(null)}
                            className="shrink-0 rounded-xl border bg-white px-3 py-2 text-sm hover:shadow-sm"
                          >
                            Close
                          </button>
                        </div>

                        {selected.detail.bullets.length ? (
                          <div className="border-t px-6 py-5">
                            <div className="text-sm font-semibold">What this usually includes</div>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                              {selected.detail.bullets.map((b) => (
                                <li key={b}>{b}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  </motion.div>
                </>
              ) : null}
            </AnimatePresence>
          </LayoutGroup>
        </FadeIn>
      </Container>
    </section>
  );
}

function HighlightWords({ text, words }: { text: string; words: string[] }) {
  const parts: React.ReactNode[] = [];
  let remaining = text;

  const targets = [...words].sort((a, b) => b.length - a.length);

  while (remaining.length) {
    const lower = remaining.toLowerCase();
    let bestIdx = -1;
    let bestLen = 0;

    for (const w of targets) {
      const i = lower.indexOf(w.toLowerCase());
      if (i !== -1 && (bestIdx === -1 || i < bestIdx)) {
        bestIdx = i;
        bestLen = w.length;
      }
    }

    if (bestIdx === -1) {
      parts.push(remaining);
      break;
    }

    if (bestIdx > 0) parts.push(remaining.slice(0, bestIdx));

    const marked = remaining.slice(bestIdx, bestIdx + bestLen);
    parts.push(
      <mark
        key={`${bestIdx}-${marked}`}
        className="rounded-lg bg-amber-200 px-2 py-0.5 text-zinc-900"
      >
        {marked}
      </mark>
    );

    remaining = remaining.slice(bestIdx + bestLen);
  }

  return <>{parts}</>;
}
