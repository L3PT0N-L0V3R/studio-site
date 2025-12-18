"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { cn } from "@/lib/utils";
import { ConfiguratorDialog } from "@/components/overlays/configurator-dialog";
import { useGridGap, useSectionSpacing } from "@/components/providers/ui-config";
import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

type HeroPanelId = "bestFor" | "notFor";

export function Hero() {
  const sectionPad = useSectionSpacing();
  const gap = useGridGap();

  const [openPanel, setOpenPanel] = useState<HeroPanelId | null>(null);

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

  const panelContent = useMemo(() => {
    return {
      bestFor: {
        title: positioning.bestForTitle,
        subtitle: "Projects where systems + clarity matter.",
        bullets: positioning.bestFor,
        noteTitle: "Typical outcomes",
        notes: [
          "Higher quality leads",
          "Cleaner conversion paths",
          "Less operational friction as you scale",
        ],
      },
      notFor: {
        title: positioning.notForTitle,
        subtitle: "Projects that don’t benefit from systems-first work.",
        bullets: positioning.notFor,
        noteTitle: "What we’ll recommend instead",
        notes: [
          "A simpler brochure build",
          "A focused landing page",
          "A phased plan if budget is tight",
        ],
      },
    } as const;
  }, [positioning.bestFor, positioning.bestForTitle, positioning.notFor, positioning.notForTitle]);

  useEffect(() => {
    if (!openPanel) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenPanel(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openPanel]);

  const selected = openPanel ? panelContent[openPanel] : null;

  return (
    <section className={cn(sectionPad, "border-b relative overflow-hidden isolate")} id="top">
      {/* Hero background wash (contained, no bleed, no page widening) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {/* soft left bloom */}
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_18%_18%,hsl(var(--tone-2)/0.12),transparent_60%)]" />
        {/* soft right bloom */}
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_82%_22%,hsl(var(--tone-5)/0.10),transparent_62%)]" />
        {/* subtle top veil so it feels “premium” */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[hsl(var(--tone-2)/0.06)] to-transparent" />
      </div>

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

            <div className={cn("mt-8 grid gap-4 sm:grid-cols-2", gap)}>
              {/* Best for (clickable) */}
              <button
                type="button"
                onClick={() => setOpenPanel("bestFor")}
                className={cn(
                  "group rounded-2xl border bg-white p-4 text-left transition-all",
                  "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300",
                  "focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                )}

                aria-haspopup="dialog"
                aria-expanded={openPanel === "bestFor"}
              >
                <div className="text-sm font-semibold">{positioning.bestForTitle}</div>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  {positioning.bestFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="mt-3 text-xs text-muted-foreground/80">Click to expand</div>
              </button>

              {/* Not for (clickable) */}
              <button
                type="button"
                onClick={() => setOpenPanel("notFor")}
                className={cn(
                  "group rounded-2xl border bg-white p-4 text-left transition-all",
                  "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300",
                  "focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                )}

                aria-haspopup="dialog"
                aria-expanded={openPanel === "notFor"}
              >
                <div className="text-sm font-semibold">{positioning.notForTitle}</div>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  {positioning.notFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="mt-3 text-xs text-muted-foreground/80">Click to expand</div>
              </button>
            </div>

            {/* Primary actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Magnetic strength={16}>
                <Button asChild>
                  <a className="ui-accent-cta" href="#contact">
                    Get a quote
                  </a>
                </Button>
              </Magnetic>

              <Magnetic strength={16} hoverScale={1.008}>
                <Button variant="outline" asChild>
                  <a className="ui-accent-underline" href="#work">
                    View work
                  </a>
                </Button>
              </Magnetic>

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

        {/* Modal for the two clickable cards */}
        <AnimatePresence>
          {selected ? (
            <>
              <motion.button
                type="button"
                aria-label="Close dialog"
                className="fixed inset-0 z-50 cursor-default bg-black/20 backdrop-blur-[1px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpenPanel(null)}
              />

              <motion.div
                className="fixed inset-0 z-50 grid place-items-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="w-full max-w-xl overflow-hidden rounded-2xl border bg-white shadow-xl"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 520, damping: 42, mass: 0.85 }}
                  role="dialog"
                  aria-modal="true"
                  aria-label={selected.title}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-start justify-between gap-4 p-6">
                    <div className="min-w-0">
                      <div className="text-sm text-muted-foreground">{selected.subtitle}</div>
                      <div className="mt-1 text-2xl font-semibold tracking-tight">
                        {selected.title}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setOpenPanel(null)}
                      className="shrink-0 rounded-xl border bg-white px-3 py-2 text-sm hover:shadow-sm"
                    >
                      Close
                    </button>
                  </div>

                  <div className="border-t px-6 py-5">
                    <div className="text-sm font-semibold">Details</div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {selected.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>

                    <div className="mt-5">
                      <div className="text-sm font-semibold">{selected.noteTitle}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selected.notes.map((n) => (
                          <Badge key={n} variant="secondary">
                            {n}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>
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
    } satisfies CSSProperties;
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
        open ? "ui-ambient-active ui-border-accent" : "border-border",
        open ? "w-[280px]" : "w-[220px]"
      )}
      style={glowStyle}
      aria-pressed={open}
      aria-expanded={open}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "grid h-8 w-8 place-items-center rounded-xl border transition-colors",
            open ? "bg-[hsl(var(--ui-glow)/0.14)]" : "bg-white"
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
          {!open ? (
            <div className="text-[11px] text-muted-foreground">Click to expand</div>
          ) : null}
        </div>
      </div>

      <div className="mt-2 space-y-1">
        {primary.map((l) => (
          <div key={l} className="text-[11px] text-muted-foreground">
            {l}
          </div>
        ))}

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
