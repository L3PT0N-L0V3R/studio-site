export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function bilerp(v00: number, v10: number, v01: number, v11: number, x: number, y: number) {
  // x = pages normalized, y = complexity normalized
  const a = lerp(v00, v10, x);
  const b = lerp(v01, v11, x);
  return lerp(a, b, y);
}

function roundInt(n: number) {
  return Math.round(n);
}

export function formatWeekRange(minWeeks: number, maxWeeks: number) {
  const a = clamp(Math.round(minWeeks * 10) / 10, 0.5, 52);
  const b = clamp(Math.round(maxWeeks * 10) / 10, 0.5, 52);

  const ai = Math.round(a);
  const bi = Math.round(b);
  if (Math.abs(a - ai) < 0.11 && Math.abs(b - bi) < 0.11) return `${ai}–${bi} weeks`;
  return `${a}–${b} weeks`;
}

export function formatDayRange(minDays: number, maxDays: number) {
  const a = Math.max(1, Math.round(minDays));
  const b = Math.max(a, Math.round(maxDays));
  return a === b ? `${a}d` : `${a}–${b}d`;
}

export function estimateTimelineWeeks(pages: number, complexity: number) {
  // Normalize inputs
  const p = clamp((pages - 1) / 24, 0, 1); // 1..25
  const c = clamp((complexity - 1) / 4, 0, 1); // 1..5

  // Corner constraints (per your requirements):
  // Min pages + Min complexity => 1–3 weeks
  // Max pages + Min complexity => 3–5 weeks
  // Min pages + Max complexity => 4–8 weeks
  // Max pages + Max complexity => 6–10 weeks
  const minWeeks = bilerp(1, 3, 4, 6, p, c);
  const maxWeeks = bilerp(3, 5, 8, 10, p, c);

  const minDays = minWeeks * 5;
  const maxDays = maxWeeks * 5;

  // Split into phases (ranged)
  const designFrac = 0.33;
  const buildFrac = 0.45;
  const qaFrac = 0.22;

  return {
    minWeeks,
    maxWeeks,
    breakdownDays: {
      design: { min: minDays * designFrac, max: maxDays * designFrac },
      build: { min: minDays * buildFrac, max: maxDays * buildFrac },
      qa: { min: minDays * qaFrac, max: maxDays * qaFrac },
    },
  };
}

export function simulateLighthouse(pages: number, complexity: number) {
  // Normalize inputs
  const p = clamp((pages - 1) / 24, 0, 1);
  const c = clamp((complexity - 1) / 4, 0, 1);

  // "Surface area" increases with scope; "polish headroom" decreases.
  // We use this to make 100 possible, but harder as scope grows.
  const surface = 0.55 * p + 0.45 * c; // 0..1
  const polish = 1 - surface; // 1..0

  // SEO tends to peak when there are enough pages to justify structure/content,
  // but not so many that it becomes a sprawling IA problem.
  // Peak centered around p ≈ 0.4 (roughly 10 pages if max is 25).
  const pageCenter = 0.4;
  const pageShape = clamp(1 - ((p - pageCenter) * (p - pageCenter)) / 0.16, 0, 1); // 0..1

  // QUALITY GATES (can hit 100 on simpler scope, but drift toward 85 as scope expands)
  // These intentionally do NOT increase with complexity: more complexity = more risk surface.
  const accessibility = clamp(roundInt(90 + 10 * polish - 3.5 * c - 4.0 * p), 85, 100);
  const bestPractices = clamp(roundInt(89 + 11 * polish - 3.0 * c - 3.0 * p), 85, 100);
  const seo = clamp(roundInt(88 + 8 * pageShape + 7 * polish - 2.0 * c - 1.0 * p), 85, 100);

  // CAPABILITY METRICS (these are the "why you might want complexity")
  // These rise with complexity (and a bit with pages), and can hit 100 at high complexity.
  // They do not all peak at low scope, so you can't max everything simultaneously.
  const instrumentation = clamp(roundInt(85 + 14.5 * c + 4.5 * p), 85, 100);
  const automation = clamp(roundInt(85 + 13.0 * c + 4.0 * p), 85, 100);
  const integration = clamp(roundInt(85 + 15.0 * c + 3.5 * p), 85, 100);

  return {
    accessibility,
    bestPractices,
    seo,
    instrumentation,
    automation,
    integration,
  };
}
