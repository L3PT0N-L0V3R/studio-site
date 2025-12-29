"use client";

import * as React from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Accessibility,
  BarChart3,
  Blocks,
  Bot,
  Brush,
  Database,
  Gauge,
  Globe,
  LayoutTemplate,
  Link2,
  Mail,
  RefreshCw,
  Search,
  ShoppingBag,
  Wrench,
  ArrowUpRight,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

type ServiceItem = {
  id: string;
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
  detail: {
    summary: string;
    includes: string[];
    outcomes: string[];
    goodFor: string[];
  };
};

const SERVICES: ServiceItem[] = [
  {
    id: "from-scratch",
    title: "Websites from scratch",
    description: "Marketing sites, landing pages, and product pages with clean IA and polish.",
    Icon: LayoutTemplate,
    detail: {
      summary:
        "A clean, modern foundation built to scale: structured pages, a reusable component kit, and a build that stays fast and consistent as you add new sections. Designed to ship quickly without painting you into a corner.",
      includes: [
        "IA + sitemap (pages, nav, hierarchy)",
        "Brand-ready UI kit (components + patterns)",
        "Responsive build + accessibility baseline",
        "SEO foundations (metadata + schema basics)",
        "Analytics + conversion event instrumentation",
      ],
      outcomes: ["Launch-ready in weeks", "Easy to expand cleanly", "Higher-quality leads"],
      goodFor: ["New offers/brands", "Founders shipping fast", "Teams that want polish"],
    },
  },
  {
    id: "rebuilds-upgrades",
    title: "Rebuilds & upgrades",
    description: "Modernize without losing SEO, content, or momentum. Keep what works, fix what doesn't.",
    Icon: RefreshCw,
    detail: {
      summary:
        "We modernize the UI and the underlying structure while protecting what you've already earned: rankings, content equity, and conversion paths. Changes ship in controlled phases with measurement, not guesswork.",
      includes: [
        "Audit + risk map (SEO, UX, CWV)",
        "Stepwise rebuild plan (safe sequencing)",
        "Migration hygiene (redirects + parity checks)",
        "Component + layout refresh (no regressions)",
        "Instrumentation + regression guardrails",
      ],
      outcomes: ["Protected SEO equity", "Faster, cleaner UX", "Measured rollout"],
      goodFor: ["Traffic you can't lose", "Legacy stacks", "Sites with patchwork UX"],
    },
  },
  {
    id: "design-systems",
    title: "Design systems",
    description: "Reusable components, spacing/typography rules, and a scalable UI language.",
    Icon: Blocks,
    detail: {
      summary:
        "A reusable UI system aligned to your brand: tokens, components, and rules so new pages stay consistent and easy to ship. The goal is speed later, not just beauty now.",
      includes: [
        "Tokens (type, spacing, radii, color)",
        "Core components + variants (real use-cases)",
        "Interaction rules + motion constraints",
        "Docs + usage examples (so it sticks)",
        "Production-ready implementation in your stack",
      ],
      outcomes: ["Consistent UI", "Cheaper new pages", "Less design debt"],
      goodFor: ["Multi-page sites", "Teams shipping weekly", "Design/dev alignment"],
    },
  },
  {
    id: "motion",
    title: "Motion & micro-interactions",
    description: "Subtle, controlled motion that makes the UI feel engineered—not flashy.",
    Icon: Brush,
    detail: {
      summary:
        "Premium motion that signals quality: crisp feedback, scroll narrative, and state transitions that feel app-like. Built with a motion budget so it stays smooth and doesn't become performance tax.",
      includes: [
        "Hover/tap feedback (spring spec + feel)",
        "Scroll-linked reveals (calm + precise)",
        "State transitions (loading, states, flows)",
        "Reduced-motion support (accessible defaults)",
        "Performance-safe motion budget + constraints",
      ],
      outcomes: ["Premium feel", "More engagement", "Clearer UX signals"],
      goodFor: ["Premium brands", "Explainer flows", "Complex products"],
    },
  },
  {
    id: "conversion",
    title: "Conversion refinement",
    description: "Tighter funnels, clearer offers, better paths. Instrumented to measure improvements.",
    Icon: BarChart3,
    detail: {
      summary:
        "We tighten hierarchy, clarify CTAs, and remove friction across the decision path. Improvements are instrumented so you can see what changed and what actually moved the needle.",
      includes: [
        "Offer clarity + page hierarchy cleanup",
        "CTA map + friction removal (flow fixes)",
        "Event tracking plan + implementation",
        "A/B-ready structure (optional)",
        "Reporting loop (what changed + why)",
      ],
      outcomes: ["Higher conversion", "Cleaner funnels", "Measurable wins"],
      goodFor: ["Lead-gen sites", "Paid traffic teams", "Service businesses"],
    },
  },
  {
    id: "performance",
    title: "Performance & Core Web Vitals",
    description: "Smarter loading, practical changes, and production-grade speed improvements.",
    Icon: Gauge,
    detail: {
      summary:
        "Speed work that holds up in production: practical fixes, a clean loading model, and guardrails so performance doesn't decay over time. Tuned for real users, not just lab scores.",
      includes: [
        "CWV audit + bottleneck map (root causes)",
        "Image + font strategy (fast by default)",
        "Code-splitting + lazy-load model",
        "Field data alignment (RUM vs Lighthouse)",
        "Regression guardrails (don't backslide)",
      ],
      outcomes: ["Faster pages", "Better CWV", "More stable SEO"],
      goodFor: ["High-traffic sites", "Media-heavy pages", "SEO-sensitive teams"],
    },
  },
  {
    id: "seo",
    title: "SEO baseline",
    description: "Technical SEO, on-page structure, metadata, and indexable architecture.",
    Icon: Search,
    detail: {
      summary:
        "An SEO foundation that stays clean as the site grows: indexable structure, consistent templates, and the technical basics that keep rankings from becoming fragile later.",
      includes: [
        "Indexability + crawl checks (blockers removed)",
        "Metadata + schema basics (right-sized)",
        "Internal linking structure (intentional)",
        "Content hierarchy templates (page consistency)",
        "Migration-safe adjustments (redirect plan if needed)",
      ],
      outcomes: ["Better crawlability", "Cleaner structure", "Reduced fragility"],
      goodFor: ["Rebuilds", "Content sites", "Local/service SEO"],
    },
  },
  {
    id: "a11y",
    title: "Accessibility baseline",
    description: "Keyboard support, semantics, contrast, and predictable interaction patterns.",
    Icon: Accessibility,
    detail: {
      summary:
        "Accessibility that's built-in, not bolted on: semantic structure, keyboard flows, and predictable interaction patterns. Cleaner UX for everyone and fewer expensive reworks later.",
      includes: [
        "Keyboard navigation (complete flows)",
        "Semantic structure + ARIA where needed",
        "Contrast + focus states (usable, consistent)",
        "Reduced-motion patterns (safe defaults)",
        "Forms + error state clarity (less friction)",
      ],
      outcomes: ["Lower friction", "Fewer UX bugs", "Stronger components"],
      goodFor: ["Forms + funnels", "Any production site", "Teams scaling UI"],
    },
  },
  {
    id: "analytics",
    title: "Analytics & event tracking",
    description: "Clean tracking plans, events, and dashboards that reflect what matters.",
    Icon: Database,
    detail: {
      summary:
        "Measurement you can trust: a tracking plan that matches business decisions, clean event naming, and dashboards that stay actionable. Includes QA so the data isn't noisy or misleading.",
      includes: [
        "Tracking plan + naming conventions (clean)",
        "Event implementation (consistent + reliable)",
        "Dashboards (simple, actionable, not bloated)",
        "Funnels + key journeys (signal over noise)",
        "Quality checks + ongoing consistency",
      ],
      outcomes: ["Clear KPIs", "Trusted data", "Faster iteration"],
      goodFor: ["Growth teams", "Ads + landing pages", "Weekly improvement cycles"],
    },
  },
  {
    id: "crm",
    title: "CRM + automations",
    description: "Forms → routing → follow-ups → reporting. Reduce manual work and missed leads.",
    Icon: Mail,
    detail: {
      summary:
        "Turn inquiries into a system: capture, qualify, route, follow up, and measure. The focus is less manual work, faster response time, and a pipeline that stays clean over time.",
      includes: [
        "Form routing + spam mitigation (deliverability)",
        "CRM setup + pipeline hygiene (stages + rules)",
        "Email/SMS follow-ups (as needed)",
        "Notifications + SLAs (no missed leads)",
        "Reporting + lead quality signals (what converts)",
      ],
      outcomes: ["Fewer missed leads", "Faster response", "Cleaner pipeline"],
      goodFor: ["Service businesses", "Teams scaling ops", "Lead-gen sites"],
    },
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "APIs, webhooks, and the glue between tools (safely, with clear failure modes).",
    Icon: Link2,
    detail: {
      summary:
        "Practical integrations that don't become brittle: APIs, webhooks, retries, validation, and logging. Designed with clear failure modes so operations don't silently break.",
      includes: [
        "API + webhook wiring (clean contracts)",
        "Retries + failure modes (predictable behavior)",
        "Data validation + logging (debuggable)",
        "Security-safe patterns (auth + secrets)",
        "Documentation + handoff (maintainable)",
      ],
      outcomes: ["Less manual work", "More reliability", "Cleaner operations"],
      goodFor: ["Ops-heavy workflows", "Multi-tool stacks", "Scaling teams"],
    },
  },
  {
    id: "ecom",
    title: "E-commerce enhancements",
    description: "Checkout UX, product flow, email capture, and performance-minded merchandising.",
    Icon: ShoppingBag,
    detail: {
      summary:
        "Make ecommerce feel premium: faster UX, cleaner product paths, and checkout friction reduction. Improvements are paired with tracking so you can validate conversion and AOV impact.",
      includes: [
        "Checkout/cart friction reduction (flow fixes)",
        "Product page optimization (clarity + speed)",
        "Email capture flows (well-timed, not spammy)",
        "Performance improvements (media + loading)",
        "Tracking + funnel clarity (measure impact)",
      ],
      outcomes: ["Higher conversion", "Better AOV potential", "Cleaner merchandising"],
      goodFor: ["Shopify stacks", "Product catalogs", "Paid traffic"],
    },
  },
  {
    id: "ai",
    title: "AI-assisted workflows",
    description: "Practical assistants and automations that improve ops without adding fragility.",
    Icon: Bot,
    detail: {
      summary:
        "Use AI where it actually helps: ops, triage, support routing, and internal workflows. Built with safeguards, human review points, and logging so it stays reliable (and explainable).",
      includes: [
        "Workflow mapping + feasibility (what's real)",
        "Lightweight automations (low-fragility)",
        "Human-in-the-loop safeguards (control points)",
        "Prompt + tooling patterns (reusable)",
        "Logging + review loop (continuous quality)",
      ],
      outcomes: ["Less busywork", "Faster ops", "Better consistency"],
      goodFor: ["Operations teams", "Support workflows", "Internal tooling needs"],
    },
  },
  {
    id: "hosting",
    title: "Hosting + deployments",
    description: "Sane environments, previews, reliable deploys, and a maintainable delivery pipeline.",
    Icon: Globe,
    detail: {
      summary:
        "Reliability through process: preview environments, clean release hygiene, and a delivery pipeline that makes shipping calm. Includes the basics so production stays observable and recoverable.",
      includes: [
        "Preview environments (safe iteration)",
        "Release hygiene + rollback readiness",
        "Monitoring basics (visibility + alerts)",
        "Env config sanity (no mystery vars)",
        "Maintainable handoff (docs + ownership)",
      ],
      outcomes: ["Fewer deploy issues", "Faster iteration", "More confidence"],
      goodFor: ["Teams shipping often", "Multi-env setups", "Production sites"],
    },
  },
  {
    id: "iteration",
    title: "Ongoing iteration",
    description: "Small, frequent improvements. Fixes, enhancements, and quality maintenance.",
    Icon: Wrench,
    detail: {
      summary:
        "Keep the system sharp over time: continuous fixes, new sections, experiments, and maintenance without the overhead of re-onboarding every time. Designed for momentum and quality.",
      includes: [
        "Bug fixes + refinements (polish included)",
        "New sections/pages (fast turnarounds)",
        "Conversion experiments (optional)",
        "Performance maintenance (stay fast)",
        "Tracking + reporting upkeep (stay measurable)",
      ],
      outcomes: ["Continuous improvement", "Lower tech debt", "Stable growth"],
      goodFor: ["Long-term partners", "Growing sites", "Monthly iteration"],
    },
  },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs",
        "bg-white",
        "text-zinc-700"
      )}
      style={{
        borderColor: "hsl(var(--ui-glow)/0.18)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.82))",
      }}
    >
      {children}
    </span>
  );
}

