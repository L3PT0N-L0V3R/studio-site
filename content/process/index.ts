export * from "./types";

import { alignStep } from "./steps/align";
import { designStep } from "./steps/design";
import { buildStep } from "./steps/build";
import { launchStep } from "./steps/launch";

export const processSteps = [alignStep, designStep, buildStep, launchStep] as const;

export const getProcessStep = (slug: string) =>
  processSteps.find((s) => s.slug === slug);
