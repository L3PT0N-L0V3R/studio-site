"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type TierKey = "starter" | "growth" | "systems";

function toTierKey(name: string): TierKey {
  const n = name.trim().toLowerCase();
  if (n.includes("starter")) return "starter";
  if (n.includes("growth") || n.includes("business")) return "growth";
  return "systems"; // premium / systems / advanced
}

const DETAILS: Record<
  TierKey,
  {
    title: string;
    subtitle: string;
    who: string[];
    deliverables: string[];
    timeline: string[];
    included: string[];
    addons: string[];
    youProvide: string[];
    faq: { q: string; a: string }[];
    badge?: string;
  }
> = {
  starter: {
    title: "Starter",
    subtitle: "A clean, modern site that looks premium and converts—without overbuilding.",
    who: [
      "No website yet, or your current site is hurting trust",
      "You want a fast, clean launch with a clear next step (call/quote/booking)",
      "You want something easy to evolve later",
    ],
    deliverables: [
      "Mobile-first design pass (modern typography + spacing system)",
      "Core pages (landing + up to ~3 key pages depending on scope)",
      "Contact / quote flow (form routed where you want)",
      "SEO baseline (metadata, headings, sitemap/robots as applicable)",
      "Analytics baseline (basic tracking + conversion event)",
    ],
    timeline: [
      "Kickoff + content checklist (same day)",
      "Design direction + first build pass (3–7 days)",
      "Polish + launch readiness (1–3 days)",
    ],
    included: [
      "Performance-first build (fast load, clean structure)",
      "Accessibility basics (labels, contrast, keyboard-friendly)",
      "Simple handoff plan so updates stay painless",
    ],
    addons: [
      "Copywriting / messaging polish",
      "Photo cleanup / light brand refresh",
      "Booking integration",
      "Lead routing rules (e.g., different forms to different inboxes)",
    ],
    youProvide: [
      "Logo (or we can create a simple one)",
      "Photos (or we can source directionally)",
      "Services list + basic business info",
      "Preferred contact method + access to domain (if launching)",
    ],
    faq: [
      {
        q: "Can we start with just a landing page?",
        a: "Yes—Starter can be a single high-end landing page and expand later.",
      },
      {
        q: "Will it look good on mobile?",
        a: "Yes—mobile-first is a non-negotiable. Thumb-friendly layout and spacing are built in.",
      },
      {
        q: "Can I update it later?",
        a: "Yes—your site is component-based and designed to evolve without rework.",
      },
    ],
    badge: "Fast launch",
  },

  growth: {
    title: "Growth",
    subtitle: "Designed to increase leads/bookings/sales with stronger structure and tracking.",
    who: [
      "You already have demand but the site isn’t converting",
      "You need better flows: booking, quoting, lead capture, or sales",
      "You want measurable improvements (events, funnels, iteration)",
    ],
    deliverables: [
      "Conversion-focused structure (clear primary CTA + supporting paths)",
      "Multi-page experience (typically 5–10 pages depending on scope)",
      "On-page SEO pass (page targeting + internal structure)",
      "Tracking plan (events, key conversions, basic funnel visibility)",
      "Iteration-ready setup (easy to test improvements over time)",
    ],
    timeline: [
      "Kickoff + goals + analytics plan (1–2 days)",
      "Design + build in sprints (1–2 weeks typical)",
      "QA + launch + tracking validation (1–3 days)",
    ],
    included: [
      "Performance tuned (no bloat; motion is controlled)",
      "Reusable section system for fast iteration",
      "Optional CMS-ready structure (if you want it)",
    ],
    addons: [
      "Shopify integration / storefront polish",
      "Advanced booking + intake forms",
      "Lead scoring / qualification logic",
      "Email sequences + follow-up automation hooks",
    ],
    youProvide: [
      "Your target customer + primary goals (calls, bookings, purchases)",
      "Current analytics access (if you have it)",
      "Offer/service details + pricing guidance (even rough)",
      "Brand assets or examples you like",
    ],
    faq: [
      {
        q: "Can you improve an existing site?",
        a: "Yes—often Growth starts with fixing conversion structure and simplifying the UX.",
      },
      {
        q: "Do you do A/B testing?",
        a: "We can set you up A/B-ready. Actual tests depend on traffic volume and tools.",
      },
      {
        q: "Can you connect Shopify?",
        a: "Yes—either a full Shopify build or integration depending on what you need.",
      },
    ],
    badge: "Conversion",
  },

  systems: {
    title: "Systems",
    subtitle: "When the website is the front door to real workflow: CRM, automation, internal tools.",
    who: [
      "You need a website + operational improvement (workflow, CRM, automation)",
      "Your intake / quoting / scheduling is messy or manual",
      "You want an “app-like” experience that stays smooth and maintainable",
    ],
    deliverables: [
      "Everything in Growth (structure, tracking, performance)",
      "Systems discovery (identify bottlenecks + opportunities)",
      "CRM + pipeline alignment (including white-label CRM option if needed)",
      "Automation hooks (routing, notifications, internal workflows)",
      "Optional internal tools (scanning systems, dashboards, portals—scoped)",
    ],
    timeline: [
      "Discovery + mapping (3–7 days depending on complexity)",
      "Build sprints (2–6+ weeks depending on systems scope)",
      "Launch + handoff + stabilization (1–2 weeks depending on integrations)",
    ],
    included: [
      "Architecture built for change (modular, versionable, documented)",
      "Security + access control considerations (as needed)",
      "Performance budgets maintained even with complex features",
    ],
    addons: [
      "Custom dashboards",
      "Role-based portals",
      "Inventory / scanning workflows",
      "Data migration + cleanup",
      "Advanced analytics + attribution planning",
    ],
    youProvide: [
      "How leads enter today (and where they get stuck)",
      "Any tools you already use (CRM, spreadsheets, booking, POS)",
      "Who needs access internally + what actions they take",
      "Approval pathway + a single decision-maker contact",
    ],
    faq: [
      {
        q: "Is this overkill for small businesses?",
        a: "Sometimes. If you mainly need a clean site and leads, Growth is usually the best fit.",
      },
      {
        q: "Can we phase this?",
        a: "Yes—common approach: launch Growth first, then layer Systems improvements in phases.",
      },
      {
        q: "Do you build custom tools?",
        a: "Yes—when it’s justified. The goal is always to reduce friction and improve throughput.",
      },
    ],
    badge: "Automation",
  },
};

