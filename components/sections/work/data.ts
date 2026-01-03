// components/sections/work/data.ts

export type WorkItem = {
  slug: string;
  title: string;
  industry: string;
  tagline: string;
  highlights: string[];
  deliverables: string[];
  measurementPlan: string[];
};

export const workItems: WorkItem[] = [
  {
    slug: "hvac-contractor-lead-engine",
    title: "Local Contractor Lead Engine",
    industry: "Home Services (HVAC / Plumbing / Electrical)",
    tagline:
      "Fast-loading landing + quote flow + tracking that turns calls into measurable pipeline.",
    highlights: [
      "Single-purpose landing architecture with service-area clarity",
      "Quote request flow designed for mobile thumb ergonomics",
      "Call + form event tracking with clean attribution",
    ],
    deliverables: [
      "Landing page + 2 service pages",
      "Quote form with routing rules (service type, ZIP, urgency)",
      "Booking link integration (optional) + automated confirmations",
      "Analytics events: calls, form submits, booking clicks",
      "Performance pass: Core Web Vitals focused build",
    ],
    measurementPlan: [
      "Baseline vs post-launch: call clicks, form submits, booking conversions",
      "Traffic source attribution (organic, maps, paid, referrals)",
      "Speed + CWV reporting and bounce/engagement changes",
    ],
  },
  {
    slug: "dental-clinic-bookings",
    title: "Dental Clinic Booking Funnel",
    industry: "Healthcare (Dental / Ortho / Private Practice)",
    tagline:
      "Trust-forward website + appointment funnel + review capture that supports local SEO.",
    highlights: [
      "High-trust layout (proof, credentials, insurance, FAQs)",
      "Appointment funnel with intent-based routing",
      "Review capture + GBP support components",
    ],
    deliverables: [
      "Homepage + services hub + 3 core service pages",
      "Appointment request + insurance pre-check intake",
      "Review request flow (post-visit link + lightweight template)",
      "Schema basics + local SEO foundations",
      "Analytics events: appointment requests, phone taps, map taps",
    ],
    measurementPlan: [
      "Appointment request conversion rate",
      "Phone tap-through rate from mobile",
      "Local intent events: map taps, directions, hours interactions",
    ],
  },
  {
    slug: "medspa-offer-page",
    title: "Medspa Offer + Conversion Page",
    industry: "Medspa / Aesthetics / Boutique Wellness",
    tagline:
      "Offer-led landing with pricing clarity, trust proof, and conversion-first UX.",
    highlights: [
      "Offer clarity + price anchoring structure",
      "Before/after gallery pattern optimized for performance",
      "Low-friction booking flow with follow-up automation",
    ],
    deliverables: [
      "Offer landing page + treatment pages template",
      "Booking integration + intake form",
      "Automated confirmation + follow-up sequence hooks",
      "Analytics events: booking clicks, form submits, offer scroll depth",
    ],
    measurementPlan: [
      "Booking click-through rate and completed bookings",
      "Drop-off by section (scroll depth, CTA engagement)",
      "Lead quality by service type / offer variant",
    ],
  },
  {
    slug: "b2b-service-site",
    title: "B2B Services Site + Lead Routing",
    industry: "B2B Professional Services",
    tagline:
      "Positioning-first site with clear differentiation + lead routing that saves owner time.",
    highlights: [
      "Clear ICP targeting + positioning language framework",
      "Lead qualification routing to reduce unqualified inquiries",
      "Operational handoff: owner-friendly edits and analytics",
    ],
    deliverables: [
      "Homepage + services + process + contact",
      "Lead form with qualification fields + routing rules",
      "Email notifications + CRM handoff hooks",
      "Analytics events: qualified leads vs general inquiries",
    ],
    measurementPlan: [
      "Qualified lead rate (form field filters)",
      "Response time + close-loop follow-up tracking",
      "Channel performance (where good leads originate)",
    ],
  },
];
