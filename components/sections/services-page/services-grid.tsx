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
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
    description:
      "Marketing sites, landing pages, and product pages with clean IA and polish.",
    Icon: LayoutTemplate,
    detail: {
      summary:
        "A clean, modern foundation built to scale—fast, structured, and easy to expand without rewrites.",
      includes: [
        "IA + page architecture",
        "Component system + visual polish",
        "Responsive build + accessibility baseline",
        "SEO structure + indexability checks",
        "Analytics + conversion instrumentation",
      ],
      outcomes: ["Faster launch", "Clean iteration path", "Better conversion clarity"],
      goodFor: ["New offers", "New brand/site", "Early-stage teams that want to grow"],
    },
  },
  {
    id: "rebuilds-upgrades",
    title: "Rebuilds & upgrades",
    description:
      "Modernize without losing SEO, content, or momentum. Keep what works, fix what doesn’t.",
    Icon: RefreshCw,
    detail: {
      summary:
        "We stabilize what’s already working, then rebuild the fragile parts—without breaking ranking or flow.",
      includes: [
        "Audit + risk map (SEO, UX, performance)",
        "Incremental rebuild plan",
        "Migration-safe rollout (no sudden cliff)",
        "Component + layout refresh",
        "Instrumentation + measurement",
      ],
      outcomes: ["Less risk", "Better performance", "Modern UX without disruption"],
      goodFor: ["Aging sites", "Teams with traffic to protect", "Sites that have outgrown the stack"],
    },
  },
  {
    id: "design-systems",
    title: "Design systems",
    description:
      "Reusable components, spacing/typography rules, and a scalable UI language.",
    Icon: Blocks,
    detail: {
      summary:
        "A consistent UI system that makes future pages cheaper and faster—without getting generic.",
      includes: [
        "Tokens (type, spacing, radii, color)",
        "Reusable components + variants",
        "Interaction rules + motion constraints",
        "Docs + usage patterns",
        "Production-ready implementation",
      ],
      outcomes: ["Consistent UI", "Faster iteration", "Less design debt"],
      goodFor: ["Growing marketing sites", "Multi-page builds", "Teams shipping new pages often"],
    },
  },
  {
    id: "motion",
    title: "Motion & micro-interactions",
    description:
      "Subtle, controlled motion that makes the UI feel engineered—not flashy.",
    Icon: Brush,
    detail: {
      summary:
        "Premium interaction design: hover physics, scroll narrative, and feedback loops that feel “app-like.”",
      includes: [
        "Hover + tap feedback (spring rules)",
        "Scroll-linked reveals (calm + precise)",
        "Interaction polish (loading, states, transitions)",
        "Reduced-motion support",
        "Performance-safe motion constraints",
      ],
      outcomes: ["Higher perceived quality", "More engagement", "Better UX confidence"],
      goodFor: ["Premium brands", "Explainer flows", "Complex products that need clarity"],
    },
  },
  {
    id: "conversion",
    title: "Conversion refinement",
    description:
      "Tighter funnels, clearer offers, better paths. Instrumented to measure improvements.",
    Icon: BarChart3,
    detail: {
      summary:
        "We simplify decision paths and remove friction—then measure what changed so it’s not guesswork.",
      includes: [
        "Offer clarity + page hierarchy",
        "CTA strategy + friction removal",
        "Event tracking plan + implementation",
        "A/B-ready structure (optional)",
        "Reporting + iteration loop",
      ],
      outcomes: ["Higher conversion", "Cleaner funnels", "Measurable improvements"],
      goodFor: ["Lead-gen sites", "Service businesses", "Teams spending on ads/traffic"],
    },
  },
  {
    id: "performance",
    title: "Performance & Core Web Vitals",
    description:
      "Smarter loading, practical changes, and production-grade speed improvements.",
    Icon: Gauge,
    detail: {
      summary:
        "Speed that holds up in the real world—built into the system rather than “fixed later.”",
      includes: [
        "CWV audit + bottleneck map",
        "Image + font strategy",
        "Code-splitting + loading model",
        "Lighthouse + field data alignment",
        "Regression-safe checks",
      ],
      outcomes: ["Faster pages", "Better UX", "More stable SEO outcomes"],
      goodFor: ["High-traffic sites", "SEO-sensitive teams", "Sites with heavy media/content"],
    },
  },
  {
    id: "seo",
    title: "SEO baseline",
    description:
      "Technical SEO, on-page structure, metadata, and indexable architecture.",
    Icon: Search,
    detail: {
      summary: "A clean SEO foundation—so your pages can actually rank and stay indexable.",
      includes: [
        "Indexability + crawl checks",
        "Metadata + schema basics",
        "Internal linking structure",
        "Content hierarchy guidance",
        "Migration-safe adjustments",
      ],
      outcomes: ["Better crawlability", "Cleaner structure", "Reduced SEO fragility"],
      goodFor: ["Rebuilds", "Content sites", "Local/service businesses"],
    },
  },
  {
    id: "a11y",
    title: "Accessibility baseline",
    description:
      "Keyboard support, semantics, contrast, and predictable interaction patterns.",
    Icon: Accessibility,
    detail: {
      summary: "Accessibility that’s built-in—not bolted on. Cleaner UX for everyone.",
      includes: [
        "Keyboard navigation",
        "Semantic structure + ARIA where needed",
        "Contrast + focus states",
        "Reduced-motion patterns",
        "Form + error state clarity",
      ],
      outcomes: ["Better UX", "Lower friction", "More robust components"],
      goodFor: ["Any production site", "Forms + funnels", "Teams that want fewer UX bugs"],
    },
  },
  {
    id: "analytics",
    title: "Analytics & event tracking",
    description:
      "Clean tracking plans, events, and dashboards that reflect what matters.",
    Icon: Database,
    detail: {
      summary:
        "Measurement that’s useful. Track the signals that drive decisions—not noise.",
      includes: [
        "Tracking plan + naming conventions",
        "Event implementation",
        "Dashboards (simple + actionable)",
        "Funnel definitions",
        "Quality checks + consistency",
      ],
      outcomes: ["Clear KPIs", "Less guessing", "Better iteration"],
      goodFor: ["Conversion work", "Ads traffic", "Teams improving weekly/monthly"],
    },
  },
  {
    id: "crm",
    title: "CRM + automations",
    description:
      "Forms → routing → follow-ups → reporting. Reduce manual work and missed leads.",
    Icon: Mail,
    detail: {
      summary: "Turn inquiries into a system: capture → qualify → follow up → measure.",
      includes: [
        "Form routing + spam mitigation",
        "CRM integration + pipeline hygiene",
        "Email/SMS follow-ups (as needed)",
        "Notification rules",
        "Reporting + lead quality signals",
      ],
      outcomes: ["Fewer missed leads", "Faster response time", "Cleaner pipeline"],
      goodFor: ["Service businesses", "Teams scaling ops", "Lead-gen sites"],
    },
  },
  {
    id: "integrations",
    title: "Integrations",
    description:
      "APIs, webhooks, and the glue between tools (safely, with clear failure modes).",
    Icon: Link2,
    detail: {
      summary: "Practical integrations that don’t turn into brittle spaghetti.",
      includes: [
        "API + webhook wiring",
        "Retries + failure modes",
        "Data validation + logging",
        "Security-safe patterns",
        "Documentation + handoff",
      ],
      outcomes: ["Less manual work", "More reliability", "Cleaner operations"],
      goodFor: ["Scaling teams", "Multiple tools", "Ops-heavy workflows"],
    },
  },
  {
    id: "ecom",
    title: "E-commerce enhancements",
    description:
      "Checkout UX, product flow, email capture, and performance-minded merchandising.",
    Icon: ShoppingBag,
    detail: {
      summary:
        "Make ecommerce feel premium: faster UX, cleaner paths, better conversion mechanics.",
      includes: [
        "Checkout + cart friction reduction",
        "Product page optimization",
        "Email capture flows",
        "Performance improvements",
        "Tracking + funnel clarity",
      ],
      outcomes: ["Higher AOV potential", "Better conversion", "Cleaner merchandising"],
      goodFor: ["Shopify-style stacks", "Product catalogs", "Paid traffic"],
    },
  },
  {
    id: "ai",
    title: "AI-assisted workflows",
    description:
      "Practical assistants and automations that improve ops without adding fragility.",
    Icon: Bot,
    detail: {
      summary:
        "Use AI where it helps: support, ops, triage, and internal workflows—without hype.",
      includes: [
        "Workflow mapping + feasibility",
        "Lightweight automations",
        "Human-in-the-loop safeguards",
        "Prompt + tooling patterns",
        "Logging + review loop",
      ],
      outcomes: ["Less busywork", "Faster ops", "Better consistency"],
      goodFor: ["Operations teams", "Support-heavy flows", "Internal tooling needs"],
    },
  },
  {
    id: "hosting",
    title: "Hosting + deployments",
    description:
      "Sane environments, previews, reliable deploys, and a maintainable delivery pipeline.",
    Icon: Globe,
    detail: {
      summary:
        "Reliability through process: preview flows, stable deploys, and repeatable builds.",
      includes: [
        "Preview environments",
        "Release hygiene + rollback readiness",
        "Monitoring basics",
        "Env config sanity",
        "Maintainable handoff",
      ],
      outcomes: ["Fewer deploy issues", "Faster iteration", "More confidence"],
      goodFor: ["Teams shipping often", "Multi-environment setups", "Production sites"],
    },
  },
  {
    id: "iteration",
    title: "Ongoing iteration",
    description:
      "Small, frequent improvements. Fixes, enhancements, and quality maintenance.",
    Icon: Wrench,
    detail: {
      summary:
        "The system stays sharp: polish, fixes, improvements, and feature upgrades over time.",
      includes: [
        "Bug fixes + refinements",
        "New sections/pages",
        "Conversion experiments (optional)",
        "Performance maintenance",
        "Tracking + reporting upkeep",
      ],
      outcomes: ["Continuous improvement", "Lower tech debt", "Stable growth"],
      goodFor: ["Long-term partners", "Growing sites", "Teams that iterate monthly"],
    },
  },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function Pill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-zinc-700",
        className
      )}
      style={{
        borderColor: "hsl(var(--ui-glow) / 0.25)",
        backgroundColor: "rgba(0,0,0,0.02)",
      }}
    >
      {children}
    </span>
  );
}

