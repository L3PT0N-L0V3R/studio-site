"use client";

import { clamp } from "../models";

export function Metric({ label, value }: { label: string; value: number }) {
  const v = clamp(Math.round(value), 0, 100);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular-nums">{v}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-zinc-100">
        <div
          className="h-2 rounded-full meter-fill"
          style={{ width: `${value}%`, ["--p" as any]: `${value}%` }}
        />
      </div>
    </div>
  );
}
