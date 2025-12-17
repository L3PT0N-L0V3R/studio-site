"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { cn } from "@/lib/utils";
import { ConfiguratorDialog } from "@/components/overlays/configurator-dialog";
import { useGridGap, useSectionSpacing } from "@/components/providers/ui-config";
import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

export function Hero() {
  const sectionPad = useSectionSpacing();
  const gap = useGridGap();

  const positioning = {
    eyebrow: "Systems-first rebuilds",
    title: "Premium websites that act like infrastructure.",
    description:
      "We rebuild websites for businesses that outgrew theirs—then we connect the systems behind it.",
    bestForTitle: "We’re best for…",
    bestFor: [
      "Service businesses ready for a premium rebuild",
      "Teams that want intake → CRM → automation connected",
      "Founders who care about performance, SEO, and conversion clarity",
    ],
    notForTitle: "Not for…",
    notFor: [
      "One-page brochure sites with no system needs",
      "Projects where cheapest is the only priority",
      "Heavy daily publishing workflows (CMS-first teams)",
    ],
  } as const;


  return (
    <section className={cn(sectionPad, "border-b")} id="top">
      <Container>
        <div className={cn("grid items-start gap-10 lg:grid-cols-2", gap)}>
          {/* Left column */}
          <div>
            <div className="inline-flex items-center gap-2">
              <Badge variant="secondary">Systems-first</Badge>
              <span className="text-sm text-muted-foreground">{positioning.eyebrow}</span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              {positioning.title}
            </h1>

            <p className="mt-3 max-w-xl text-muted-foreground">{positioning.description}</p>

            <p className="mt-3 max-w-xl text-muted-foreground">{positioning.description}</p>

            <div className="mt-6 text-sm text-muted-foreground">
            </div>

            <div className={cn("mt-8 grid gap-4 sm:grid-cols-2", gap)}>
              <div className="rounded-2xl border bg-white p-4">
                <div className="text-sm font-semibold">{positioning.bestForTitle}</div>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  {positioning.bestFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border bg-white p-4">
                <div className="text-sm font-semibold">{positioning.notForTitle}</div>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  {positioning.notFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Primary actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Magnetic strength={16}>
                <Button asChild>
                  <a href="#contact">Get a quote</a>
                </Button>
              </Magnetic>

              <Magnetic strength={16} hoverScale={1.008}>
                <Button variant="outline" asChild>
                  <a href="#work">View work</a>
                </Button>
              </Magnetic>

              {/* Configurator now lives here (popup) */}
              <Magnetic strength={16} hoverScale={1.008}>
                <ConfiguratorDialog />
              </Magnetic>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:pt-10">
            <div className="rounded-2xl border bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold">What you get</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    A site that looks premium—and behaves like a system.
                  </div>
                </div>

                <HighlightBulb
                  title="Highlights"
                  lines={[
                    "Core Web Vitals targets",
                    "SEO + accessibility baseline",
                    "Analytics + event plan",
                    "Intake → CRM wiring",
                  ]}
                />
              </div>

              <div className={cn("mt-4 grid gap-3 text-sm", gap)}>
                <div className="rounded-xl bg-zinc-50 p-4">
                  <div className="font-medium">Design system</div>
                  <div className="mt-1 text-muted-foreground">
                    Typography, spacing, components—consistent and scalable.
                  </div>
                </div>

                <div className="rounded-xl bg-zinc-50 p-4">
                  <div className="font-medium">Conversion flow</div>
                  <div className="mt-1 text-muted-foreground">
                    Clear offer, frictionless paths, measurable events.
                  </div>
                </div>

                <div className="rounded-xl bg-zinc-50 p-4">
                  <div className="font-medium">Systems integration</div>
                  <div className="mt-1 text-muted-foreground">
                    Intake, follow-ups, and reporting connected behind the site.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * Clickable “bulb” card with a premium ambient glow when enabled.
 * Keeps the “Highlights” concept but upgrades it into an interaction.
 */
export function HighlightBulb({
  title = "Highlights",
  lines = [],
}: {
  title?: string;
  lines?: string[];
}) {
  const [open, setOpen] = useState(false);

  const glowStyle = useMemo(() => {
    if (!open) return undefined;
    return {
      boxShadow:
        "0 18px 60px hsl(var(--ui-glow) / 0.22), 0 10px 22px rgba(0,0,0,0.10)",
    } as React.CSSProperties;
  }, [open]);

  const primary = lines.slice(0, 2);
  const extra = lines.slice(2);

  return (
    <motion.button
      type="button"
      onClick={() => setOpen((v) => !v)}
      layout
      className={cn(
        "relative select-none rounded-2xl border bg-white px-3 py-2 text-left transition-all",
        "ui-ambient ui-ambient-hover",
        open ? "ui-ambient-active border-zinc-900" : "border-border",
        // width expansion like before
        open ? "w-[280px]" : "w-[220px]"
      )}
      style={glowStyle}
      aria-pressed={open}
      aria-expanded={open}
    >
      {/* header row with bulb */}
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "grid h-8 w-8 place-items-center rounded-xl border transition-colors",
            open ? "bg-amber-200/70" : "bg-white"
          )}
        >
          <Lightbulb
            className={cn(
              "h-4 w-4 transition-colors",
              open ? "text-zinc-900" : "text-zinc-500"
            )}
          />
        </span>

        <div className="min-w-0">
          <div className="text-xs font-semibold">{title}</div>
          {!open ? <div className="text-[11px] text-muted-foreground">Click to expand</div> : null}
        </div>
      </div>

      {/* lines (first two always visible) */}
      <div className="mt-2 space-y-1">
        {primary.map((l) => (
          <div key={l} className="text-[11px] text-muted-foreground">
            {l}
          </div>
        ))}

        {/* extra lines animate in/out */}
        <AnimatePresence initial={false}>
          {open && extra.length > 0 ? (
            <motion.div
              key="extra"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden pt-1"
            >
              <div className="space-y-1">
                {extra.map((l) => (
                  <div key={l} className="text-[11px] text-muted-foreground">
                    {l}
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}