function ServiceCard({ item }: { item: ServiceItem }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLButtonElement | null>(null);

  const [pulse, setPulse] = useState<{ id: number; x: number; y: number } | null>(
    null
  );
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

  // bottom chips like your “good” popup: keep it short (3)
  const footerTags = item.detail.goodFor.slice(0, 3);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.button
          ref={ref}
          type="button"
          onPointerMove={onPointerMove}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          onPointerDown={onPointerDown}
          className={cn(
            "group relative w-full text-left overflow-hidden rounded-3xl border",
            "bg-white/70 backdrop-blur-sm",
            "p-6 shadow-sm transition-[box-shadow,border-color] duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
            "will-change-transform"
          )}
          style={{
            borderColor: "hsl(var(--ui-glow) / 0.28)",
            boxShadow: hovered
              ? "0 22px 70px rgba(0,0,0,0.14)"
              : "0 14px 46px rgba(0,0,0,0.08)",
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
            reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 520, damping: 34, mass: 0.7 }
          }
          whileTap={reduceMotion ? undefined : { scale: 0.995, y: -4 }}
          aria-label={item.title}
        >
          {/* soft tint */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, hsl(var(--ui-glow) / 0.10), transparent 62%)",
            }}
          />

          {/* cursor spotlight */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(420px circle at var(--mx) var(--my), hsl(var(--ui-glow) / 0.22), transparent 60%)",
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
                background:
                  "radial-gradient(circle, hsl(var(--ui-glow) / 0.35) 0%, transparent 70%)",
              }}
              initial={{ opacity: 0.35, scale: 0.6 }}
              animate={{ opacity: 0, scale: 18 }}
              transition={{ duration: 0.42, ease: [0.2, 0.8, 0.2, 1] }}
            />
          ) : null}

          {/* inner white border */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[1px] rounded-[22px]"
            style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.65)" }}
          />

          <div className="relative flex items-start gap-4">
            <div
              className="grid h-12 w-12 place-items-center rounded-2xl border bg-white/60"
              style={{ borderColor: "hsl(var(--ui-glow) / 0.25)" }}
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

      {/* WHITE dialog that matches your “good popup” layout */}
      <DialogContent
        className={cn(
          "w-[calc(100vw-2rem)] max-w-[980px]",
          "max-h-[calc(100vh-2rem)]",
          "overflow-hidden",
          "rounded-3xl border border-black/10 bg-white p-0",
          "shadow-[0_40px_140px_rgba(0,0,0,0.18)]"
        )}
      >
        <DialogHeader className="px-8 pt-7 pb-6">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              {/* small label like your other popup */}
              <div className="text-xs font-medium text-zinc-500">
                Services
              </div>

              {/* Required for accessibility */}
              <DialogTitle className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
                {item.title}
              </DialogTitle>

              <DialogDescription className="mt-3 max-w-[70ch] text-base leading-relaxed text-zinc-600">
                {item.detail.summary}
              </DialogDescription>
            </div>

            <div className="flex items-center gap-3">
              <Button asChild className="rounded-2xl">
                <a href="#contact">
                  Get a quote <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>

              <DialogClose asChild>
                <Button variant="outline" className="rounded-2xl">
                  Close
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogHeader>

        <div className="h-px w-full bg-black/10" />

        {/* Body */}
        <div className="px-8 py-7">
          <div className="grid gap-6 md:grid-cols-12">
            {/* Left: What we build */}
            <div className="md:col-span-7">
              <div className="text-sm font-semibold text-zinc-950">What we build</div>

              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {item.detail.includes.map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: "hsl(var(--ui-glow) / 0.85)" }}
                    />
                    <span className="text-sm leading-relaxed text-zinc-700">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: What you get */}
            <div className="md:col-span-5">
              <div className="text-sm font-semibold text-zinc-950">What you get</div>

              <div className="mt-4 flex flex-wrap gap-2">
                {item.detail.outcomes.map((t) => (
                  <Pill key={t}>{t}</Pill>
                ))}
              </div>

              {item.detail.goodFor.length ? (
                <>
                  <div className="mt-6 text-sm font-semibold text-zinc-950">
                    Good for
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.detail.goodFor.map((t) => (
                      <Pill key={t}>{t}</Pill>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* Bottom chips row (matches your other popup vibe) */}
          {footerTags.length ? (
            <div className="mt-7">
              <div className="h-px w-full bg-black/10" />
              <div className="mt-5 flex flex-wrap gap-2">
                {footerTags.map((t) => (
                  <Pill key={t} className="bg-white">
                    {t}
                  </Pill>
                ))}
              </div>
            </div>
          ) : null}
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
