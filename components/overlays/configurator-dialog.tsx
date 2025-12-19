"use client";

import { useEffect, useMemo, useState } from "react";
import { THEMES, type ThemeId, THEME_STORAGE_KEY } from "@/lib/themes";
import { cn } from "@/lib/utils";

// ...keep your existing dialog imports/structure

function applyTheme(id: ThemeId) {
  document.documentElement.dataset.theme = id;
  localStorage.setItem(THEME_STORAGE_KEY, id);
}

function readTheme(): ThemeId {
  const saved = (typeof window !== "undefined" && localStorage.getItem(THEME_STORAGE_KEY)) as ThemeId | null;
  return saved ?? "classic";
}

export function ConfiguratorDialog() {

  return (
    <div className="grid gap-3">

      {/* keep te rest of your configurator sections below if you have them */}
    </div>
  );
}
