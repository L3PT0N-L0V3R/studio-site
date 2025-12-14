import type { ProcessStep } from "../types";

export const alignStep: ProcessStep = {
  slug: "align",
  step: "01",
  title: "Align",
  summary:
    "We define what success means, map the conversion path, and choose the simplest build that gets you real momentum—fast.",

  flexibility: ["60-minute kickoff", "Async questionnaire", "Discovery workshop"],
  outputs: ["Conversion plan", "Site map", "Scope options"],

  accomplishes: [
    "Clarifies your offer, who you’re targeting, and the single primary conversion goal (bookings, quote requests, purchases).",
    "Maps the path from first click → conversion → follow-up so leads don’t get lost.",
    "Chooses a “Launchpad” build that ships quickly, with upgrade modules available only if they’re worth it.",
  ],
  deliverables: [
    "Quick Win Plan (what we ship first and why)",
    "Site map (pages + sections + CTA placement)",
    "Content + asset checklist (so build time doesn’t stall)",
    "Tracking plan (what we measure from day one)",
    "Scope options (Launchpad / Growth / Systems-ready)",
  ],
  flexOptions: [
    {
      label: "Launchpad",
      description: "A premium multi-page marketing site with a clean conversion path.",
      includes: ["Core pages", "Contact + quote flow", "Baseline tracking"],
    },
    {
      label: "Growth",
      description: "Conversion-first structure with measurement baked in for iteration.",
      includes: ["Event tracking", "CTA refinement", "Optimization plan"],
    },
    {
      label: "Systems-ready",
      description: "Workflow-aware from day one (without forcing complexity upfront).",
      includes: ["Workflow mapping", "CRM handoff plan", "Automation opportunities"],
    },
  ],
  needs: [
    "Your services/products + what makes you different",
    "Any brand assets (optional—clean/minimal works)",
    "Competitors you like/dislike (helps direction quickly)",
    "Domain access (if it exists) + where leads should go",
  ],
  timeline: [
    "Usually 1–2 days depending on responsiveness.",
    "If urgent, we can scope a Launchpad build immediately.",
  ],
  modules: [
    "Lead routing rules (who gets what, and when)",
    "CRM integration (pipeline stages + follow-ups)",
    "Quote intake routing (service type → priority → owner)",
    "Scanning/intake workflows (QR-based requests, asset/job intake)",
  ],
};
