"use client";

import { useActionState } from "react";
import { createAssignmentAction } from "@/actions/classroom";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";

export interface AssignableContentOption {
  contentType: string;
  contentId: string;
  label: string;
}

export function CreateAssignmentForm({
  classId,
  options,
}: {
  classId: string;
  options: AssignableContentOption[];
}) {
  const [state, formAction, pending] = useActionState(createAssignmentAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="classId" value={classId} />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" placeholder="Unit 1 Checkpoint" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="instructions">Instructions</Label>
        <Textarea id="instructions" name="instructions" placeholder="What should students do?" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="dueAt">Due date</Label>
        <Input id="dueAt" name="dueAt" type="datetime-local" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="content">Assigned content</Label>
        <select
          id="content"
          name="contentOption"
          onChange={(e) => {
            const [contentType, contentId] = e.target.value.split("::");
            const typeInput = e.currentTarget.form?.elements.namedItem("contentType") as HTMLInputElement | null;
            const idInput = e.currentTarget.form?.elements.namedItem("contentId") as HTMLInputElement | null;
            if (typeInput) typeInput.value = contentType ?? "";
            if (idInput) idInput.value = contentId ?? "";
          }}
          className="h-11 rounded-md border border-border bg-background-raised px-3.5 text-sm text-foreground"
          defaultValue=""
        >
          <option value="" disabled>
            Select content to assign
          </option>
          {options.map((o) => (
            <option key={o.contentId} value={`${o.contentType}::${o.contentId}`}>
              {o.label}
            </option>
          ))}
        </select>
        <input type="hidden" name="contentType" defaultValue={options[0]?.contentType ?? ""} />
        <input type="hidden" name="contentId" defaultValue={options[0]?.contentId ?? ""} />
      </div>
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Publishing…" : "Publish assignment"}
      </Button>
    </form>
  );
}
