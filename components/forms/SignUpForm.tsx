"use client";

import { useActionState, useState } from "react";
import { signUpAction, type ActionState } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input, Label, FieldError } from "@/components/ui/Input";
import { cn } from "@/lib/utilities/cn";

const initialState: ActionState = {};

const roles = [
  {
    value: "student",
    title: "Student",
    description: "Free forever. Lessons, drills, MCQs, FRQs, and progress tracking.",
  },
  {
    value: "teacher",
    title: "Teacher",
    description: "Free demo classroom. Upgrade to JavaChip Pro for your full roster.",
  },
] as const;

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUpAction, initialState);
  const [role, setRole] = useState<"student" | "teacher">("student");

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <fieldset className="grid grid-cols-2 gap-3">
        <legend className="sr-only">I&apos;m joining as a…</legend>
        {roles.map((r) => (
          <label
            key={r.value}
            className={cn(
              "cursor-pointer rounded-lg border p-3.5 text-left transition-colors",
              role === r.value
                ? "border-amber bg-amber/10"
                : "border-border bg-background-raised hover:border-latte/50"
            )}
          >
            <input
              type="radio"
              name="role"
              value={r.value}
              checked={role === r.value}
              onChange={() => setRole(r.value)}
              className="sr-only"
            />
            <span className="font-display text-base font-semibold text-foreground">{r.title}</span>
            <span className="mt-1 block text-xs text-foreground-muted">{r.description}</span>
          </label>
        ))}
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="displayName">Name</Label>
        <Input id="displayName" name="displayName" autoComplete="name" required />
        <FieldError>{state.fieldErrors?.displayName}</FieldError>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
        <FieldError>{state.fieldErrors?.email}</FieldError>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" required />
        <FieldError>{state.fieldErrors?.password}</FieldError>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required />
        <FieldError>{state.fieldErrors?.confirmPassword}</FieldError>
      </div>

      {state.error && <FieldError>{state.error}</FieldError>}

      <Button type="submit" disabled={pending} className="mt-2">
        {pending ? "Creating your account…" : `Create ${role} account`}
      </Button>

      <p className="text-center text-xs text-foreground-muted">
        By continuing you agree to JavaChip&apos;s{" "}
        <a href="/terms" className="underline hover:text-amber">Terms</a> and{" "}
        <a href="/privacy" className="underline hover:text-amber">Privacy Policy</a>.
      </p>
    </form>
  );
}
