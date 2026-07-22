"use client";

import { useActionState } from "react";
import { createPortalSessionAction } from "@/actions/billing";
import { Button } from "@/components/ui/Button";

export function PortalButton() {
  const [state, formAction, pending] = useActionState(createPortalSessionAction, {});

  return (
    <form action={formAction}>
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? "Opening…" : "Manage billing"}
      </Button>
      {state.error && <p className="mt-2 text-xs text-danger">{state.error}</p>}
    </form>
  );
}
