export type ThemeId = "classic" | "ocean" | "sunset" | "forest" | "mono";

export const THEMES: Array<{
  id: ThemeId;
  name: string;
  description: string;
  // purely for UI preview (doesn't control the actual CSS variables)
  swatches: string[];
}> = [
  {
    id: "classic",
    name: "Classic",
    description: "Your current scheme (default).",
    swatches: ["hsl(42 96% 56%)", "hsl(205 92% 56%)", "hsl(142 70% 42%)"],
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Cool, high-tech blues + teals.",
    swatches: ["hsl(205 92% 56%)", "hsl(189 86% 52%)", "hsl(164 76% 44%)"],
  },
  {
    id: "sunset",
    name: "Sunset",
    description: "Warm, premium oranges + magentas.",
    swatches: ["hsl(18 95% 56%)", "hsl(340 88% 60%)", "hsl(42 96% 56%)"],
  },
  {
    id: "forest",
    name: "Forest",
    description: "Confident greens for trust + stability.",
    swatches: ["hsl(142 70% 42%)", "hsl(160 62% 38%)", "hsl(92 55% 44%)"],
  },
  {
    id: "mono",
    name: "Mono",
    description: "Minimal grayscale accents.",
    swatches: ["hsl(222 10% 35%)", "hsl(222 10% 25%)", "hsl(222 10% 15%)"],
  },
];

export const THEME_STORAGE_KEY = "ui-theme";
