"use client";

import { useActionState } from "react";
import { createCheckoutSessionAction } from "@/actions/billing";
import { Button } from "@/components/ui/Button";

export function CheckoutButton({ plan, label }: { plan: "monthly" | "annual"; label: string }) {
  const [state, formAction, pending] = useActionState(createCheckoutSessionAction, {});

  return (
    <form action={formAction}>
      <input type="hidden" name="plan" value={plan} />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Redirecting to Stripe…" : label}
      </Button>
      {state.error && <p className="mt-2 text-xs text-danger">{state.error}</p>}
    </form>
  );
}
