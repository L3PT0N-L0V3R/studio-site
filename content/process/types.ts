export type ProcessSlug = "align" | "design" | "build" | "launch";

export type FlexOption = {
  label: string;
  description: string;
  includes: string[];
};

export type ProcessStep = {
  slug: ProcessSlug;
  step: string;
  title: string;
  summary: string;

  // Used on the Process section cards
  flexibility: string[];
  outputs: string[];

  // Used on the detail page
  accomplishes: string[];
  deliverables: string[];
  flexOptions: FlexOption[];
  needs: string[];
  timeline: string[];
  modules: string[];
};
