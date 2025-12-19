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
  const [theme, setTheme] = useState<ThemeId>("classic");

  useEffect(() => {
    const initial = readTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  return (
    <div className="grid gap-3">
      <div>
        <div className="text-sm font-semibold">Color theme</div>
        <div className="mt-1 text-sm text-muted-foreground">
          Choose an accent palette. (Classic keeps your current scheme.)
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {THEMES.map((t) => {
          const active = t.id === theme;
          const dot = t.swatches?.[0] ?? "hsl(var(--ui-glow) / 1)";

          return (
            <button
              key={t.id}
              type="button"
              data-theme={t.id}
              onClick={() => {
                setTheme(t.id);
                applyTheme(t.id); // actually apply + persist
              }}
              className={cn(
                "h-6 w-6 rounded-full border overflow-hidden",
                "transition-transform hover:-translate-y-[1px]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                active ? "ring-2 ring-[hsl(var(--ui-glow)/0.55)]" : "ring-border"
              )}
              style={{
                backgroundImage: "var(--hero-wash)",
                backgroundColor: "white",
              }}
              aria-label={`Theme: ${t.name}`}
              aria-pressed={active}
            >
              <span className="sr-only">{t.name}</span>
            </button>

          );
        })}
      </div>



      {/* keep the rest of your configurator sections below if you have them */}
    </div>
  );
}