function ServiceCard({ item }: { item: ServiceItem }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLButtonElement | null>(null);

  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState<{ id: number; x: number; y: number } | null>(null);
  const [hovered, setHovered] = useState(false);

  const setSpotlight = useCallback((x: number, y: number) => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
  }, []);

  const setTilt = useCallback((x: number, y: number) => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", `${x}deg`);
    el.style.setProperty("--ry", `${y}deg`);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (reduceMotion) return;
      const el = ref.current;
      if (!el) return;

      const r = el.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;

      setSpotlight(px, py);

      const nx = (px / r.width) * 2 - 1;
      const ny = (py / r.height) * 2 - 1;

      const maxTilt = 2.25;
      const rx = clamp(-ny * maxTilt, -maxTilt, maxTilt);
      const ry = clamp(nx * maxTilt, -maxTilt, maxTilt);

      setTilt(rx, ry);
    },
    [reduceMotion, setSpotlight, setTilt]
  );

  const onPointerEnter = useCallback(() => {
    if (reduceMotion) return;
    setHovered(true);
  }, [reduceMotion]);

  const onPointerLeave = useCallback(() => {
    if (reduceMotion) return;

    setHovered(false);

    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();

    setSpotlight(r.width / 2, r.height / 2);
    setTilt(0, 0);
  }, [reduceMotion, setSpotlight, setTilt]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    const id = Date.now();
    setPulse({ id, x, y });
    window.setTimeout(() => {
      setPulse((p) => (p?.id === id ? null : p));
    }, 420);
  }, []);

  const { Icon } = item;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.button
          ref={ref}
          type="button"
          onPointerMove={onPointerMove}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onPointerDown={onPointerDown}
          className={cn(
            "group relative w-full overflow-hidden rounded-3xl border text-left",
            "bg-white/70 backdrop-blur-sm",
            "p-6 shadow-sm transition-[box-shadow,border-color] duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
            "will-change-transform"
          )}
          style={{
            borderColor: "hsl(var(--ui-glow) / 0.28)",
            boxShadow: hovered ? "0 26px 80px rgba(0,0,0,0.14)" : "0 18px 50px rgba(0,0,0,0.08)",
            ["--mx" as any]: "50%",
            ["--my" as any]: "50%",
            ["--rx" as any]: "0deg",
            ["--ry" as any]: "0deg",
            transformStyle: "preserve-3d",
          }}
          animate={
            reduceMotion
              ? {}
              : {
                  y: hovered ? -6 : 0,
                  rotateX: "var(--rx)" as any,
                  rotateY: "var(--ry)" as any,
                  scale: hovered ? 1.01 : 1,
                }
          }
          transition={
            reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 34, mass: 0.7 }
          }
          whileTap={reduceMotion ? undefined : { scale: 0.995, y: -4 }}
          aria-label={item.title}
        >
          {/* base tint */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: "linear-gradient(180deg, hsl(var(--ui-glow) / 0.12), transparent 62%)",
            }}
          />

          {/* cursor spotlight */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(420px circle at var(--mx) var(--my), hsl(var(--ui-glow) / 0.20), transparent 60%)",
            }}
          />

          {/* click/tap pulse */}
          {pulse ? (
            <motion.span
              key={pulse.id}
              aria-hidden
              className="pointer-events-none absolute rounded-full"
              style={{
                left: pulse.x,
                top: pulse.y,
                width: 10,
                height: 10,
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(circle, hsl(var(--ui-glow) / 0.40) 0%, transparent 70%)",
              }}
              initial={{ opacity: 0.35, scale: 0.6 }}
              animate={{ opacity: 0, scale: 18 }}
              transition={{ duration: 0.42, ease: [0.2, 0.8, 0.2, 1] }}
            />
          ) : null}

          {/* inner border */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[1px] rounded-[22px]"
            style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.65)" }}
          />

          <div className="relative flex items-start gap-4">
            <div
              className="grid h-12 w-12 place-items-center rounded-2xl border bg-white/70"
              style={{ borderColor: "hsl(var(--ui-glow) / 0.22)" }}
            >
              <span className="inline-flex text-[hsl(var(--ui-glow)/0.85)]">
                <Icon className="h-6 w-6" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="text-base font-semibold tracking-tight">{item.title}</div>
              <div className="mt-2 text-sm text-zinc-600">{item.description}</div>
            </div>
          </div>
        </motion.button>
      </DialogTrigger>

      {/* MOBILE: perfect as you had it. DESKTOP: truly large, no cutoff. */}
      <DialogContent
        showCloseButton={false}
        className={cn(
          // IMPORTANT: override shadcn default max-w-lg
          "!max-w-none",

          // Width: modest on mobile, huge on desktop
          "w-[calc(100vw-2.5rem)] sm:w-[min(96vw,980px)] lg:w-[min(96vw,1400px)]",

          // Height: mobile stays scrollable; desktop gets near-full viewport (slightly taller to remove scroll)
          "max-h-[calc(100svh-9rem)] sm:max-h-[92vh] lg:h-[calc(100vh-2rem)] lg:max-h-[calc(100vh-2rem)]",

          // Layout
          "grid grid-rows-[auto_1px_minmax(0,1fr)]",
          "overflow-hidden",

          // Shell
          "rounded-3xl",
          "border border-black/10",
          "bg-white",
          "p-0",
          "shadow-[0_35px_140px_rgba(0,0,0,0.16)]"
        )}
      >
        {/* ACCESSIBILITY REQUIREMENT */}
        <DialogHeader className="sr-only">
          <DialogTitle>{item.title}</DialogTitle>
          <DialogDescription>{item.detail.summary}</DialogDescription>
        </DialogHeader>

        {/* HEADER (fixed) */}
        <div className="relative px-6 py-5 sm:px-10 sm:py-8 lg:px-12 lg:py-8">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(1200px 420px at 14% 0%, hsl(var(--ui-glow)/0.12) 0%, rgba(255,255,255,0) 55%), radial-gradient(900px 420px at 92% 12%, hsl(var(--ui-glow)/0.08) 0%, rgba(255,255,255,0) 58%)",
            }}
          />

          <div className="relative flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs text-zinc-500">Services</div>

              <div className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 sm:mt-3 sm:text-3xl lg:text-[38px] lg:leading-[1.05]">
                {item.title}
              </div>

              <div className="mt-3 max-w-[72ch] text-sm leading-relaxed text-zinc-600 sm:mt-4 sm:text-base lg:mt-4 lg:text-[16px] lg:leading-relaxed">
                {item.detail.summary}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button asChild className="hidden sm:inline-flex rounded-2xl">
                <a href="#contact" onClick={() => setOpen(false)}>
                  Get a quote <ArrowUpRight className="ml-1 h-4 w-4" />
                </a>
              </Button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-2xl border",
                  "bg-white",
                  "transition-shadow"
                )}
                style={{
                  borderColor: "hsl(var(--ui-glow)/0.22)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                }}
                aria-label="Close"
              >
                <X className="h-4 w-4 text-zinc-600" />
              </button>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-black/10" />

        {/* BODY:
            - mobile/tablet: scrollable
            - desktop: tightened so it fits with no scroll */}
        <div className="min-h-0 overflow-x-hidden overflow-y-auto lg:overflow-y-hidden px-5 py-5 sm:px-10 sm:py-10 lg:px-12 lg:py-8">
          <div className="grid gap-6 md:grid-cols-12 lg:gap-10">
            {/* LEFT: What we build */}
            <div
              className={cn(
                "md:col-span-7",
                "rounded-3xl border border-black/10 bg-white p-5 sm:p-6 lg:p-8"
              )}
              style={{ boxShadow: "0 18px 70px rgba(0,0,0,0.06)" }}
            >
              <div className="text-sm font-semibold text-zinc-950 lg:text-base">What we build</div>

              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:mt-6 lg:gap-x-10 lg:gap-y-6">
                {item.detail.includes.map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--ui-glow)/0.85)]" />
                    <span className="text-sm leading-relaxed text-zinc-700 lg:text-[15px] lg:leading-relaxed">
                      {t}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* RIGHT: What you get + Good for */}
            <div className="md:col-span-5 grid gap-6 lg:gap-8">
              <div
                className="rounded-3xl border border-black/10 bg-white p-5 sm:p-6 lg:p-8"
                style={{ boxShadow: "0 18px 70px rgba(0,0,0,0.06)" }}
              >
                <div className="text-sm font-semibold text-zinc-950 lg:text-base">What you get</div>

                <div className="mt-5 flex flex-wrap gap-2 lg:mt-6 lg:gap-3">
                  {item.detail.outcomes.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              </div>

              <div
                className="rounded-3xl border border-black/10 bg-white p-5 sm:p-6 lg:p-8"
                style={{ boxShadow: "0 18px 70px rgba(0,0,0,0.06)" }}
              >
                <div className="text-sm font-semibold text-zinc-950 lg:text-base">Good for</div>

                <div className="mt-5 flex flex-wrap gap-2 lg:mt-6 lg:gap-3">
                  {item.detail.goodFor.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              </div>

              {/* Mobile CTA */}
              <div className="sm:hidden">
                <Button asChild className="w-full rounded-2xl">
                  <a href="#contact" onClick={() => setOpen(false)}>
                    Get a quote <ArrowUpRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ServicesGrid() {
  const items = useMemo(() => SERVICES, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: "900px" }}>
      {items.map((item) => (
        <ServiceCard key={item.id} item={item} />
      ))}
    </div>
  );
}
