"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Parallax } from "@/components/motion/parallax";
import { cn } from "@/lib/utils";
import { Lightbulb } from "lucide-react";
import { Magnetic } from "@/components/motion/magnetic";


export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b">
      <Container className="py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <div className="space-y-5">
              <p className="text-sm font-medium text-zinc-600">
                Web design + engineering for modern brands
              </p>

              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Premium websites with motion, speed, and clean conversion flow.
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-zinc-600">
                We build high-end, mobile-first sites with controlled interaction design and strong
                fundamentals (SEO, performance, accessibility).
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Magnetic strength={22}>
                  <Button asChild>
                    <a href="#contact">Get a quote</a>
                  </Button>
                </Magnetic>
                <Magnetic strength={16} hoverScale={1.008}>
                  <Button variant="outline" asChild>
                    <a href="#work">View work</a>
                  </Button>
                </Magnetic>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Parallax>
              <HighlightBulb
                title="Idea engine"
                lines={[
                  "Scroll narratives + micro-interactions",
                  "Mobile-first, thumb-friendly UI",
                  "Performance budgets + SEO baseline",
                  "Modular components for fast iteration",
                ]}
              />
            </Parallax>
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

  // Subtle, warm gradient glow when “on”
  const glowStyle = useMemo(() => {
    if (!on) return undefined;
    return {
      background:
        "radial-gradient(600px circle at 30% 30%, rgba(250, 204, 21, 0.25), transparent 55%), radial-gradient(500px circle at 70% 60%, rgba(252, 211, 77, 0.18), transparent 60%)",
    } as React.CSSProperties;
  }, [on]);

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-zinc-600">{title}</div>
          <div className="mt-1 text-base font-semibold tracking-tight text-zinc-900">
            Tap for a quick preview
          </div>
        </div>

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
          {/* Ambient glow layer */}
          <span
            className={cn(
              "pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300"
            )}
            style={glowStyle}
          />
          <Lightbulb
            className={cn(
              "relative h-5 w-5 transition-colors",
              on ? "text-amber-500" : "text-zinc-700"
            )}
          />
        </button>
      </div>

      <div className="mt-5">
        <ul className="space-y-3 text-sm text-zinc-700">
          {lines.map((l) => (
            <li key={l} className="flex gap-3">
              <span
                className={cn(
                  "mt-[7px] inline-block h-1.5 w-1.5 rounded-full",
                  on ? "bg-amber-500" : "bg-zinc-900"
                )}
              />
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