export function ServiceTierDialog({
  open,
  onOpenChange,
  tierName,
  tierPrice,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tierName: string;
  tierPrice?: string;
}) {
  const key = toTierKey(tierName);
  const d = DETAILS[key];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <DialogTitle className="text-xl">{d.title}</DialogTitle>
              <DialogDescription className="mt-1 text-sm text-zinc-600">
                {d.subtitle}
              </DialogDescription>
            </div>

            <div className="flex items-center gap-2">
              {d.badge ? <Badge variant="secondary">{d.badge}</Badge> : null}
              {tierPrice ? <Badge variant="outline">{tierPrice}</Badge> : null}
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 grid gap-6">
          <Section title="Best for">
            <Bullets items={d.who} />
          </Section>

          <Section title="Deliverables">
            <Bullets items={d.deliverables} />
          </Section>

          <div className="grid gap-6 sm:grid-cols-2">
            <Section title="Typical timeline">
              <Bullets items={d.timeline} />
            </Section>
            <Section title="Included by default">
              <Bullets items={d.included} />
            </Section>
          </div>

          <Section title="Premium add-ons">
            <Bullets items={d.addons} />
          </Section>

          <Section title="What we’ll need from you">
            <Bullets items={d.youProvide} />
          </Section>

          <Separator />

          <Section title="FAQ">
            <div className="grid gap-3">
              {d.faq.map((x) => (
                <div key={x.q} className="rounded-xl border bg-white p-3">
                  <div className="text-sm font-semibold">{x.q}</div>
                  <div className="mt-1 text-sm text-zinc-600">{x.a}</div>
                </div>
              ))}
            </div>
          </Section>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button asChild>
              <a href="#contact" onClick={() => onOpenChange(false)}>
                Get a quote
              </a>
            </Button>
          </div>

          <div className="text-xs text-zinc-500">
            Note: exact scope and pricing depend on pages, content readiness, and integrations.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <div className="grid gap-2">
      {items.map((x) => (
        <div key={x} className="flex items-start gap-2 text-sm text-zinc-700">
          <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
          <span>{x}</span>
        </div>
      ))}
    </div>
  );
}
