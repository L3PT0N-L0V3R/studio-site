"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const KEY_PREFIX = "qs:scroll:";

function getUrlKey() {
  // Use the real browser URL so query changes are included (without useSearchParams)
  if (typeof window === "undefined") return KEY_PREFIX + "ssr";
  return KEY_PREFIX + window.location.pathname + window.location.search;
}

export function ScrollRestoration() {
  // We only use pathname as a signal that route changed.
  // The actual key is derived from window.location so it includes search params.
  usePathname();

  const isPopRef = useRef(false);
  const lockUntilRef = useRef(0);
  const targetRef = useRef<number | null>(null);

  // Keep a stable scroll-behavior toggle (prevents smooth scroll fights)
  const prevScrollBehaviorRef = useRef<string | null>(null);

  // Save scroll position for current URL
  useEffect(() => {
    if (typeof window === "undefined") return;

    const save = () => {
      try {
        const key = getUrlKey();
        sessionStorage.setItem(key, String(window.scrollY));
      } catch {
        // ignore
      }
    };

    const onScroll = () => {
      // During a pop restore lock, ignore user scroll saving (prevents overwriting the stored value)
      if (isPopRef.current && performance.now() <= lockUntilRef.current) return;
      save();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", save);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") save();
    });

    // Save once on mount
    save();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", save);
      // visibilitychange handler is anonymous; fine to leave (low impact) or refactor if desired
    };
  }, []);

  // Detect back/forward
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onPopState = () => {
      isPopRef.current = true;

      // Lock window where we aggressively enforce scroll position
      lockUntilRef.current = performance.now() + 1800;

      // Pull target from session
      let target = 0;
      try {
        const key = getUrlKey();
        const stored = sessionStorage.getItem(key);
        target = stored ? Number(stored) : 0;
      } catch {
        target = 0;
      }
      targetRef.current = target;

      // Disable smooth scrolling during restore so it snaps instantly
      const root = document.documentElement;
      prevScrollBehaviorRef.current = root.style.scrollBehavior || null;
      root.style.scrollBehavior = "auto";

      // Start enforcing immediately
      enforceScroll(target);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);

    function enforceScroll(target: number) {
      // If something scrolls us to the top after back nav, we snap back repeatedly.
      const start = performance.now();
      const maxMs = 1800;
      const intervalMs = 50;

      // A couple RAFs first (layout settle)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo(0, target);
        });
      });

      // Then a timed enforcement loop
      const id = window.setInterval(() => {
        const elapsed = performance.now() - start;
        if (elapsed > maxMs) {
          window.clearInterval(id);

          // Restore scroll-behavior
          const root = document.documentElement;
          const prev = prevScrollBehaviorRef.current;
          root.style.scrollBehavior = prev ?? "";

          // End pop mode shortly after
          setTimeout(() => {
            isPopRef.current = false;
            targetRef.current = null;
          }, 50);

          return;
        }

        // Only re-apply if we got yanked away from target
        if (Math.abs(window.scrollY - target) > 2) {
          window.scrollTo(0, target);
        }
      }, intervalMs);

      // Also re-apply on any scroll events during the lock window
      const onAnyScroll = () => {
        if (!isPopRef.current) return;
        if (performance.now() > lockUntilRef.current) return;
        const t = targetRef.current;
        if (t == null) return;
        if (Math.abs(window.scrollY - t) > 2) {
          window.scrollTo(0, t);
        }
      };

      window.addEventListener("scroll", onAnyScroll, { passive: true });
      setTimeout(() => window.removeEventListener("scroll", onAnyScroll), maxMs + 100);
    }
  }, []);

  // Extra defense: block scrollIntoView during pop restore window (common culprit)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const original = Element.prototype.scrollIntoView;

    Element.prototype.scrollIntoView = function (...args: any[]) {
      if (isPopRef.current && performance.now() <= lockUntilRef.current) return;
      return original.apply(this, args as any);
    };

    return () => {
      Element.prototype.scrollIntoView = original;
    };
  }, []);

  return null;
}
