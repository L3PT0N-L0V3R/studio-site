"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type FocusMode = "design" | "performance" | "motion" | "conversion" | null;

type SitePrefs = {
  introDismissed: boolean;
  focus: FocusMode;
  setIntroDismissed: (v: boolean) => void;
  setFocus: (v: FocusMode) => void;
  reset: () => void;
};

const STORAGE_KEYS = {
  introDismissed: "studio:introDismissed",
  focus: "studio:focus",
};

const Ctx = createContext<SitePrefs | null>(null);

export function SitePreferencesProvider({ children }: { children: React.ReactNode }) {
  const [introDismissed, setIntroDismissedState] = useState(false);
  const [focus, setFocusState] = useState<FocusMode>(null);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEYS.introDismissed);
      const storedFocus = localStorage.getItem(STORAGE_KEYS.focus) as FocusMode | null;

      setIntroDismissedState(dismissed === "true");
      setFocusState(storedFocus ?? null);
    } catch {
      // If storage is blocked, fail gracefully.
    }
  }, []);

  const setIntroDismissed = (v: boolean) => {
    setIntroDismissedState(v);
    try {
      localStorage.setItem(STORAGE_KEYS.introDismissed, String(v));
    } catch {}
  };

  const setFocus = (v: FocusMode) => {
    setFocusState(v);
    try {
      if (v) localStorage.setItem(STORAGE_KEYS.focus, v);
      else localStorage.removeItem(STORAGE_KEYS.focus);
    } catch {}
  };

  const reset = () => {
    setIntroDismissed(false);
    setFocus(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.introDismissed);
      localStorage.removeItem(STORAGE_KEYS.focus);
    } catch {}
  };

  const value = useMemo(
    () => ({ introDismissed, focus, setIntroDismissed, setFocus, reset }),
    [introDismissed, focus]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSitePreferences() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSitePreferences must be used within SitePreferencesProvider");
  return ctx;
}
