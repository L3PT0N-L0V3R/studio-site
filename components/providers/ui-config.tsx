"use client";

import * as React from "react";

export type MotionLevel = "minimal" | "premium" | "signature";
export type Density = "spacious" | "compact";
export type CtaStyle = "solid" | "outline" | "ghost";

type UiConfigState = {
  motion: MotionLevel;
  density: Density;
  cta: CtaStyle;
};

type UiConfigContextValue = UiConfigState & {
  setMotion: (v: MotionLevel) => void;
  setDensity: (v: Density) => void;
  setCta: (v: CtaStyle) => void;
  reset: () => void;
};

const DEFAULTS: UiConfigState = {
  motion: "premium",
  density: "spacious",
  cta: "solid",
};

const STORAGE_KEY = "studio_ui_config_v1";

const UiConfigContext = React.createContext<UiConfigContextValue | null>(null);

function applyDataAttrs(state: UiConfigState) {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  el.dataset.motion = state.motion;
  el.dataset.density = state.density;
  el.dataset.cta = state.cta;
}

export function UiConfigProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<UiConfigState>(DEFAULTS);

  // Load once
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        applyDataAttrs(DEFAULTS);
        return;
      }
      const parsed = JSON.parse(raw) as Partial<UiConfigState>;
      const next: UiConfigState = {
        motion: parsed.motion ?? DEFAULTS.motion,
        density: parsed.density ?? DEFAULTS.density,
        cta: parsed.cta ?? DEFAULTS.cta,
      };
      setState(next);
      applyDataAttrs(next);
    } catch {
      applyDataAttrs(DEFAULTS);
    }
  }, []);

  // Persist + set html data-attrs
  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
    applyDataAttrs(state);
  }, [state]);

  const value = React.useMemo<UiConfigContextValue>(() => {
    return {
      ...state,
      setMotion: (motion) => setState((s) => ({ ...s, motion })),
      setDensity: (density) => setState((s) => ({ ...s, density })),
      setCta: (cta) => setState((s) => ({ ...s, cta })),
      reset: () => setState(DEFAULTS),
    };
  }, [state]);

  return <UiConfigContext.Provider value={value}>{children}</UiConfigContext.Provider>;
}

export function useUiConfig() {
  const ctx = React.useContext(UiConfigContext);
  if (!ctx) throw new Error("useUiConfig must be used within UiConfigProvider");
  return ctx;
}

// Small helpers used across the site
export function useSectionSpacing() {
  const { density } = useUiConfig();
  return density === "compact" ? "py-10 sm:py-14" : "py-14 sm:py-20";
}

export function useGridGap() {
  const { density } = useUiConfig();
  return density === "compact" ? "gap-3" : "gap-4";
}

export function useCtaVariants() {
  const { cta } = useUiConfig();
  if (cta === "outline") return { primary: "outline" as const, secondary: "ghost" as const };
  if (cta === "ghost") return { primary: "ghost" as const, secondary: "outline" as const };
  return { primary: "default" as const, secondary: "outline" as const };
}
