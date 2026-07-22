"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";
import type { ActionState } from "@/actions/auth";
import type { ThemePreference } from "@/types/database";

export async function updatePreferencesAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const supabase = await createClient();

  const { error } = await supabase
    .from("user_preferences")
    .update({
      theme: (formData.get("theme") as ThemePreference) || "system",
      reduced_motion: formData.get("reducedMotion") === "on",
      high_contrast: formData.get("highContrast") === "on",
      text_size: (formData.get("textSize") as string) || "md",
      ambient_audio_enabled: formData.get("ambientAudio") === "on",
    })
    .eq("user_id", user.id);

  if (error) return { error: "Couldn't save your preferences." };

  revalidatePath("/student/settings");
  revalidatePath("/teacher/settings");
  return { success: true };
}
