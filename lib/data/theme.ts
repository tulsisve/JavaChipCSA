import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface AppearanceAttributes {
  theme?: "light" | "dark";
  contrast?: "high";
  reducedMotion?: boolean;
}

/**
 * Resolves a signed-in user's saved appearance preferences into the DOM
 * attributes globals.css keys off of (data-theme, data-contrast,
 * data-reduced-motion). JavaChip's brand default is the dark café theme —
 * this only ever narrows away from that default on an explicit opt-in, it
 * never follows the visitor's OS color-scheme.
 *
 * Callers should already have a user id in hand (e.g. from requireUser() in
 * a dashboard layout) rather than this module re-resolving the session —
 * it's only ever needed once someone is already signed in.
 */
export async function getAppearanceAttributes(userId: string): Promise<AppearanceAttributes> {
  try {
    const supabase = await createClient();
    const { data: prefs } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!prefs) return {};

    return {
      theme: prefs.theme === "light" ? "light" : undefined,
      contrast: prefs.high_contrast ? "high" : undefined,
      reducedMotion: prefs.reduced_motion,
    };
  } catch {
    return {};
  }
}
