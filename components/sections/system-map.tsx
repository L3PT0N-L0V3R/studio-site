import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScaleIn } from "@/components/motion/scale-in";
import { HoverCard } from "@/components/motion/hover-card";
import { systemNodes } from "@/content/system-map";

export function SystemMap() {
  return (
    <section id="system-map" className="border-b">
      <Container className="py-14 sm:py-20">
        <ScaleIn>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Systems map</h2>
              <p className="mt-2 max-w-2xl text-zinc-600">
                A website is the front door. The real leverage comes when intake, follow-ups, and reporting
                work together as one system.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <span className="rounded-full border px-3 py-1">Modular</span>
              <span className="rounded-full border px-3 py-1">Expandable</span>
              <span className="rounded-full border px-3 py-1">Audit-aware</span>
            </div>
          </div>
        </ScaleIn>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {systemNodes.map((n, idx) => {
            const Icon = n.icon;
            return (
              <ScaleIn key={n.id} delay={0.06 * idx} from={0.9}>
                <HoverCard>
                  <Card className="h-full transition-shadow hover:shadow-md">
                    <CardHeader className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border bg-white">
                          <Icon className="h-5 w-5 text-zinc-900" />
                        </div>
                        <div>
                          <div className="text-base font-semibold">{n.title}</div>
                          <div className="text-sm text-zinc-600">{n.subtitle}</div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {n.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border px-2.5 py-1 text-xs text-zinc-700"
                          >
                            {t}
                          </span>
                        ))}
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
