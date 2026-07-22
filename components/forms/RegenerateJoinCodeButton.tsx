"use client";

import { useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { regenerateJoinCodeAction } from "@/actions/classroom";
import { Button } from "@/components/ui/Button";

export function RegenerateJoinCodeButton({ classId }: { classId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() => startTransition(() => regenerateJoinCodeAction(classId))}
    >
      <RefreshCw className="h-3.5 w-3.5" /> {pending ? "Regenerating…" : "Regenerate code"}
    </Button>
  );
}
