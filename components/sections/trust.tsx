import React from "react";

import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/motion/fade-in";
import { HoverCard } from "@/components/motion/hover-card";
import { Badge } from "@/components/ui/badge";

type TrustItem = {
  label: string;
  sublabel?: string;
};

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
  return (
    <section className="border-b bg-zinc-50/60">
      <Container className="py-14 sm:py-20">
        <FadeIn>
          <p className="text-sm font-medium text-zinc-600">{eyebrow}</p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            <HighlightWords text={headline} words={highlight} />
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600">
            {copy}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {items.map((it) => (
              <HoverCard key={it.label}>
                <div className="flex items-center gap-2 rounded-2xl border bg-white px-4 py-2 shadow-sm transition-shadow hover:shadow-md">
                  <Badge variant="secondary" className="rounded-full">
                    {it.label}
                  </Badge>
                  {it.sublabel ? (
                    <span className="text-sm text-zinc-600">{it.sublabel}</span>
                  ) : null}
                </div>
              </HoverCard>
            ))}
          </div>

          <p className="mt-4 text-xs text-zinc-500">
            *“Ready/aligned/aware” depends on scope and implementation details. Certifications
            require formal assessment.
          </p>
        </FadeIn>
      </Container>
    </section>
  );
}

function HighlightWords({ text, words }: { text: string; words: string[] }) {
  const parts: React.ReactNode[] = [];
  let remaining = text;

  // sort longer first so phrases win over single words
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
