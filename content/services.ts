export type ServiceTier = {
  name: string;
  priceFrom: string;
  bullets: string[];
};

export const tiers: ServiceTier[] = [
  {
    name: "Starter",
    priceFrom: "$1,500+",
    bullets: ["1–5 pages", "Mobile-first", "Fast launch", "Basic SEO + analytics"],
  },
  {
    name: "Business",
    priceFrom: "$3,500+",
    bullets: ["5–10 pages", "CMS-ready", "Performance tuned", "On-page SEO"],
  },
  {
    name: "Premium",
    priceFrom: "$8,000+",
    bullets: ["Custom design system", "Advanced motion", "Integrations", "Priority support"],
  },
];
