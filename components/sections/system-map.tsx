"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { BarChart3, Globe, Mail, ShieldCheck, Workflow, Database } from "lucide-react";

type ItemId = "website" | "intake" | "crm" | "automations" | "reporting" | "trust";

type SystemsMapItem = {
  id: ItemId;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
  detail: {
    headline: string;
    body: string;
    bullets: string[];
    outcomes: string[];
  };
};

const systemsMapItems: SystemsMapItem[] = [
  {
    id: "website",
    title: "Website",
    subtitle: "fast, mobile-first, conversion-ready",
    icon: Globe,
    tags: ["SEO", "Performance", "Accessibility"],
    detail: {
      headline: "The front door that converts",
      body:
        "We design hierarchy, copy structure, and interactions so prospects understand the offer quickly and take action confidently.",
      bullets: ["Information architecture", "Conversion paths + CTAs", "Performance budget targets"],
      outcomes: ["Higher qualified inquiries", "Faster pages", "Cleaner messaging"],
    },
  },
  {
    id: "intake",
    title: "Forms + Intake",
    subtitle: "lead capture + routing",
    icon: Mail,
    tags: ["Spam protection", "Validation", "Notifications"],
    detail: {
      headline: "Clean data in, correctly routed",
      body:
        "Intake is engineered like a system: validated fields, smart routing rules, and predictable notifications so leads don’t disappear into inbox chaos.",
      bullets: ["Schema + validation", "Routing rules", "Reliable notifications"],
      outcomes: ["Fewer missed leads", "Less admin work", "Higher speed-to-lead"],
    },
  },
  {
    id: "crm",
    title: "CRM",
    subtitle: "pipeline + customer context",
    icon: Database,
    tags: ["Stages", "Assignments", "History"],
    detail: {
      headline: "A pipeline you can actually run",
      body:
        "We connect intake to a structured pipeline so every lead has an owner, a stage, and a next step—with context attached.",
      bullets: ["Stage design", "Ownership + handoff", "Context + notes structure"],
      outcomes: ["Clear accountability", "No spreadsheet drift", "Faster follow-up"],
    },
  },
  {
    id: "automations",
    title: "Automations",
    subtitle: "reduce manual follow-ups",
    icon: Workflow,
    tags: ["Reminders", "Scheduling", "Tasks"],
    detail: {
      headline: "Follow-ups without overhead",
      body:
        "Automations handle the predictable: reminders, sequences, internal tasks—so deals don’t stall and your team stays consistent.",
      bullets: ["Sequencing + timing", "Task creation", "Scheduling handoffs"],
      outcomes: ["Better response rates", "Less manual chasing", "More consistent pipeline"],
    },
  },
  {
    id: "reporting",
    title: "Reporting",
    subtitle: "visibility into what’s working",
    icon: BarChart3,
    tags: ["Events", "Funnels", "ROI"],
    detail: {
      headline: "Measure → learn → improve",
      body:
        "We wire events and funnels so you can see what moves the needle, where leads drop, and what to iterate next—without guessing.",
      bullets: ["Event plan", "Funnel instrumentation", "Actionable reporting views"],
      outcomes: ["Clear ROI signals", "Better prioritization", "Continuous improvement"],
    },
  },
  {
    id: "trust",
    title: "Trust Layer",
    subtitle: "security-first controls",
    icon: ShieldCheck,
    tags: ["HTTPS", "Least privilege", "Audit-ready"],
    detail: {
      headline: "Built to be safe and maintainable",
      body:
        "Clean permissions, sensible defaults, and audit-aware wiring so systems don’t become fragile or risky as you grow.",
      bullets: ["Least-privilege access", "Operational clarity", "Documentation baseline"],
      outcomes: ["Lower risk", "Easier handoffs", "More reliable ops"],
    },
  },
];

