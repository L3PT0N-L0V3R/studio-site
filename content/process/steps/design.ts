import type { ProcessStep } from "../types";

export const designStep: ProcessStep = {
  slug: "design",
  step: "02",
  title: "Design",
  summary:
    "We design the mobile-first experience and define a motion system that feels smooth, modern, and controlled.",

  flexibility: ["Clean & minimal", "Premium motion pass", "Scroll narrative (selective)"],
  outputs: ["Page layouts", "Motion rules", "CTA + copy structure"],

  accomplishes: [
    "Designs the customer journey so the site is clear, credible, and conversion-focused.",
    "Defines the visual system (type, spacing, components) so everything stays consistent.",
    "Defines the motion system (scroll reveals, hover/tap physics, micro-interactions) so it feels premium—not gimmicky.",
  ],
  deliverables: [
    "Layouts for key pages (Home, Services, About/Mission, Work/Proof, Contact)",
    "Interaction spec (timing, easing, hover/tap behavior, scroll reveal rules)",
    "Copy structure guidance (headlines, proof, friction removal, CTAs)",
    "Mobile behavior rules (thumb-friendly spacing, tap targets, drawer nav patterns)",
  ],
  flexOptions: [
    {
      label: "Clean & Minimal",
      description: "Subtle motion, maximum clarity, fast execution.",
      includes: ["Light reveals", "Minimal hover", "Conversion-first layout"],
    },
    {
      label: "Interactive Premium",
      description: "App-like feel with controlled motion across the site.",
      includes: ["Scale-in sections", "Hover physics", "Polished transitions"],
    },
    {
      label: "Cinematic (Selective)",
      description: "Scroll storytelling only where it improves clarity.",
      includes: ["Narrative sections", "Parallax accents", "High restraint"],
    },
  ],
  needs: [
    "Logo/colors (optional)",
    "Photos/examples (optional; we can start text-first)",
    "Primary CTA: booking vs quote vs purchase",
    "Any constraints (industry tone, compliance, required disclaimers)",
  ],
  timeline: [
    "Typically 2–5 days depending on scope and revision speed.",
    "We can start with a direction pass and iterate into final polish.",
  ],
  modules: [
    "Brand refresh (type system + spacing rules)",
    "Copywriting support (conversion-focused wording)",
    "Photography direction (what to capture for credibility)",
  ],
};
