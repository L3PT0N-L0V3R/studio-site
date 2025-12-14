import type { LucideIcon } from "lucide-react";
import { Sparkles, Hand, Target, Plug } from "lucide-react";

export type FlagshipSlug = "motion" | "interactivity" | "conversion" | "integrations";

export type FlagshipStep = {
  slug: FlagshipSlug;
  step: string;
  title: string;
  summary: string;
  bullets: string[];
  icon: LucideIcon;
};

export const flagshipSteps: FlagshipStep[] = [
  {
    slug: "motion",
    step: "01",
    title: "Signature motion + scroll narratives",
    summary:
      "Flagship scroll sequences, smooth transitions, and controlled animation that feels premium—not gimmicky.",
    bullets: [
      "Scroll-based reveals (scale, blur, parallax—subtle)",
      "Section-to-section pacing + rhythm",
      "Performance-safe motion (no jank on mobile)",
    ],
    icon: Sparkles,
  },
  {
    slug: "interactivity",
    step: "02",
    title: "Micro-interactions + “app-like” feel",
    summary:
      "Hover physics, tap feedback, and UI polish that makes the site feel like a product—especially on mobile.",
    bullets: [
      "Hover/tap lift + spring easing",
      "Interactive cards, dialogs, quiz flows",
      "Thumb-friendly navigation patterns",
    ],
    icon: Hand,
  },
  {
    slug: "conversion",
    step: "03",
    title: "Conversion flow + lead capture",
    summary:
      "We can keep it simple or build a smarter path that guides users to action (booking, quotes, sales).",
    bullets: [
      "Quote/booking flows + form routing",
      "Content hierarchy that sells clearly",
      "Analytics + event tracking setup",
    ],
    icon: Target,
  },
  {
    slug: "integrations",
    step: "04",
    title: "Integrations + systems improvements",
    summary:
      "When the business is ready, we can extend beyond marketing into workflows—CRM, automations, and internal tools.",
    bullets: [
      "CRM/white-label integrations + pipelines",
      "Payments/Shopify or checkout flows",
      "Custom internal tools (scanning, ops, dashboards)",
    ],
    icon: Plug,
  },
];
