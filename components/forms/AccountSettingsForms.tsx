"use client";

import { useActionState } from "react";
import { updateEmailAction, changePasswordAction, deleteAccountAction } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

export function EmailForm({ currentEmail }: { currentEmail: string }) {
  const [state, formAction, pending] = useActionState(updateEmailAction, {});
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={currentEmail} required />
      </div>
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      {state.success && <p className="text-sm text-sage">Check your new inbox to confirm the change.</p>}
      <Button type="submit" disabled={pending} variant="secondary" className="w-fit">
        {pending ? "Updating…" : "Update email"}
      </Button>
    </form>
  );
}

export function PasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, {});
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">New password</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required />
      </div>
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      {state.success && <p className="text-sm text-sage">Password changed.</p>}
      <Button type="submit" disabled={pending} variant="secondary" className="w-fit">
        {pending ? "Updating…" : "Change password"}
      </Button>
    </form>
  );
}

export function DeleteAccountForm() {
  const [state, formAction, pending] = useActionState(deleteAccountAction, {});
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <p className="text-sm text-foreground-muted">
        This permanently deletes your account and all associated study data. This cannot be undone.
      </p>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirmation">Type DELETE to confirm</Label>
        <Input id="confirmation" name="confirmation" required />
      </div>
      {state.error && <p className="text-sm text-danger">{state.error}</p>}
      <Button type="submit" disabled={pending} variant="danger" className="w-fit">
        {pending ? "Deleting…" : "Delete my account"}
      </Button>
    </form>
  );
}
