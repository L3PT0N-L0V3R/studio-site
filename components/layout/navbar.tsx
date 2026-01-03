"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, useAnimationControls, useReducedMotion, type Variants } from "framer-motion";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
  { label: "Process", href: "/#process" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/#contact" },
];

function NavbarDotMark({
  size = 20,
  className,
  controls,
}: {
  size?: number;
  className?: string;
  controls: ReturnType<typeof useAnimationControls>;
}) {
  const reduceMotion = useReducedMotion();

  const dots = useMemo(() => {
    const xs = [7, 12, 17];
    const ys = [7, 12, 17];
    const out: Array<{ i: number; cx: number; cy: number; phase: number }> = [];
    let i = 0;
    const phaseMap = [
      [0, 1, 2],
      [1, 2, 3],
      [2, 3, 4],
    ];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        out.push({ i, cx: xs[c], cy: ys[r], phase: phaseMap[r][c] });
        i++;
      }
    }
    return out;
  }, []);

  const BEZIER: [number, number, number, number] = [0.2, 0.85, 0.2, 1];

  const circleVariants: Variants = {
    idle: { y: 0, scale: 1, opacity: 1 },
    tap: (phase: number) => {
      if (reduceMotion) {
        return { y: 0, scale: 1, opacity: 1, transition: { duration: 0 } };
      }
      return {
        y: [0, -4.8, 1.1, -2.2, 0],
        scale: [1, 1.18, 0.98, 1.08, 1],
        opacity: [1, 1, 0.98, 1, 1],
        transition: {
          delay: phase * 0.07,
          duration: 0.72,
          times: [0, 0.22, 0.46, 0.68, 1],
          ease: BEZIER,
        },
      };
    },
  };

  return (
    <motion.svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      {dots.map((d) => (
        <motion.circle
          key={d.i}
          cx={d.cx}
          cy={d.cy}
          r={2.25}
          fill="currentColor"
          variants={circleVariants}
          initial="idle"
          animate={controls}
          custom={d.phase}
        />
      ))}
    </motion.svg>
  );
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const markControls = useAnimationControls();

  const runMark = async () => {
    if (reduceMotion) return;
    await markControls.start("tap");
    markControls.start("idle");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <Container className="flex h-16 min-w-0 items-center justify-between gap-2">
        {/* Brand */}
        <Link
          href="/#top"
          className={cn(
            "ui-accent-underline inline-flex min-w-0 items-center gap-2",
            "-ml-2 rounded-xl px-2 py-2 whitespace-nowrap"
          )}
          onPointerDown={runMark}
          onClick={runMark}
        >
          <span className="inline-flex items-center gap-2 text-[13px] font-semibold tracking-tight text-zinc-900 sm:text-sm">
            <NavbarDotMark size={20} controls={markControls} />
            <span className="max-[430px]:hidden">Qube Studios</span>
            <span className="hidden max-[430px]:inline">Qube</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm text-zinc-600 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="ui-accent-underline transition-colors hover:text-zinc-900 focus-visible:outline-none"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="flex shrink-0 items-center gap-2 max-[430px]:gap-1.5">
          <Button asChild size="sm" className="shrink-0">
            <Link href="/#contact" className="ui-accent-cta">
              <span className="max-[430px]:hidden">Get a quote</span>
              <span className="hidden max-[430px]:inline">Quote</span>
            </Link>
          </Button>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open menu" className="shrink-0">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[320px] p-0 sm:w-[360px]">
                <VisuallyHidden>
                  <SheetTitle>Menu</SheetTitle>
                </VisuallyHidden>

                <div className="relative flex h-full flex-col bg-white">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-60"
                    style={{ backgroundImage: "var(--hero-wash)" }}
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.96) 30%, rgba(255,255,255,1) 70%)",
                    }}
                  />

                  <div className="relative border-b px-5 py-4">
                    <div className="text-sm font-semibold tracking-tight text-zinc-900">Studio</div>
                    <div className="mt-1 text-xs text-zinc-600">Navigation</div>
                  </div>

                  <div className="relative flex-1 px-4 py-4">
                    <div className="grid gap-2">
                      {links.map((l) => (
                        <SheetClose asChild key={l.href}>
                          <Link
                            href={l.href}
                            className={cn(
                              "group flex items-center justify-between rounded-2xl border bg-white/70 px-4 py-3",
                              "text-sm font-medium text-zinc-900 shadow-sm",
                              "transition hover:bg-white hover:shadow-md hover:shadow-black/10"
                            )}
                          >
                            <span>{l.label}</span>
                            <span className="text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-zinc-600">
                              →
                            </span>
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  </div>

                  <div className="relative border-t px-4 py-4">
                    <SheetClose asChild>
                      <Button asChild className="h-11 w-full rounded-2xl">
                        <Link href="/#contact" className="ui-accent-cta">
                          Get a quote
                        </Link>
                      </Button>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  );
}
