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
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <Container className="flex h-14 items-center justify-between">
        <a href="#top" className="text-sm font-semibold tracking-tight">
          Studio
          {focus ? (
            <span className="ml-2 rounded-full border px-2 py-0.5 text-[11px] font-medium text-zinc-600">
              {focus}
            </span>
          ) : null}
        </a>

        <nav className="hidden items-center gap-6 text-sm text-zinc-600 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-zinc-900">
              {l.label}
            </a>
          ))}
          <Button asChild size="sm">
            <a href="#contact">Get a quote</a>
          </Button>
        </nav>

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
                  <a key={l.href} href={l.href} className="text-sm">
                    {l.label}
                  </a>
                ))}
                <Button asChild className="mt-2">
                  <a href="#contact">Get a quote</a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
