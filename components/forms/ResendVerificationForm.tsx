"use client";

import { useActionState } from "react";
import { resendVerificationAction, type ActionState } from "@/actions/auth";
import { Button } from "@/components/ui/Button";

const initialState: ActionState = {};

export function ResendVerificationForm({ email }: { email: string }) {
  const [state, formAction, pending] = useActionState(resendVerificationAction, initialState);

  return (
    <form action={formAction} className="flex flex-col items-center gap-3">
      <input type="hidden" name="email" value={email} />
      {state.success ? (
        <p className="text-sm text-sage">Verification email resent — check your inbox.</p>
      ) : (
        <Button type="submit" variant="secondary" disabled={pending}>
          {pending ? "Sending…" : "Resend verification email"}
        </Button>
      )}
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
    </form>
  );
}
