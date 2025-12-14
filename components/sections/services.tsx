"use client";

import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScaleIn } from "@/components/motion/scale-in";
import { InteractiveCard } from "@/components/motion/interactive-card";
import { tiers } from "@/content/services";
import { ServiceQuiz } from "@/components/sections/service-quiz";
import { Configurator } from "@/components/sections/configurator";
import { useSectionSpacing, useGridGap, useCtaVariants } from "@/components/providers/ui-config";

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

export function Services() {
  const sectionPad = useSectionSpacing();
  const gap = useGridGap();
  const { primary } = useCtaVariants();

  return (
    <section id="services" className="border-b">
      <Container className={sectionPad}>
        <ScaleIn>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Services</h2>
              <p className="mt-2 max-w-2xl text-zinc-600">
                Choose what you need now. Start simple—or scale into advanced interactions,
                automation, and systems that streamline your workflow over time.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <span className="rounded-full border px-3 py-1">Modular</span>
              <span className="rounded-full border px-3 py-1">Mobile-first</span>
              <span className="rounded-full border px-3 py-1">Fast</span>
            </div>
          </div>
        </ScaleIn>

        {/* Configurator + Quiz */}
        <div className={["mt-8 grid", gap, "lg:grid-cols-2"].join(" ")}>
          <Configurator />
          <ServiceQuiz />
        </div>

        <div className={["mt-8 grid", gap, "lg:grid-cols-3"].join(" ")}>
          {(tiers as TierLike[]).map((t, idx) => {
            const name = getTierName(t);
            const desc = getTierDesc(t);
            const features = getTierFeatures(t);

            return (
              <ScaleIn key={name} delay={0.06 * idx} from={0.9}>
                <InteractiveCard className="rounded-2xl">
                  <Card className="h-full rounded-2xl transition-shadow hover:shadow-md">
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
                          <span key={f} className="rounded-full border px-2.5 py-1 text-xs text-zinc-700">
                            {f}
                          </span>
                        ))}
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm font-semibold">{t.price ?? ""}</div>
                        <Button asChild size="sm" variant={primary}>
                          <a href="#contact">Ask about this</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </InteractiveCard>
              </ScaleIn>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
