export type ServiceTier = "starter" | "growth" | "systems";

export const TIER_LABEL: Record<ServiceTier, string> = {
  starter: "Starter",
  growth: "Growth",
  systems: "Systems",
};

export const TIER_SUBHEAD: Record<ServiceTier, string> = {
  starter: "A premium, mobile-first site that’s clean, fast, and built to convert.",
  growth: "Conversion-first build with tracking and iteration hooks to improve performance.",
  systems: "Site + operations: CRM, automations, and workflow tools that reduce friction.",
};

export type SignalKind = "goal" | "integration" | "scope";

export type QuizOption = {
  id: string;
  label: string;
  score: Partial<Record<ServiceTier, number>>;
  signals?: Array<{ kind: SignalKind; value: string }>;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  helper?: string;
  options: QuizOption[];
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1_need",
    prompt: "What do you need right now?",
    options: [
      {
        id: "clean",
        label: "A clean, modern website (my current one is weak/nonexistent)",
        score: { starter: 3 },
        signals: [{ kind: "scope", value: "new site / refresh" }],
      },
      {
        id: "convert",
        label: "A site that converts better (more leads/bookings/sales)",
        score: { growth: 3 },
        signals: [{ kind: "goal", value: "conversion improvement" }],
      },
      {
        id: "systems",
        label: "A site + systems improvement (workflow, automation, CRM, internal tools)",
        score: { systems: 3 },
        signals: [{ kind: "integration", value: "systems" }],
      },
    ],
  },
  {
    id: "q2_pages",
    prompt: "How many pages do you expect?",
    options: [
      { id: "1", label: "1 page (landing page)", score: { starter: 2 }, signals: [{ kind: "scope", value: "landing page" }] },
      { id: "2_5", label: "2–5 pages", score: { starter: 2, growth: 1 }, signals: [{ kind: "scope", value: "multi-page site" }] },
      { id: "6_plus", label: "6+ pages / multiple services", score: { growth: 2, systems: 1 }, signals: [{ kind: "scope", value: "large site" }] },
      { id: "unsure", label: "Not sure", score: { starter: 1 } },
    ],
  },
  {
    id: "q3_goal",
    prompt: "What’s your primary goal?",
    options: [
      {
        id: "leads",
        label: "More calls / quote requests",
        score: { starter: 1, growth: 2 },
        signals: [{ kind: "goal", value: "lead gen" }],
      },
      {
        id: "booking",
        label: "Online booking / appointments",
        score: { starter: 1, growth: 2 },
        signals: [{ kind: "goal", value: "booking" }],
      },
      {
        id: "ecom",
        label: "Sell products online",
        score: { growth: 3 }, // locked: ecommerce -> growth
        signals: [{ kind: "goal", value: "ecommerce" }],
      },
      {
        id: "cred",
        label: "Look credible + explain services clearly",
        score: { starter: 2 },
        signals: [{ kind: "goal", value: "credibility" }],
      },
    ],
  },
  {
    id: "q4_integrations",
    prompt: "Do you need any integrations?",
    helper: "Choose the closest fit for now. You can upgrade later.",
    options: [
      {
        id: "none",
        label: "None, just a contact form",
        score: { starter: 2 },
      },
      {
        id: "booking_tool",
        label: "Booking tool (Calendly / similar)",
        score: { starter: 1, growth: 1 },
        signals: [{ kind: "integration", value: "booking tool" }],
      },
      {
        id: "email_marketing",
        label: "Email marketing (Mailchimp/Klaviyo)",
        score: { growth: 2 },
        signals: [{ kind: "integration", value: "email marketing" }],
      },
      {
        id: "crm",
        label: "CRM / pipeline tracking",
        score: { systems: 3 },
        signals: [{ kind: "integration", value: "crm" }],
      },
      {
        id: "custom_workflow",
        label: "Custom workflow (intake, scanning, dashboards)",
        score: { systems: 4 },
        signals: [{ kind: "integration", value: "custom workflow" }],
      },
    ],
  },
  {
    id: "q5_measurement",
    prompt: "How important is measurement & iteration?",
    options: [
      { id: "launch", label: "Just launch it clean", score: { starter: 2 } },
      {
        id: "track",
        label: "Track performance and improve over time",
        score: { growth: 3 },
        signals: [{ kind: "goal", value: "measurement/iteration" }],
      },
      {
        id: "funnel",
        label: "We need funnel events + optimization",
        score: { growth: 2, systems: 2 },
        signals: [{ kind: "goal", value: "funnel optimization" }],
      },
    ],
  },
  {
    id: "q6_content",
    prompt: "How ready is your content (text/photos)?",
    options: [
      { id: "ready", label: "We have everything ready", score: { starter: 1 } },
      { id: "some", label: "We have some, but need help shaping it", score: { starter: 1, growth: 1 } },
      { id: "none", label: "We need copy + structure from scratch", score: { growth: 2 } },
    ],
  },
  {
    id: "q7_timeline",
    prompt: "What’s your timeline?",
    options: [
      { id: "asap", label: "ASAP (1–2 weeks)", score: { starter: 2 } },
      { id: "2_6", label: "2–6 weeks", score: { growth: 1 } },
      { id: "flex", label: "Flexible", score: { systems: 1 } },
    ],
  },
];

