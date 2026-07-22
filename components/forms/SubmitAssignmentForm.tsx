"use client";

import { useActionState } from "react";
import { submitAssignmentAction } from "@/actions/classroom";
import { Button } from "@/components/ui/Button";

export function SubmitAssignmentForm({ assignmentId }: { assignmentId: string }) {
  const [state, formAction, pending] = useActionState(submitAssignmentAction, {});

  if (state.success) {
    return <p className="text-sm text-sage">Submitted. Your teacher will review it soon.</p>;
  }

  return (
    <form action={formAction} className="flex items-center gap-3">
      <input type="hidden" name="assignmentId" value={assignmentId} />
      <Button type="submit" disabled={pending}>{pending ? "Submitting…" : "Mark as submitted"}</Button>
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
    </form>
  );
}
