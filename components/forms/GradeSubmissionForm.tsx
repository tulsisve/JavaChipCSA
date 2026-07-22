"use client";

import { useActionState } from "react";
import { gradeSubmissionAction } from "@/actions/classroom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function GradeSubmissionForm({ submissionId, classId }: { submissionId: string; classId: string }) {
  const [state, formAction, pending] = useActionState(gradeSubmissionAction, {});

  if (state.success) {
    return <p className="text-xs text-sage">Grade saved.</p>;
  }

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="submissionId" value={submissionId} />
      <input type="hidden" name="classId" value={classId} />
      <Input name="score" type="number" min={0} max={10} placeholder="Score /10" className="h-9 w-24 text-xs" required />
      <Button type="submit" size="sm" variant="secondary" disabled={pending}>
        {pending ? "Saving…" : "Grade"}
      </Button>
      {state.error && <span className="text-xs text-danger">{state.error}</span>}
    </form>
  );
}
