"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const KEY_PREFIX = "qs:scroll:";

export function ScrollRestoration() {
  const pathname = usePathname();
  const isPopRef = useRef(false);

  // Mark next navigation as back/forward
  useEffect(() => {
    const onPopState = () => {
      isPopRef.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Save scroll position continuously for current route
  useEffect(() => {
    const key = KEY_PREFIX + pathname;

    const onScroll = () => {
      sessionStorage.setItem(key, String(window.scrollY));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Restore on route change (only if coming from back/forward)
  useEffect(() => {
    const key = KEY_PREFIX + pathname;

    if (isPopRef.current) {
      const stored = sessionStorage.getItem(key);
      const y = stored ? Number(stored) : 0;

      // Use a couple frames to let layout settle (helps mobile Safari)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo(0, y);
        });
      });
    } else {
      // On normal navigation, keep expected behavior (top)
      window.scrollTo(0, 0);
    }

    isPopRef.current = false;
  }, [pathname]);

  return null;
}
