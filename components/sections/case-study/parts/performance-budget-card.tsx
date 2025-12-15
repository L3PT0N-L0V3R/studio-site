"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Metric } from "./metric";
import { Activity, Gauge } from "lucide-react";
import { simulateLighthouse } from "../models";

export function PerformanceBudgetCard(props: { pages: number; complexity: number; title: string; desc: string }) {
  const { pages, complexity, title, desc } = props;
  const m = simulateLighthouse(pages, complexity);

  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{desc}</CardDescription>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Gauge className="h-4 w-4" />
          <span className="text-xs">Budget</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-xl border bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Lighthouse (simulated)</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="h-4 w-4" />
              reacts to scope
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <Metric label="Performance" value={m.performance} />
            <Metric label="Accessibility" value={m.accessibility} />
            <Metric label="Best Practices" value={m.bestPractices} />
            <Metric label="SEO" value={m.seo} />
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          This is a budget mindset: we set targets early, then design motion and components to stay inside the rails.
        </div>
      </CardContent>
    </Card>
  );
}
