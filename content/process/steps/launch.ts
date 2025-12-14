import type { ProcessStep } from "../types";

export const launchStep: ProcessStep = {
  slug: "launch",
  step: "04",
  title: "Launch",
  summary:
    "We launch cleanly, verify tracking, and iterate based on data—then recommend system upgrades only where they’ll pay off.",

  flexibility: ["Basic launch", "Optimization cycle", "Systems roadmap"],
  outputs: ["QA + deploy", "Tracking verified", "30-day optimization plan"],

  accomplishes: [
    "Runs QA across mobile, forms, performance, and SEO fundamentals before shipping.",
    "Verifies tracking so decisions are based on real numbers—not guesses.",
    "Identifies the next highest-leverage improvements: site iteration, workflow upgrades, or both.",
  ],
  deliverables: [
    "Launch checklist + QA pass",
    "Analytics verification (events + conversions)",
    "30-day optimization plan",
    "Systems Opportunities Report (optional but recommended)",
  ],
  flexOptions: [
    {
      label: "Basic Launch",
      description: "Ship cleanly and ensure everything works end-to-end.",
      includes: ["QA + deploy", "Forms verified", "Baseline tracking"],
    },
    {
      label: "Optimize",
      description: "Iterate based on conversion data.",
      includes: ["CTA tuning", "Section refinement", "Performance tweaks"],
    },
    {
      label: "Systems Roadmap",
      description: "Turn the site into an operational advantage.",
      includes: ["Workflow audit", "CRM + automation plan", "ROI-driven modules"],
    },
  ],
  needs: [
    "Where leads should go (email, CRM, inbox routing rules)",
    "Analytics access (or we set it up)",
    "Confirmation on booking/quote flow expectations",
  ],
  timeline: [
    "Launch day: QA + deploy + verification.",
    "Optimization: weekly iterations or a 30-day sprint depending on goals.",
  ],
  modules: [
    "CRM pipeline + lead routing",
    "Automated follow-up sequences",
    "Quote templates + structured intake",
    "Scanning/intake + database-backed tracking",
    "Dashboards (leads, sources, response times, conversion rates)",
  ],
};
