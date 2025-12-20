"use client";
import { LogoKineticGrid } from "@/components/brand/logo-kinetic-grid";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

import { THEMES, type ThemeId, THEME_STORAGE_KEY } from "@/lib/themes";
import { cn } from "@/lib/utils";

const links = [
  { label: "Work", href: "/#work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/#contact" },
];

const STUDIO_LOGO_HIDE_DELAY_MS = 1600;

function applyTheme(id: ThemeId) {
  document.documentElement.dataset.theme = id;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch {
    // noop
  }
}

function ThemeDots({
  className,
  size = "sm",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const [active, setActive] = useState<ThemeId>("day");

  useEffect(() => {
    const stored = (typeof window !== "undefined"
      ? (localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null)
      : null) ?? null;

    const initial = stored && THEMES.some((t) => t.id === stored) ? stored : "day";
    setActive(initial);
    applyTheme(initial);
  }, []);

  const dotSize = size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3";

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {THEMES.map((t) => {
        const isActive = active === t.id;

        return (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setActive(t.id);
              applyTheme(t.id);
            }}
            className={cn(
              "relative inline-flex items-center justify-center rounded-full",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              "focus-visible:ring-[color:var(--ui-glow)] focus-visible:ring-offset-white",
              dotSize
            )}
            aria-label={`Theme: ${t.name}`}
          >
            <span
              className={cn(
                "rounded-full transition",
                dotSize,
                isActive ? "opacity-100" : "opacity-70"
              )}
              style={{
                background: t.bg,
                boxShadow: isActive ? "0 0 0 2px rgb(255 255 255 / 0.9), 0 0 0 4px rgb(var(--ui-glow) / 0.45)" : undefined,
              }}
            />
            {isActive ? (
              <span
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-zinc-500"
                aria-hidden="true"
              >
                •
              </span>
            ) : null}

            <span className="sr-only">{t.name}</span>
          </button>
        );
      })}
    </div>
  );
}

export function Navbar() {
  const [showStudioLogo, setShowStudioLogo] = useState(false);
  const hideStudioLogoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerStudioLogo = () => {
    setShowStudioLogo(true);
    if (hideStudioLogoTimerRef.current) clearTimeout(hideStudioLogoTimerRef.current);
    hideStudioLogoTimerRef.current = setTimeout(
      () => setShowStudioLogo(false),
      STUDIO_LOGO_HIDE_DELAY_MS
    );
  };

  const onStudioPointerDown = (e: PointerEvent<HTMLAnchorElement>) => {
    // Ignore right/middle clicks.
    if (e.button !== 0) return;
    triggerStudioLogo();
  };

  const onStudioKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
    // Keyboard “interaction” should also trigger it.
    if (e.key === "Enter" || e.key === " ") triggerStudioLogo();
  };

  useEffect(() => {
    return () => {
      if (hideStudioLogoTimerRef.current) clearTimeout(hideStudioLogoTimerRef.current);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-200/60 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <Container className="flex h-16 items-center justify-between gap-3">
        {/* Logo / Studio */}
        <Link
          href="/#top"
          onPointerDown={onStudioPointerDown}
          onKeyDown={onStudioKeyDown}
          className="ui-accent-underline inline-flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <span className="inline-flex items-center gap-2">
            {/* Reserve space to avoid layout shift when the logo appears/disappears */}
            <span className="relative inline-flex h-5 w-5 items-center justify-center">
              <AnimatePresence initial={false}>
                {showStudioLogo ? (
                  <motion.span
                    key="studioLogo"
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.8, y: 1 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 1 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    <LogoKineticGrid
                      size={20}
                      className="text-zinc-900"
                      intro="bloom"
                      hoverRepel={false}
                    />
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </span>

            <span>Studio</span>
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

        {/* Right cluster (ALWAYS visible on mobile + desktop) */}
        <div className="flex items-center gap-2">
          {/* pinned theme dots (outside hamburger) */}
          <ThemeDots className="mr-1" size="sm" />

          {/* CTA always visible */}
          <Button asChild size="sm">
            <Link href="/#contact" className="ui-accent-cta">
              Get a quote
            </Link>
          </Button>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-2xl"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[320px] p-0">
                <VisuallyHidden>
                  <SheetTitle>Menu</SheetTitle>
                </VisuallyHidden>

                <div className="flex h-full flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b px-4 py-4">
                    <div>
                      <div className="text-sm font-semibold tracking-tight">Studio</div>
                      <div className="mt-1 text-xs text-zinc-600">Navigation</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <ThemeDots size="md" />
                    </div>
                  </div>

                  {/* Links */}
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
                            <span className="text-zinc-400 transition group-hover:text-zinc-700">
                              →
                            </span>
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t px-4 py-4">
                    <SheetClose asChild>
                      <Button asChild className="w-full">
                        <Link href="/#contact">Get a quote</Link>
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
