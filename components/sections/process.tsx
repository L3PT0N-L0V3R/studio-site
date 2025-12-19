import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScaleIn } from "@/components/motion/scale-in";
import { HoverCard } from "@/components/motion/hover-card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, CheckCircle2, Sparkles, Workflow, Wrench } from "lucide-react";
import { processSteps } from "@/content/process";

const PROCESS_TONE_BY_ID: Record<string, string> = {
  align: "var(--tone-1)",
  design: "var(--tone-2)",
  build: "var(--tone-3)",
  launch: "var(--tone-4)",
};

const iconMap = {
  align: Workflow,
  design: Sparkles,
  build: Wrench,
  launch: CheckCircle2,
} as const;

export function Process() {
  return (
    <section id="process" className="border-b">
      <Container className="py-14 sm:py-20">
        <ScaleIn>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Process</h2>
              <p className="mt-2 max-w-2xl text-zinc-600">
                Built for flexibility. Keep it simple—or scale into advanced interactions, automation,
                and systems that reduce friction as you grow.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <span className="rounded-full border px-3 py-1">Flexible scope</span>
              <span className="rounded-full border px-3 py-1">Fast iterations</span>
            </div>
          </div>
        </ScaleIn>

        {/* KEY CHANGE: group wrapper so we can blur "non-hovered" siblings */}
        <div className="group/process mt-8 grid gap-4 lg:grid-cols-2">
          {processSteps.map((s, idx) => {
            const Icon = iconMap[s.slug as keyof typeof iconMap] ?? Workflow;

            // Use slug as the stable key (align/design/build/launch)
            const tone = PROCESS_TONE_BY_ID[s.slug] ?? "var(--ui-glow)";

            const iconWrapStyle: React.CSSProperties = {
              // set a per-card tone that can be themed later
              ["--tone" as any]: tone,

              // neutral container (no colored fill)
              backgroundColor: "hsl(var(--background) / 1)",
              borderColor: "hsl(var(--border))",
            };

            const iconStyle: React.CSSProperties = {
              // colored icon glyph
              color: "hsl(var(--tone) / 1)",
            };

            return (
              <ScaleIn key={s.slug} delay={0.06 * idx} from={0.88}>
                {/* KEY CHANGE: blur/dim siblings on group hover, keep hovered card clear */}
                <HoverCard
                  className={[
                    // Fast + snappy: only animate transform/opacity. Filter changes instantly.
                    "transition-[transform,opacity] duration-100 ease-out",
                    "will-change-transform",

                    // Subtle de-emphasis for non-hovered cards (applied instantly)
                    "md:group-hover/process:opacity-90 md:group-hover/process:blur-[0.35px]",

                    // Hovered/focused card stays crisp and fully opaque
                    "md:hover:opacity-100 md:hover:blur-0",
                    "md:focus-within:opacity-100 md:focus-within:blur-0",
                  ].join(" ")}


                >
                  <Link
                    href={`/process/${s.slug}`}
                    className="block focus:outline-none"
                    aria-label={`Open process step ${s.step}: ${s.title}`}
                  >
                    <Card className="h-full transition-shadow">
                      <CardHeader className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-11 w-11 items-center justify-center rounded-2xl border"
                              style={iconWrapStyle}
                            >
                              <Icon className="h-5 w-5" style={iconStyle} />
                            </div>

                            <div>
                              <div className="text-sm text-zinc-500">{s.step}</div>
                              <div className="text-base font-semibold">{s.title}</div>
                            </div>
                          </div>

                          <Badge variant="secondary" className="gap-1">
                            Open <ArrowRight className="h-3.5 w-3.5" />
                          </Badge>
                        </div>

                        <p className="text-sm text-zinc-600">{s.summary}</p>
                      </CardHeader>

                      <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <div className="text-xs font-medium text-zinc-500">Flexible options</div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {s.flexibility.map((t) => (
                                <span
                                  key={t}
                                  className="rounded-full border px-2.5 py-1 text-xs text-zinc-700"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="text-xs font-medium text-zinc-500">Outputs</div>
                            <div className="mt-2 grid gap-1.5">
                              {s.outputs.map((o) => (
                                <div key={o} className="flex items-center gap-2 text-sm text-zinc-600">
                                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
                                  <span>{o}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <Separator className="my-5" />

                        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-600">
                          <span className="rounded-full border px-3 py-1">As simple as you want</span>
                          <span className="rounded-full border px-3 py-1">Or fully “app-like”</span>
                          <span className="rounded-full border px-3 py-1">Designed to evolve</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </HoverCard>
              </ScaleIn>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
