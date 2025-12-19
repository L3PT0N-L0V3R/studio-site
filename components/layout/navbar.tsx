"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
  { label: "Services", href: "/#services" },
  { label: "Process", href: "/#process" },
  { label: "Contact", href: "/#contact" },
];

function applyTheme(id: ThemeId) {
  document.documentElement.dataset.theme = id;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch {
    // ignore (private mode / blocked storage)
  }
}

function readTheme(): ThemeId {
  if (typeof window === "undefined") return "classic";
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;
    return saved ?? "classic";
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

  // Match the existing “bubble” sizing feel
  const outerSize = size === "md" ? "h-7 w-7" : "h-6 w-6";
  const innerSize = size === "md" ? "h-[18px] w-[18px]" : "h-[16px] w-[16px]";

  return (
    <div className={cn("flex items-center gap-1.5", className)} aria-label="Color theme">
      {THEMES.map((t) => {
        const active = t.id === theme;

        const a = t.swatches?.[0] ?? "hsl(0 0% 100%)";
        const b = t.swatches?.[1] ?? a;
        const c = t.swatches?.[2] ?? b;

        return (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTheme(t.id);
              applyTheme(t.id);
            }}
            className={cn(
              // Outer bubble (matches your existing selector look)
              "grid place-items-center rounded-full border bg-white",
              outerSize,
              "transition-transform hover:-translate-y-[1px]",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
              active
                ? "border-[hsl(var(--ui-glow)/0.55)] ring-2 ring-[hsl(var(--ui-glow)/0.35)]"
                : "border-zinc-300"
            )}
            aria-label={`Theme: ${t.name}`}
            aria-pressed={active}
            title={t.name}
          >
            {/* Inner swatch (subtle color cue, not a loud fill) */}
            <span
              aria-hidden
              className={cn("block rounded-full opacity-80", innerSize)}
              style={{
                backgroundImage: `linear-gradient(135deg, ${a}, ${b} 55%, ${c})`,
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.75)",
              }}
            />
            <span className="sr-only">{t.name}</span>
          </button>
        );
      })}
    </div>
  );
}


export function Navbar() {
  const { focus } = useSitePreferences();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <Container className="flex h-16 items-center justify-between">
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

          {/* Theme dots pinned in navbar (desktop) */}
          <div className="ml-1 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Theme</span>
            <ThemeDots />
          </div>

          <Button asChild size="sm">
            <Link href="/#contact" className="ui-accent-cta">
              Get a quote
            </Link>
          </Button>
        </nav>

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

                {/* Theme dots in menu (mobile) */}
                <div className="mt-4 rounded-2xl border bg-white p-3">
                  <div className="text-sm font-semibold">Color theme</div>
                  <div className="mt-1 text-sm text-muted-foreground">Choose an accent palette.</div>
                  <div className="mt-3">
                    <ThemeDots size="md" />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
