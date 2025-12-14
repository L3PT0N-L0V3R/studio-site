export type WorkItem = {
  title: string;
  description: string;
  tags: string[];
};

export const work: WorkItem[] = [
  {
    title: "Fastgrab — Interactive Jackpot UI",
    description: "Responsive, modular UI with dynamic stats and selection grid.",
    tags: ["Next.js", "UI Systems", "Motion"],
  },
  {
    title: "Conversion Landing — Performance-First",
    description: "SEO-ready, fast load, clear offer structure and lead capture.",
    tags: ["SEO", "Core Web Vitals", "Accessibility"],
  },
  {
    title: "Product Showcase — Scroll Narrative",
    description: "Scroll-driven storytelling with controlled motion and typography.",
    tags: ["Framer Motion", "Scroll", "Design"],
  },
];
