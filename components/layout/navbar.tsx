"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

import { useSitePreferences } from "@/components/providers/site-preferences";
import { THEMES, type ThemeId, THEME_STORAGE_KEY } from "@/lib/themes";
import { cn } from "@/lib/utils";

const links = [
  { label: "Work", href: "/#work" },
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "Contact", href: "/#contact" },
];

function applyTheme(id: ThemeId) {
  document.documentElement.dataset.theme = id;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch {}
}

function readTheme(): ThemeId {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;
    const ok = THEMES.some((t) => t.id === saved);
    return ok && saved ? saved : "classic";
  } catch {
    return "classic";
  }
}

function ThemeDots(props: { className?: string; size?: "sm" | "md" }) {
  const { className, size = "sm" } = props;
  const [theme, setTheme] = useState<ThemeId>("classic");

  useEffect(() => {
    const initial = readTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const btnSize = size === "md" ? "h-6 w-6" : "h-5 w-5";

  const palettes = useMemo(
    () =>
      THEMES.map((t) => {
        const a = t.swatches?.[0] ?? "hsl(var(--ui-glow) / 1)";
        const b = t.swatches?.[1] ?? "hsl(var(--ui-glow) / 0.75)";
        const c = t.swatches?.[2] ?? "hsl(var(--ui-glow) / 0.55)";
        return {
          id: t.id,
          name: t.name,
          bg: `conic-gradient(from 180deg, ${a}, ${b}, ${c}, ${a})`,
        };
      }),
    []
  );

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="hidden lg:inline text-xs text-zinc-600">Theme</span>

      <div className="flex items-center gap-2">
        {palettes.map((p) => {
          const active = p.id === theme;

          const soft = `radial-gradient(65% 65% at 35% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.75)),
                ${p.bg}`;

  return (
    <button
      key={p.id}
      type="button"
      onClick={() => {
        setTheme(p.id);
        applyTheme(p.id);
      }}
      aria-label={`Theme: ${p.name}`}
      aria-pressed={active}
      className={cn(
        "relative rounded-full border overflow-hidden",
        "transition-transform hover:-translate-y-[1px] active:translate-y-0",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        btnSize
      )}
      style={{
        // much softer + whiter than the full conic coin
        backgroundImage: soft,
        backgroundBlendMode: "screen",
        borderColor: "rgba(0,0,0,0.22)",
        boxShadow:
          "inset 0 0 0 1px rgba(255,255,255,0.65), 0 6px 18px rgba(0,0,0,0.08)",
        filter: "saturate(0.85) brightness(1.08)",
      }}
    >
      {/* inner soft ring (matches the lower dots vibe) */}
      <span
        aria-hidden
        className="absolute inset-[2px] rounded-full"
        style={{
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.10)",
          background: "rgba(255,255,255,0.55)",
          mixBlendMode: "soft-light",
        }}
      />

      {/* active outline: same accent behavior */}
      {active ? (
        <span
          aria-hidden
          className="absolute -inset-1 rounded-full"
          style={{
            boxShadow: "0 0 0 2px hsl(var(--ui-glow) / 0.45)",
          }}
        />
      ) : null}

      <span className="sr-only">{p.name}</span>
    </button>
          );
        })}
      </div>
    </div>
  );
}

export function Navbar() {
  const { focus } = useSitePreferences();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <Container className="flex h-16 items-center justify-between gap-3">
        {/* Logo / Studio */}
        <Link
          href="/#top"
          className="ui-accent-underline inline-flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <span>Studio</span>

          {focus ? (
            <span className="ui-accent-pill rounded-full border px-2 py-0.5 text-[11px] font-medium text-zinc-600">
              {focus}
            </span>
          ) : null}
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
                <Button variant="outline" size="icon" aria-label="Open menu">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-72">
                <VisuallyHidden>
                  <SheetTitle>Menu</SheetTitle>
                </VisuallyHidden>

                <div className="mt-6 grid gap-3">
                  {links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="ui-accent-underline text-sm text-zinc-700 hover:text-zinc-900"
                    >
                      {l.label}
                    </Link>
                  ))}

                  <Button asChild className="mt-2">
                    <Link href="/#contact" className="ui-accent-cta">
                      Get a quote
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  );
}
