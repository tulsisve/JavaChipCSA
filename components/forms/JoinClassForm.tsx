"use client";

import { useActionState } from "react";
import { joinClassAction } from "@/actions/classroom";
import { Button } from "@/components/ui/Button";
import { Input, FieldError } from "@/components/ui/Input";

export function JoinClassForm() {
  const [state, formAction, pending] = useActionState(joinClassAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="flex-1">
        <Input
          name="code"
          placeholder="Enter class code (e.g. 3F9A2C1B)"
          className="font-mono uppercase"
          aria-label="Class code"
          required
        />
        <FieldError>{state.error}</FieldError>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Joining…" : "Join class"}
      </Button>
    </form>
  );
}
