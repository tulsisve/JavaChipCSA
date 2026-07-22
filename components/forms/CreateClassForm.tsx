"use client";

import { useActionState } from "react";
import { createClassAction } from "@/actions/classroom";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";

export function CreateClassForm() {
  const [state, formAction, pending] = useActionState(createClassAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Class name</Label>
        <Input id="name" name="name" placeholder="Period 3 — AP CSA" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="period">Period</Label>
          <Input id="period" name="period" placeholder="3" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="schoolYear">School year</Label>
          <Input id="schoolYear" name="schoolYear" placeholder="2025-2026" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" placeholder="Optional notes about this class" />
      </div>
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Creating…" : "Create class"}
      </Button>
    </form>
  );
}
