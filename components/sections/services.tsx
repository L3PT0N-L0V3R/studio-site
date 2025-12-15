import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScaleIn } from "@/components/motion/scale-in";
import { HoverCard } from "@/components/motion/hover-card";
import { tiers } from "@/content/services";
import { ServiceQuiz } from "@/components/sections/service-quiz";
import { Configurator } from "@/components/sections/configurator";

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

const pill =
  "rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-700";

const chip =
  "rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-700";

export function Services() {
  return (
    <section id="services" className="border-b">
      <Container className="py-14 sm:py-20">
        <ScaleIn>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Services</h2>
              <p className="mt-2 max-w-2xl text-zinc-600">
                Choose what you need now. Start simple—or scale into advanced interactions,
                automation, and systems that streamline your workflow over time.
              </p>
            </div>

            {/* Neutral pills (B/W) */}
            <div className="flex items-center gap-2">
              <span className={pill}>Modular</span>
              <span className={pill}>Mobile-first</span>
              <span className={pill}>Fast</span>
            </div>
          </div>
        </ScaleIn>

        <div className="mt-6 grid gap-4 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <Configurator />
          </div>
          <div className="lg:col-span-5">
            <ServiceQuiz />
          </div>
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
                      {/* Neutral chips (B/W) */}
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
      </Container>
    </section>
  );
}
