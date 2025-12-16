"use client";

import { cn } from "@/lib/utils";

export function RangeField(props: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (next: number) => void;
  className?: string;
}) {
  const { label, hint, value, min, max, step = 1, onChange, className } = props;

  const clamped = Math.max(min, Math.min(max, value));
  const percent = max === min ? 0 : ((clamped - min) / (max - min)) * 100;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-medium">{label}</div>
          {hint ? <div className="mt-1 text-xs text-muted-foreground">{hint}</div> : null}
        </div>

        <div className="text-sm font-medium tabular-nums">{clamped}</div>
      </div>

      <div className="relative">
        {/* Visible track + fill */}
        <div className="meter-track">
          <div
            className="meter-fill"
            style={{ width: `${percent}%`, ["--p" as any]: `${percent}%` }}
          />
        </div>

        {/* Thumb (clean + consistent) */}
        <div
          className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border bg-white shadow-sm"
          style={{ left: `calc(${percent}% - 8px)` }}
        />

        {/* Real range input (interaction layer) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={clamped}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-2 w-full cursor-pointer opacity-0"
          aria-label={label}
        />
      </div>
    </div>
  );
}
