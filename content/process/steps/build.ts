import type { ProcessStep } from "../types";

export const buildStep: ProcessStep = {
  slug: "build",
  step: "03",
  title: "Build",
  summary:
    "We build a fast, modular site with a clean conversion pipeline—then optionally wire in automation, CRM, or commerce.",

  flexibility: ["Landing only", "Multi-page marketing site", "Systems-ready buildout"],
  outputs: ["Production site", "Conversion pipeline", "SEO + performance baseline"],

  accomplishes: [
    "Implements the site as modular components so updates and iteration are painless.",
    "Wires the conversion path (forms, booking, quotes) with clear routing and tracking.",
    "Leaves room for system upgrades once the site proves what’s working.",
  ],
  deliverables: [
    "Multi-page site (Home, Services, About/Mission, Work/Proof, Contact)",
    "Booking/quote/contact flows + routing",
    "SEO baseline (metadata, structure, indexing readiness)",
    "Performance pass (fast loads, mobile responsiveness)",
    "Analytics events (CTA clicks, form submits, key actions)",
  ],
  flexOptions: [
    {
      label: "Launchpad Build",
      description: "The ideal entry point: premium presence + conversion flow.",
      includes: ["Core pages", "Conversion form", "Baseline tracking"],
    },
    {
      label: "Growth Build",
      description: "Higher conversion intent with iteration hooks.",
      includes: ["Event tracking", "A/B-ready structure", "Optimization plan"],
    },
    {
      label: "Systems Build",
      description: "Connect the site to operational workflows when needed.",
      includes: ["CRM wiring", "Automations", "Data-backed features (as scoped)"],
    },
  ],
  needs: [
    "Final content (or we help shape it)",
    "Access to domain/DNS (when launching)",
    "Any existing tools (booking, forms, CRM, email) we should integrate",
  ],
  timeline: [
    "Launchpad: often 3–10 days depending on content readiness.",
    "Growth/Systems: scoped based on modules selected.",
  ],
  modules: [
    "CRM integration (pipeline stages + ownership)",
    "Email/SMS automation (follow-ups, reminders, confirmations)",
    "Commerce (Shopify integration, product pages, checkout)",
    "Custom internal tools (dashboards, intake views, admin panels)",
    "Scanning workflows (QR intake, asset/job tracking)",
  ],
};
