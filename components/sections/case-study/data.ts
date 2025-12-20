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
  budgetTitle: "Performance preview",
  budgetDesc: "Estimate simulation.",
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
    practice: {
      title: "What this means in practice",
      body:
        "Your site stops acting like a brochure and starts acting like a reliable intake system—clean data in, correct routing, and fewer lost leads.",
      badges: ["Cleaner lead data", "Fewer missed leads", "Consistent routing"],
    },
  },
  {
    id: "crm",
    title: "CRM",
    subtitle: "Pipeline + customer context",
    body:
      "Turn submissions into trackable opportunities. Keep notes, stages, owners, and history in one place.",
    bullets: ["Stage design", "Owner assignment", "Context + history"],
    practice: {
      title: "What this means in practice",
      body:
        "Every lead has an owner, a stage, and a next step. No spreadsheet drift, no “who’s on it?”, and no context lost between handoffs.",
      badges: ["One source of truth", "Clear handoffs", "Faster follow-up"],
    },
  },
  {
    id: "automation",
    title: "Automation",
    subtitle: "Follow-ups without overhead",
    body:
      "Automate reminders, sequences, and internal tasks so leads don’t stall and the team stays aligned.",
    bullets: ["Email/SMS sequences", "Task creation", "Scheduling handoff"],
    practice: {
      title: "What this means in practice",
      body:
        "Speed-to-lead improves automatically. Prospects get timely follow-ups, your team gets tasks at the right moments, and opportunities don’t die in the gaps.",
      badges: ["Speed-to-lead", "No manual chasing", "Consistent touchpoints"],
    },
  },
  {
    id: "reporting",
    title: "Reporting",
    subtitle: "Visibility on what works",
    body:
      "Track conversion events and funnels so you can improve what matters—not guess.",
    bullets: ["Event plan", "Funnel view", "Attribution-ready data"],
    practice: {
      title: "What this means in practice",
      body:
        "You can see where leads drop, which pages create momentum, and what to fix next—so improvements are iterative, measurable, and defensible.",
      badges: ["Funnel visibility", "ROI clarity", "Iteration loops"],
    },
  },
] as const;


export type WiringNodeId = (typeof wiringNodes)[number]["id"];
