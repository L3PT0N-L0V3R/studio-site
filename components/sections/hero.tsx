"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Parallax } from "@/components/motion/parallax";
import { cn } from "@/lib/utils";
import { Lightbulb } from "lucide-react";
import { Magnetic } from "@/components/motion/magnetic";
import { positioning } from "@/content/positioning";

export function Hero() {
  return (
    <section className="pt-16 sm:pt-20">
      <Container className="pb-10 sm:pb-14">
        <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Web design + engineering for modern brands
            </div>

            <Parallax offset={36}>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                Premium websites that convert—plus the systems behind them.
              </h1>
            </Parallax>

            <p className="mt-4 text-lg text-muted-foreground">
              We rebuild websites for businesses that outgrew theirs—then we connect the systems
              behind it.
            </p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border bg-white p-4">
                <div className="text-sm font-semibold">We’re best for</div>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <li>Teams with a proven offer that need a higher-converting site</li>
                  <li>Businesses ready to connect intake → CRM → automation → reporting</li>
                  <li>Owners who care about performance, clarity, and maintainability</li>
                </ul>
              </div>

              <div className="rounded-2xl border bg-white p-4">
                <div className="text-sm font-semibold">Not for</div>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  <li>Cheapest-possible builds or “just make it look cool”</li>
                  <li>Projects without decision-makers or approval bandwidth</li>
                  <li>Complex systems without owned process/content</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic>
                <Button size="lg">Get a quote</Button>
              </Magnetic>
              <Magnetic>
                <Button variant="outline" size="lg">
                  View work
                </Button>
              </Magnetic>
            </div>
          </div>

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

              <div className="mt-4 grid gap-3 text-sm">
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
  const [on, setOn] = useState(false);

  const glowStyle = useMemo(() => {
    if (!on) return undefined;
    return {
      background:
        "radial-gradient(600px circle at 30% 30%, rgba(250, 204, 21, 0.25), transparent 55%), radial-gradient(500px circle at 70% 60%, rgba(252, 211, 77, 0.18), transparent 60%)",
    } as React.CSSProperties;
  }, [on]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        className={cn(
          "relative flex h-11 w-11 items-center justify-center rounded-2xl border bg-white transition",
          "hover:shadow-md active:scale-[0.98]"
        )}
        aria-pressed={on}
        aria-label={on ? "Turn highlight glow off" : "Turn highlight glow on"}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 rounded-2xl opacity-0 transition-opacity"
          style={glowStyle}
        />
        <Lightbulb className="h-5 w-5" />
      </button>

      <div className="mt-3">
        <div className="text-sm font-semibold">{title}</div>
        <div className="mt-1 text-xs text-muted-foreground">Tap for a quick preview</div>
        {on ? (
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {lines.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
