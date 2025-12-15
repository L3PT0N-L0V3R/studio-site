"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Workflow } from "lucide-react";
import { wiringNodes, type WiringNodeId } from "../data";

export function SystemWiringCard(props: {
  active: WiringNodeId;
  onActiveChange: (id: WiringNodeId) => void;
  title: string;
  desc: string;
  tag: string;
  sideTitle: string;
  sideBody: string;
  sideBadges: readonly string[];
}) {
  const { active, onActiveChange, title, desc, tag, sideTitle, sideBody, sideBadges } = props;

  const selected = useMemo(
    () => wiringNodes.find((n) => n.id === active) ?? wiringNodes[0],
    [active]
  );

  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{desc}</CardDescription>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Workflow className="h-4 w-4" />
          <span className="text-xs">{tag}</span>
        </div>
      </CardHeader>

      <CardContent className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="relative mt-1">
            <div className="absolute left-5 right-5 top-1/2 h-px -translate-y-1/2 bg-border" />
            <div className="relative grid grid-cols-4 gap-3">
              {wiringNodes.map((n) => {
                const isActive = n.id === active;
                return (
                  <button
                    key={n.id}
                    onClick={() => onActiveChange(n.id)}
                    className={cn(
                      "rounded-2xl border bg-white px-3 py-3 text-left transition",
                      "hover:shadow-sm active:scale-[0.99]",
                      isActive ? "border-zinc-900 ring-2 ring-zinc-900/10" : "border-border"
                    )}
                  >
                    <div className="text-sm font-medium">{n.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{n.subtitle}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-xl border bg-zinc-50 p-4">
            <div className="text-sm font-medium">{selected.title}</div>
            <div className="mt-2 text-sm text-muted-foreground">{selected.body}</div>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {selected.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm font-medium">{sideTitle}</div>
          <p className="mt-2 text-sm text-muted-foreground">{sideBody}</p>
          <div className="mt-4 grid gap-2">
            {sideBadges.map((b) => (
              <Badge key={b} variant="secondary">
                {b}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
