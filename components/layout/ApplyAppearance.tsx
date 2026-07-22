"use client";

import { useEffect } from "react";
import type { AppearanceAttributes } from "@/lib/data/theme";

/**
 * Applies a signed-in user's saved appearance preferences to <html> on the
 * client, scoped to the authenticated dashboard shells only. Doing this
 * client-side (instead of in the root layout) keeps public/marketing/auth
 * pages statically generated — reading the preference server-side there
 * would force cookies() on every request and lose that optimization for a
 * feature that only matters once someone is signed in.
 */
export function ApplyAppearance({ theme, contrast, reducedMotion }: AppearanceAttributes) {
  useEffect(() => {
    const root = document.documentElement;
    if (theme) root.setAttribute("data-theme", theme);
    if (contrast) root.setAttribute("data-contrast", contrast);
    if (reducedMotion) root.setAttribute("data-reduced-motion", "true");

    return () => {
      root.removeAttribute("data-theme");
      root.removeAttribute("data-contrast");
      root.removeAttribute("data-reduced-motion");
    };
  }, [theme, contrast, reducedMotion]);

  return null;
}
