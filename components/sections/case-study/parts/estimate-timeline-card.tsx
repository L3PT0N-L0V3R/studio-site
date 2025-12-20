"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { estimateTimelineWeeks, formatWeekRange, formatDayRange } from "../models";

export function EstimateTimelineCard(props: {
  pages: number;
  complexity: number;
  title: string;
  desc: string;
}) {
  const { pages, complexity, title, desc } = props;
  const t = estimateTimelineWeeks(pages, complexity);
  const label = formatWeekRange(t.minWeeks, t.maxWeeks);

  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{desc}</CardDescription>
        </div>
        {/* Removed: mini range badge/pill */}
      </CardHeader>

      <CardContent>
        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-muted-foreground">Estimated range</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight">{label}</div>

          <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg bg-zinc-50 p-3">
              <div className="text-muted-foreground">Design</div>
              <div className="mt-1 font-medium tabular-nums">
                {formatDayRange(t.breakdownDays.design.min, t.breakdownDays.design.max)}
              </div>
            </div>
            <div className="rounded-lg bg-zinc-50 p-3">
              <div className="text-muted-foreground">Build</div>
              <div className="mt-1 font-medium tabular-nums">
                {formatDayRange(t.breakdownDays.build.min, t.breakdownDays.build.max)}
              </div>
            </div>
            <div className="rounded-lg bg-zinc-50 p-3">
              <div className="text-muted-foreground">QA</div>
              <div className="mt-1 font-medium tabular-nums">
                {formatDayRange(t.breakdownDays.qa.min, t.breakdownDays.qa.max)}
              </div>
            </div>
          </div>
        </div>

        {/* Removed footnote */}
      </CardContent>
    </Card>
  );
}
