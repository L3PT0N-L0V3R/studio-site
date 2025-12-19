"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSitePreferences } from "@/components/providers/site-preferences";

const links = [
  // Always resolve to the homepage sections, regardless of current route.
  { label: "Work", href: "/#work" },
  { label: "Services", href: "/#services" },
  { label: "Process", href: "/#process" },
  { label: "Contact", href: "/#contact" },
];

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
                  <SheetClose asChild key={l.href}>
                    <Link
                      href={l.href}
                      className="ui-accent-underline text-sm text-zinc-700 hover:text-zinc-900"
                    >
                      {l.label}
                    </Link>
                  </SheetClose>
                ))}

                <Button asChild className="mt-2">
                  <SheetClose asChild>
                    <Link href="/#contact" className="ui-accent-cta">
                      Get a quote
                    </Link>
                  </SheetClose>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
