"use client";

import { useActionState } from "react";
import { updatePreferencesAction } from "@/actions/preferences";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Input";
import type { UserPreferencesRow } from "@/types/database";

export function PreferencesForm({ preferences }: { preferences: UserPreferencesRow | null }) {
  const [state, formAction, pending] = useActionState(updatePreferencesAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="theme">Theme</Label>
        <select
          id="theme"
          name="theme"
          defaultValue={preferences?.theme ?? "system"}
          className="h-11 rounded-md border border-border bg-background-raised px-3.5 text-sm text-foreground"
        >
          <option value="system">Match system</option>
          <option value="dark">Dark (espresso)</option>
          <option value="light">Light (parchment)</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="textSize">Text size</Label>
        <select
          id="textSize"
          name="textSize"
          defaultValue={preferences?.text_size ?? "md"}
          className="h-11 rounded-md border border-border bg-background-raised px-3.5 text-sm text-foreground"
        >
          <option value="sm">Small</option>
          <option value="md">Default</option>
          <option value="lg">Large</option>
        </select>
      </div>

      <label className="flex items-center gap-3 text-sm text-foreground">
        <input type="checkbox" name="reducedMotion" defaultChecked={preferences?.reduced_motion} className="h-4 w-4" />
        Reduce motion (disables ambient rain and decorative transitions)
      </label>

      <label className="flex items-center gap-3 text-sm text-foreground">
        <input type="checkbox" name="highContrast" defaultChecked={preferences?.high_contrast} className="h-4 w-4" />
        High-contrast mode
      </label>

      <label className="flex items-center gap-3 text-sm text-foreground">
        <input type="checkbox" name="ambientAudio" defaultChecked={preferences?.ambient_audio_enabled} className="h-4 w-4" />
        Enable ambient rain audio (muted by default)
      </label>

      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      {state.success && <p className="text-sm text-sage">Preferences saved.</p>}
      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Saving…" : "Save preferences"}
      </Button>
    </form>
  );
}
