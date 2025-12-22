"use client";

import { useMemo, useState } from "react";

import { Container } from "@/components/layout/container";
import { ScaleIn } from "@/components/motion/scale-in";
import { useGridGap, useSectionSpacing } from "@/components/providers/ui-config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { caseStudyCopy, type WiringNodeId } from "./data";
import { estimateTimelineWeeks, formatDayRange, formatWeekRange } from "./models";
import { PerformanceBudgetCard } from "./parts/performance-budget-card";
import { RangeField } from "./parts/range-field";
import { SystemWiringCard } from "./parts/system-wiring-card";

type Props = {
  variant?: "section" | "panel";
};

export function CaseStudy({ variant = "section" }: Props) {
  const sectionPad = useSectionSpacing();
  const gap = useGridGap();

  const [pages, setPages] = useState(8);
  const [complexity, setComplexity] = useState(3);
  const [activeNode, setActiveNode] = useState<WiringNodeId>("intake");

  const timeline = useMemo(() => estimateTimelineWeeks(pages, complexity), [pages, complexity]);
  const weekLabel = formatWeekRange(timeline.minWeeks, timeline.maxWeeks);

  const content = (
    <>
      <div className="flex items-start justify-between gap-6">
        <div className="max-w-2xl">
          <div className="text-sm font-medium text-muted-foreground">{caseStudyCopy.eyebrow}</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {caseStudyCopy.title}
          </h2>
          <p className="mt-3 text-muted-foreground">{caseStudyCopy.description}</p>
        </div>
      </div>

      {/*
        Simulation row
        - Mobile: stacked (combined card, then performance)
        - Desktop: 12-col layout (combined spans wider; performance stays readable)
      */}
      <div className={cn("mt-6 grid items-start gap-4 lg:grid-cols-12", gap)}>
        {/* Combined: Inputs + Estimate timeline */}
        <div className="lg:col-span-7">
          <ScaleIn>
            <Card className="rounded-2xl">
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base">
                    {caseStudyCopy.inputsTitle} + {caseStudyCopy.timelineTitle}
                  </CardTitle>
                  <CardDescription>
                    {caseStudyCopy.inputsDesc} {caseStudyCopy.timelineDesc}
                  </CardDescription>
                </div>

                {/* Desktop-only: quick range preview */}
                <div className="hidden lg:block text-right">
                  <div className="text-xs text-muted-foreground">{caseStudyCopy.timelineTitle}</div>
                  <div className="mt-1 text-sm font-semibold tabular-nums">{weekLabel}</div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
                  {/* Timeline (FIRST on mobile) */}
                  <div className="order-1 lg:order-2 rounded-xl border bg-white p-4">
                    <div className="rounded-lg bg-white">
                      <div className="text-sm text-muted-foreground">Estimated range</div>
                      <div className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
                        {weekLabel}
                      </div>

                      <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                        <div className="rounded-lg bg-zinc-50 p-3">
                          <div className="text-muted-foreground">Design</div>
                          <div className="mt-1 font-medium tabular-nums">
                            {formatDayRange(
                              timeline.breakdownDays.design.min,
                              timeline.breakdownDays.design.max
                            )}
                          </div>
                        </div>
                        <div className="rounded-lg bg-zinc-50 p-3">
                          <div className="text-muted-foreground">Build</div>
                          <div className="mt-1 font-medium tabular-nums">
                            {formatDayRange(
                              timeline.breakdownDays.build.min,
                              timeline.breakdownDays.build.max
                            )}
                          </div>
                        </div>
                        <div className="rounded-lg bg-zinc-50 p-3">
                          <div className="text-muted-foreground">QA</div>
                          <div className="mt-1 font-medium tabular-nums">
                            {formatDayRange(
                              timeline.breakdownDays.qa.min,
                              timeline.breakdownDays.qa.max
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Inputs (SECOND on mobile) */}
                  <div className="order-2 lg:order-1 rounded-xl border bg-white p-4">
                    <div className="space-y-5">
                      <RangeField
                        label="Pages"
                        hint="Rough page count (marketing + core flows)"
                        value={pages}
                        min={1}
                        max={25}
                        onChange={setPages}
                      />
                      <RangeField
                        label="Complexity"
                        hint="Motion, integrations, custom components"
                        value={complexity}
                        min={1}
                        max={5}
                        onChange={setComplexity}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScaleIn>
        </div>

        {/* Performance preview */}
        <div className="lg:col-span-5">
          <ScaleIn>
            <PerformanceBudgetCard
              pages={pages}
              complexity={complexity}
              title={caseStudyCopy.budgetTitle}
              desc={caseStudyCopy.budgetDesc}
            />
          </ScaleIn>
        </div>
      </div>

      <div className={cn("mt-4", gap)}>
        <ScaleIn>
          <SystemWiringCard
            active={activeNode}
            onActiveChange={setActiveNode}
            title={caseStudyCopy.wiringTitle}
            desc={caseStudyCopy.wiringDesc}
            tag={caseStudyCopy.wiringTag}
          />
        </ScaleIn>
      </div>
    </>
  );

  if (variant === "panel") return <div>{content}</div>;

  return (
    <section className={cn(sectionPad, "border-t border-border/70")} id="deliverable">
      <Container>{content}</Container>
    </section>
  );
}
