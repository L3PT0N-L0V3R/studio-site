"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Workflow } from "lucide-react";
import { wiringNodes, type WiringNodeId } from "../data";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export function SystemWiringCard(props: {
  active: WiringNodeId;
  onActiveChange: (id: WiringNodeId) => void;
  title: string;
  desc: string;
  tag: string;
}) {
  const { active, onActiveChange, title, desc, tag } = props;
  const reduceMotion = useReducedMotion();

  const selected = useMemo(
    () => wiringNodes.find((n) => n.id === active) ?? wiringNodes[0],
    [active]
  );

  const panelMotion = reduceMotion
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
        transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
      };

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
          {/* Tabs */}
          <div className="relative mt-1" role="tablist" aria-label="System wiring steps">
            {/* connector line */}
            <div className="absolute left-5 right-5 top-1/2 h-px -translate-y-1/2 bg-border" />

            <div className="relative grid grid-cols-4 gap-3">
              {wiringNodes.map((n) => {
                const isActive = n.id === active;

                return (
                  <button
                    key={n.id}
                    role="tab"
                    aria-selected={isActive}
                    type="button"
                    onClick={() => onActiveChange(n.id)}
                    className={cn(
                      // KEY FIX: relative + overflow-hidden contain the absolute highlight
                      "group relative isolate overflow-hidden rounded-2xl border bg-white px-4 py-3 text-left",
                      "transition-all duration-200",
                      "shadow-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                      isActive ? "ui-border-accent shadow-lg shadow-black/10" : "border-border"
                    )}
                  >
                    {/* Active highlight (contained to the button now) */}
                    {isActive ? (
                      <motion.div
                        layoutId="wiring-active-pill"
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-0 rounded-2xl"
                        style={{
                          background: "hsl(var(--ui-glow) / 0.14)",
                          border: "1px solid hsl(var(--ui-glow) / 0.35)",
                          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04)",
                        }}
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 520, damping: 42, mass: 0.7 }
                        }
                      />
                    ) : null}

                    {/* Content above highlight */}
                    <div className="relative z-10 text-sm font-medium">{n.title}</div>
                    <div className="relative z-10 mt-1 text-xs text-muted-foreground">
                      {n.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main explanation (animated swap) */}
          <div className="mt-4">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selected.id}
                {...panelMotion}
                className="rounded-xl border bg-zinc-50 p-4"
              >
                <div className="text-sm font-medium">{selected.title}</div>
                <div className="mt-2 text-sm text-muted-foreground">{selected.body}</div>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {selected.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Practice panel (animated swap) */}
        <div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${selected.id}-practice`}
              {...panelMotion}
              className="rounded-xl border bg-white p-4"
            >
              <div className="text-sm font-medium">{selected.practice.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{selected.practice.body}</p>

              <div className="mt-4 grid gap-2">
                {selected.practice.badges.map((b) => (
                  <Badge key={b} variant="secondary">
                    {b}
                  </Badge>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
