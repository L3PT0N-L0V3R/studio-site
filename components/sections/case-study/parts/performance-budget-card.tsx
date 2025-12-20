"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Metric } from "./metric";
import { simulateLighthouse } from "../models";

export function PerformanceBudgetCard(props: {
  pages: number;
  complexity: number;
  title: string;
  desc: string;
}) {
  const { pages, complexity, title, desc } = props;
  const m = simulateLighthouse(pages, complexity);

  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{desc}</CardDescription>
        </div>
        {/* Removed: "Budget" label */}
      </CardHeader>

      <CardContent>
        <div className="rounded-xl border bg-white p-4">
          {/* Removed: "Lighthouse (simulated)" + "reacts to scope" row */}

          <div className="space-y-3">
            {/* Quality gates stay high (90–100) */}
            <Metric label="Accessibility" value={m.accessibility} />
            <Metric label="Best Practices" value={m.bestPractices} />
            <Metric label="SEO" value={m.seo} />

            {/* Capability metrics rise with complexity */}
            <div className="my-3 h-px w-full bg-border/70" />

            <Metric label="Instrumentation" value={m.instrumentation} />
            <Metric label="Automation coverage" value={m.automation} />
            <Metric label="Integration depth" value={m.integration} />
          </div>
        </div>

        {/* Removed footer explanation */}
      </CardContent>
    </Card>
  );
}