function MagneticCard(props: { item: SystemsMapItem; onClick: () => void; isActive: boolean }) {
  const { item, onClick, isActive } = props;
  const reduceMotion = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 22, mass: 0.65 });
  const y = useSpring(my, { stiffness: 260, damping: 22, mass: 0.65 });

  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glow = useMotionTemplate`
  radial-gradient(600px circle at ${gx}% ${gy}%, hsl(var(--ui-glow) / 0.10), transparent 55%)
  `;
  function onMove(e: React.MouseEvent<HTMLButtonElement>) {
    if (reduceMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;

    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    mx.set(dx * 0.03);
    my.set(dy * 0.03);

    const px = ((e.clientX - r.left) / r.width) * 100;
    const py = ((e.clientY - r.top) / r.height) * 100;
    gx.set(Math.max(0, Math.min(100, px)));
    gy.set(Math.max(0, Math.min(100, py)));
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
    gx.set(50);
    gy.set(50);
  }

  const Icon = item.icon;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={reduceMotion ? undefined : { x, y }}
      className={cn(
        "group relative w-full rounded-2xl border bg-white p-6 text-left transition-shadow",
        "ui-ambient ui-ambient-hover",
        isActive ? "border-zinc-900 ui-ambient-active" : "border-border"
      )}
    >
      <motion.div layoutId={`systems-card-${item.id}`} className="absolute inset-0 rounded-2xl" />

      <div className="relative flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-lg font-semibold tracking-tight">{item.title}</div>
          <div className="mt-1 text-sm text-muted-foreground">{item.subtitle}</div>
        </div>
      </div>

      <div className="relative mt-6 flex flex-wrap gap-2">
        {item.tags.map((t) => (
          <Badge key={t} variant="outline">
            {t}
          </Badge>
        ))}
      </div>
    </motion.button>
  );
}

function SystemMap() {
  const [openId, setOpenId] = useState<ItemId | null>(null);
  const reduceMotion = useReducedMotion();

  const selected = useMemo(
    () => systemsMapItems.find((i) => i.id === openId) ?? null,
    [openId]
  );

  return (
    <section className="py-14">
      <Container>
        <div className="flex items-start justify-between gap-6">
          <div className="max-w-2xl">
            <div className="text-sm font-medium text-muted-foreground">Systems map</div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Systems map</h2>
            <p className="mt-3 text-muted-foreground">
              A website is the front door. The real leverage comes when intake, follow-ups, and reporting work together as one system.
            </p>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <Badge variant="outline">Modular</Badge>
            <Badge variant="outline">Expandable</Badge>
            <Badge variant="outline">Audit-aware</Badge>
          </div>
        </div>

        <LayoutGroup>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {systemsMapItems.map((item) => (
              <MagneticCard
                key={item.id}
                item={item}
                isActive={openId === item.id}
                onClick={() => setOpenId(item.id)}
              />
            ))}
          </div>

          <AnimatePresence>
            {selected ? (
              <>
                <motion.button
                  type="button"
                  aria-label="Close systems map detail"
                  className="fixed inset-0 z-50 cursor-default bg-black/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpenId(null)}
                />

                <motion.div
                  className="fixed inset-0 z-50 grid place-items-center p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    layoutId={`systems-card-${selected.id}`}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 520, damping: 42, mass: 0.85 }
                    }
                    className="w-full max-w-2xl overflow-hidden rounded-2xl border bg-white shadow-xl ui-ambient-active"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-start justify-between gap-4 p-6">
                      <div className="min-w-0">
                        <div className="text-sm text-muted-foreground">{selected.title}</div>
                        <div className="mt-1 text-2xl font-semibold tracking-tight">
                          {selected.detail.headline}
                        </div>
                        <p className="mt-3 text-muted-foreground">{selected.detail.body}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setOpenId(null)}
                        className="shrink-0 rounded-xl border px-3 py-2 text-sm hover:shadow-sm"
                      >
                        Close
                      </button>
                    </div>

                    <div className="border-t px-6 py-5">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                          <div className="text-sm font-semibold">What we build</div>
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                            {selected.detail.bullets.map((b) => (
                              <li key={b}>{b}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <div className="text-sm font-semibold">What you get</div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {selected.detail.outcomes.map((o) => (
                              <Badge key={o} variant="secondary">
                                {o}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {selected.tags.map((t) => (
                          <Badge key={t} variant="outline">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </>
            ) : null}
          </AnimatePresence>
        </LayoutGroup>
      </Container>
    </section>
  );
}

export default SystemMap;
export { SystemMap };
