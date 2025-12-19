// lib/focus.ts
export const FOCUS_OPTIONS = [
  {
    id: "design",
    title: "Design",
    desc: "Interaction-first polish and motion.",
  },
  {
    id: "performance",
    title: "Performance",
    desc: "Speed, stability, and Core Web Vitals.",
  },
  {
    id: "conversion",
    title: "Conversion",
    desc: "Offer clarity and funnel mechanics.",
  },
] as const;

export type FocusId = (typeof FOCUS_OPTIONS)[number]["id"];

export function normalizeFocus(raw: string | null): FocusId | null {
  if (!raw) return null;

  // Back-compat: old mode -> new mode
  if (raw === "motion") return "design";

  if (FOCUS_OPTIONS.some((o) => o.id === raw)) return raw as FocusId;
  return null;
}