export type QuizAnswerMap = Record<string, string>;

export type QuizResult = {
  scores: Record<ServiceTier, number>;
  recommended: ServiceTier;
  closeSecond?: ServiceTier;
  because: string[];
};

function hasIntegration(answers: QuizAnswerMap, optionId: string) {
  // q4 integrator signal
  return answers["q4_integrations"] === optionId;
}
function hasMeasurement(answers: QuizAnswerMap) {
  return answers["q5_measurement"] === "track" || answers["q5_measurement"] === "funnel";
}

export function evaluateQuiz(answers: QuizAnswerMap): QuizResult {
  const scores: Record<ServiceTier, number> = { starter: 0, growth: 0, systems: 0 };

  // gather signals from selected answers (used for "because you said" bullets)
  const selectedSignals: Array<{ kind: SignalKind; value: string }> = [];

  for (const q of quizQuestions) {
    const selectedId = answers[q.id];
    if (!selectedId) continue;
    const opt = q.options.find((o) => o.id === selectedId);
    if (!opt) continue;

    for (const [tier, pts] of Object.entries(opt.score)) {
      const t = tier as ServiceTier;
      scores[t] += pts ?? 0;
    }

    if (opt.signals) selectedSignals.push(...opt.signals);
  }

  // base pick
  const ranked = (Object.keys(scores) as ServiceTier[])
    .map((tier) => ({ tier, score: scores[tier] }))
    .sort((a, b) => b.score - a.score);

  let top = ranked[0].tier;
  const second = ranked[1].tier;

  // tie-breakers if close
  const diff = ranked[0].score - ranked[1].score;

  if (diff === 0) {
    if (hasIntegration(answers, "crm") || hasIntegration(answers, "custom_workflow")) top = "systems";
    else if (hasMeasurement(answers)) top = "growth";
    else top = "starter";
  }

  const closeSecond = diff <= 2 ? (top === ranked[0].tier ? second : ranked[0].tier) : undefined;

  // "Because you said..." bullets (max 3)
  const because: string[] = [];
  const goalSet = new Set(selectedSignals.filter((s) => s.kind === "goal").map((s) => s.value));
  const intSet = new Set(selectedSignals.filter((s) => s.kind === "integration").map((s) => s.value));

  if (goalSet.has("ecommerce")) because.push("You want to sell products online (Shopify-ready).");
  if (goalSet.has("booking")) because.push("You need booking/appointments integrated.");
  if (goalSet.has("measurement/iteration") || goalSet.has("funnel optimization"))
    because.push("You care about tracking performance and improving over time.");
  if (intSet.has("crm")) because.push("You want leads tracked through a CRM/pipeline.");
  if (intSet.has("custom workflow")) because.push("You’re considering custom workflows like intake/scanning/dashboards.");
  if (because.length === 0) because.push("You want a clean, modern build that’s easy to evolve.");

  return {
    scores,
    recommended: top,
    closeSecond: closeSecond && closeSecond !== top ? closeSecond : undefined,
    because: because.slice(0, 3),
  };
}
