"use client";

import { useState } from "react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { ScaleIn } from "@/components/motion/scale-in";
import { cn } from "@/lib/utils";
import { useGridGap, useSectionSpacing } from "@/components/providers/ui-config";

import { caseStudyCopy, type WiringNodeId } from "./data";
import { RangeField } from "./parts/range-field";
import { EstimateTimelineCard } from "./parts/estimate-timeline-card";
import { PerformanceBudgetCard } from "./parts/performance-budget-card";
import { SystemWiringCard } from "./parts/system-wiring-card";

export function CaseStudy() {
  const sectionPad = useSectionSpacing();
  const gap = useGridGap();

  const [pages, setPages] = useState(8);
  const [complexity, setComplexity] = useState(3);
  const [activeNode, setActiveNode] = useState<WiringNodeId>("intake");

  return (
    <section className={cn(sectionPad, "border-t border-border/70")} id="deliverable">
      <Container>
        <div className="flex items-start justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-sm font-medium text-muted-foreground">{caseStudyCopy.eyebrow}</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              {caseStudyCopy.title}
            </h2>
            <p className="mt-3 text-muted-foreground">{caseStudyCopy.description}</p>
          </div>

          <Badge variant="outline" className="mt-1 hidden sm:inline-flex">
            {caseStudyCopy.badge}
          </Badge>
        </div>

        <div className={cn("mt-6 grid items-start gap-4 lg:grid-cols-3", gap)}>
          <ScaleIn>
            <div className="rounded-2xl border bg-white p-6">
              <div className="text-base font-semibold">{caseStudyCopy.inputsTitle}</div>
              <div className="mt-1 text-sm text-muted-foreground">{caseStudyCopy.inputsDesc}</div>

              <div className="mt-5 space-y-5">
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
          </ScaleIn>

          <ScaleIn>
            <EstimateTimelineCard
              pages={pages}
              complexity={complexity}
              title={caseStudyCopy.timelineTitle}
              desc={caseStudyCopy.timelineDesc}
              footnote={caseStudyCopy.footnote}
            />
          </ScaleIn>

          <ScaleIn>
            <PerformanceBudgetCard
              pages={pages}
              complexity={complexity}
              title={caseStudyCopy.budgetTitle}
              desc={caseStudyCopy.budgetDesc}
            />
          </ScaleIn>
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
      </Container>
    </section>
  );
}
