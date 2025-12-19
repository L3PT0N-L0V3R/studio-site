"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type FocusMode = "design" | "performance" | "conversion" | null;

type SitePrefs = {
  focus: FocusMode;
  setFocus: (v: FocusMode) => void;

  introDismissed: boolean;
  setIntroDismissed: (v: boolean) => void;
};

const STORAGE_FOCUS = "studio:focus";
const STORAGE_INTRO = "studio:introDismissed";

// Keep cookie names simple (server-readable later if you want)
const COOKIE_FOCUS = "studio_focus";
const COOKIE_INTRO = "studio_introDismissed";

const SitePreferencesContext = createContext<SitePrefs | null>(null);

function normalizeFocus(v: string | null): FocusMode {
  if (!v) return null;

  // Legacy mapping if you ever had "motion" stored
  if (v === "motion") return "design";

  if (v === "design" || v === "performance" || v === "conversion") return v;
  return null;
}

function readLocalFocus(): FocusMode {
  try {
    return normalizeFocus(localStorage.getItem(STORAGE_FOCUS));
  } catch {
    return null;
  }
}

function readLocalIntroDismissed(): boolean {
  try {
    return localStorage.getItem(STORAGE_INTRO) === "1";
  } catch {
    return false;
  }
}

function writeCookie(name: string, value: string) {
  try {
    // 1 year
    document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax`;
  } catch {}
}

function persistFocus(v: FocusMode) {
  try {
    if (v) localStorage.setItem(STORAGE_FOCUS, v);
    else localStorage.removeItem(STORAGE_FOCUS);
  } catch {}

  writeCookie(COOKIE_FOCUS, v ?? "");
}

function persistIntroDismissed(v: boolean) {
  try {
    localStorage.setItem(STORAGE_INTRO, v ? "1" : "0");
  } catch {}

  writeCookie(COOKIE_INTRO, v ? "1" : "0");
}

export function SitePreferencesProvider(props: {
  children: React.ReactNode;
  /**
   * Optional server-provided defaults (keeps things “Option B ready”).
   * If you don’t pass these, client storage will be used.
   */
  initialFocus?: FocusMode;
  initialIntroDismissed?: boolean;
}) {
  const { children, initialFocus, initialIntroDismissed } = props;

  const [focus, _setFocus] = useState<FocusMode>(initialFocus ?? null);
  const [introDismissed, _setIntroDismissed] = useState<boolean>(initialIntroDismissed ?? false);

  // Hydrate from localStorage on mount (authoritative on client)
  useEffect(() => {
    const f = readLocalFocus();
    const d = readLocalIntroDismissed();

    if (f !== null) _setFocus(f);
    if (d !== false) _setIntroDismissed(d);
  }, []);

  const setFocus = (v: FocusMode) => {
    _setFocus(v);
    persistFocus(v);
  };

  const setIntroDismissed = (v: boolean) => {
    _setIntroDismissed(v);
    persistIntroDismissed(v);
  };

  const value = useMemo(
    () => ({
      focus,
      setFocus,
      introDismissed,
      setIntroDismissed,
    }),
    [focus, introDismissed]
  );

  return <SitePreferencesContext.Provider value={value}>{children}</SitePreferencesContext.Provider>;
}

export function useSitePreferences() {
  const ctx = useContext(SitePreferencesContext);
  if (!ctx) throw new Error("useSitePreferences must be used within <SitePreferencesProvider />");
  return ctx;
}
