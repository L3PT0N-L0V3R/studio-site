export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function formatWeekRange(minWeeks: number, maxWeeks: number) {
  const a = clamp(Math.round(minWeeks * 10) / 10, 0.5, 52);
  const b = clamp(Math.round(maxWeeks * 10) / 10, 0.5, 52);

  const ai = Math.round(a);
  const bi = Math.round(b);
  if (Math.abs(a - ai) < 0.11 && Math.abs(b - bi) < 0.11) return `${ai}–${bi} weeks`;
  return `${a}–${b} weeks`;
}

export function estimateTimelineWeeks(pages: number, complexity: number) {
  // workdays model -> weeks
  const design = 2 + pages * 0.35 + complexity * 1.2;
  const build = 2 + pages * 0.45 + complexity * 1.4;
  const qa = 1 + complexity * 0.8 + pages * 0.15;

  const base = design + build + qa;
  const minDays = base * 0.85;
  const maxDays = base * 1.25;

  return {
    minWeeks: minDays / 5,
    maxWeeks: maxDays / 5,
    breakdownDays: {
      design: Math.round(design),
      build: Math.round(build),
      qa: Math.round(qa),
    },
  };
}

export function simulateLighthouse(pages: number, complexity: number) {
  return {
    performance: clamp(98 - pages * 1.2 - complexity * 6.5, 35, 99),
    accessibility: clamp(96 - complexity * 1.4, 70, 99),
    bestPractices: clamp(97 - complexity * 2.0, 65, 99),
    seo: clamp(94 - pages * 0.35, 70, 99),
  };
}
