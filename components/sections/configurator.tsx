"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUiConfig, type MotionLevel, type Density, type CtaStyle } from "@/components/providers/ui-config";

function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { label: string; value: T }[];
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-xs font-medium text-zinc-500">{label}</div>
      <div className="inline-flex rounded-xl border bg-white p-1">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              aria-pressed={active}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs transition",
                active ? "bg-zinc-900 text-white shadow-sm" : "text-zinc-700 hover:bg-zinc-50"
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Configurator() {
  const { motion, density, cta, setMotion, setDensity, setCta, reset } = useUiConfig();

  return (
    <Card className="w-full overflow-hidden rounded-2xl border bg-white">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-semibold tracking-tight">Live configurator</div>
          <div className="mt-1 text-sm text-zinc-600">
            A small demo of how we can tailor motion, spacing, and conversion UI to your brand.
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={reset}>
            Reset
          </Button>
        </div>
      </div>

      <div className="grid gap-3 border-t p-4">
        <Segmented<MotionLevel>
          label="Motion"
          value={motion}
          onChange={setMotion}
          options={[
            { label: "Minimal", value: "minimal" },
            { label: "Premium", value: "premium" },
            { label: "Signature", value: "signature" },
          ]}
        />

        <Segmented<Density>
          label="Density"
          value={density}
          onChange={setDensity}
          options={[
            { label: "Spacious", value: "spacious" },
            { label: "Compact", value: "compact" },
          ]}
        />

        <Segmented<CtaStyle>
          label="CTA style"
          value={cta}
          onChange={setCta}
          options={[
            { label: "Solid", value: "solid" },
            { label: "Outline", value: "outline" },
            { label: "Ghost", value: "ghost" },
          ]}
        />
      </div>
    </Card>
  );
}
