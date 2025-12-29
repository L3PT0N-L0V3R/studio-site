"use client";
import { LogoKineticGrid } from "@/components/brand/logo-kinetic-grid";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

import { THEMES, type ThemeId, THEME_STORAGE_KEY } from "@/lib/themes";
import { cn } from "@/lib/utils";

const links = [
  { label: "Process", href: "/#process" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
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

          // Softer / whiter preview
          const soft = `radial-gradient(65% 65% at 35% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.72)),
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
                backgroundImage: soft,
                backgroundBlendMode: "screen",
                borderColor: "rgba(0,0,0,0.20)",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.65)",
                filter: "saturate(0.82) brightness(1.08)",
              }}
            >
              <span
                aria-hidden
                className="absolute inset-[2px] rounded-full"
                style={{
                  boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.10)",
                  background: "rgba(255,255,255,0.55)",
                  mixBlendMode: "soft-light",
                }}
              />

              {/* Active ring only — no extra dot indicator */}
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
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <Container className="flex h-16 items-center justify-between gap-3">
        {/* Logo / Studio */}
        <Link
          href="/#top"
          className="ui-accent-underline inline-flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <span className="inline-flex items-center gap-2">
            <LogoKineticGrid size={20} className="text-zinc-900" />
            <span>Qube Studios</span>
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
        <div className="flex items-center gap-2">
          {/* Theme dots: stay in navbar, but hide while mobile menu is open */}
          <ThemeDots
            className={cn(
              "mr-1 transition-opacity duration-150",
              menuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            )}
            size="sm"
          />

          {/* CTA always visible */}
          <Button asChild size="sm">
            <Link href="/#contact" className="ui-accent-cta">
              Get a quote
            </Link>
          </Button>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open menu">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-[320px] p-0 sm:w-[360px]">
                <VisuallyHidden>
                  <SheetTitle>Menu</SheetTitle>
                </VisuallyHidden>

                <div className="relative flex h-full flex-col bg-white">
                  {/* subtle themed wash behind content */}
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

                  {/* Header */}
                  <div className="relative border-b px-5 py-4">
                    <div className="text-sm font-semibold tracking-tight text-zinc-900">Studio</div>
                    <div className="mt-1 text-xs text-zinc-600">Navigation</div>
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
                            <span className="text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-zinc-600">
                              →
                            </span>
                          </Link>
                        </SheetClose>
                      ))}
                    </div>
                  </div>

                  {/* Footer CTA (pinned) */}
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
