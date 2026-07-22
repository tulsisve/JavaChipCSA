"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import type { ProfileRow } from "@/types/database";

export function ProfileForm({ profile }: { profile: ProfileRow }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="displayName">Name</Label>
        <Input id="displayName" name="displayName" defaultValue={profile.display_name} required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="schoolName">School</Label>
        <Input id="schoolName" name="schoolName" defaultValue={profile.school_name ?? ""} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="graduationYear">Graduation year</Label>
        <Input id="graduationYear" name="graduationYear" type="number" defaultValue={profile.graduation_year ?? ""} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" defaultValue={profile.bio ?? ""} maxLength={500} />
      </div>
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      {state.success && <p className="text-sm text-sage">Profile updated.</p>}
      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
