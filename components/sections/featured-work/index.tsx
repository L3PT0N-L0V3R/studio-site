"use client";

import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion/fade-in";
import { ScaleIn } from "@/components/motion/scale-in";
import { InteractiveCard } from "@/components/motion/interactive-card";
import { work } from "@/content/work";
import { RocketToRevenue } from "./rocket-to-revenue";

export function FeaturedWork() {
  return (
    <section id="work" className="border-b">
      <Container className="py-14 sm:py-20">
        {/* Rocket animation lives ABOVE the section heading */}
        <div className="mb-10">
          <RocketToRevenue />
        </div>

        <FadeIn>
          <h2 className="text-2xl font-semibold tracking-tight">Featured work</h2>
          <p className="mt-2 text-zinc-600">
            A few examples of systems thinking, UI polish, and interaction design.
          </p>
        </FadeIn>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {work.map((item, idx) => (
            <ScaleIn key={item.title} delay={0.06 * idx} from={0.9}>
              <InteractiveCard className="rounded-2xl">
                <Card className="h-full rounded-2xl transition-shadow">
                  <CardHeader>
                    <div className="text-base font-semibold">{item.title}</div>
                    <div className="mt-2 text-sm text-zinc-600">{item.description}</div>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {item.tags.map((t) => (
                      <Badge key={t} variant="secondary">
                        {t}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              </InteractiveCard>
            </ScaleIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
