"use client";

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { markLessonCompleteAction } from "@/actions/progress";
import { Button } from "@/components/ui/Button";

export function MarkCompleteButton({
  lessonId,
  unitSlug,
  lessonSlug,
}: {
  lessonId: string;
  unitSlug: string;
  lessonSlug: string;
}) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p className="flex items-center gap-2 text-sm text-sage">
        <CheckCircle2 className="h-4 w-4" /> Lesson marked complete. Mastery increased.
      </p>
    );
  }

  return (
    <Button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await markLessonCompleteAction(lessonId, unitSlug, lessonSlug);
          setDone(true);
        })
      }
    >
      {pending ? "Saving…" : "Mark lesson complete"}
    </Button>
  );
}
