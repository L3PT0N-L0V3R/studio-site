export const caseStudyCopy = {
  eyebrow: "One interactive deliverable preview",
  title: "A compact simulation of what we ship.",
  description:
    "Adjust scope and complexity to see a realistic estimate range, a performance budget preview, and how the system wiring flows.",
  badge: "Client-style preview",
  inputsTitle: "Inputs",
  inputsDesc: "Use these once—everything below reacts.",
  timelineTitle: "Estimate timeline",
  timelineDesc: "Output range (not a promise—an estimate model).",
  budgetTitle: "Performance budget preview",
  budgetDesc: "Simulated Lighthouse-style card.",
  wiringTitle: "System wiring",
  wiringDesc: "Click nodes to see how the flow is built.",
  wiringTag: "intake → reporting",
  wiringSideTitle: "What this means in practice",
  wiringSideBody:
    "Your website becomes the front door, but the “win” is the system behind it: reliable intake, follow-ups that don’t drop, and reporting you can act on.",
  wiringBadges: ["Clear handoffs", "Audit-aware wiring", "Performance constraints"],
  footnote:
    "Assumes fast approvals and a defined offer. Add content writing, photo/video, or heavy compliance to extend scope.",
} as const;

export const wiringNodes = [
  {
    id: "intake",
    title: "Intake",
    subtitle: "Forms, routing, spam control",
    body:
      "Capture leads cleanly, validate inputs, and route to the right pipeline with predictable notifications.",
    bullets: ["Form schema + validation", "Spam + bot mitigation", "Notification rules"],
  },
  {
    id: "crm",
    title: "CRM",
    subtitle: "Pipeline + customer context",
    body:
      "Turn submissions into trackable opportunities. Keep notes, stages, owners, and history in one place.",
    bullets: ["Stage design", "Owner assignment", "Context + history"],
  },
  {
    id: "automation",
    title: "Automation",
    subtitle: "Follow-ups without overhead",
    body:
      "Automate reminders, sequences, and internal tasks so leads don’t stall and the team stays aligned.",
    bullets: ["Email/SMS sequences", "Task creation", "Scheduling handoff"],
  },
  {
    id: "reporting",
    title: "Reporting",
    subtitle: "Visibility on what works",
    body:
      "Track conversion events and funnels so you can improve what matters—not guess.",
    bullets: ["Event plan", "Funnel view", "Attribution-ready data"],
  },
] as const;

export type WiringNodeId = (typeof wiringNodes)[number]["id"];
