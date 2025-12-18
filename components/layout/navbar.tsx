"use client";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useSitePreferences } from "@/components/providers/site-preferences";

const links = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const { focus } = useSitePreferences();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <Container className="flex h-16 items-center justify-between">
        {/* Logo / Studio */}
        <a
          href="#top"
          className="ui-accent-underline inline-flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <span>Studio</span>

          {focus ? (
            <span className="ui-accent-pill rounded-full border px-2 py-0.5 text-[11px] font-medium text-zinc-600">
              {focus}
            </span>
          ) : null}
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm text-zinc-600 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="ui-accent-underline transition-colors hover:text-zinc-900 focus-visible:outline-none"
            >
              {l.label}
            </a>
          ))}

          {/* CTA: apply accent glow to the anchor (most reliable with asChild) */}
          <Button asChild size="sm">
            <a href="#contact" className="ui-accent-cta">
              Get a quote
            </a>
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
                  <a
                    key={l.href}
                    href={l.href}
                    className="ui-accent-underline text-sm text-zinc-700 hover:text-zinc-900"
                  >
                    {l.label}
                  </a>
                ))}

                <Button asChild className="mt-2">
                  <a href="#contact" className="ui-accent-cta">
                    Get a quote
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
