"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function Reveal({ prompt, children }: { prompt: string; children: React.ReactNode }) {
  const [shown, setShown] = useState(false);

  return (
    <div className="rounded-md border border-border p-4">
      <p className="text-sm text-foreground">{prompt}</p>
      {shown ? (
        <div className="mt-3 rounded-md bg-background-raised p-3 text-sm text-foreground-muted">{children}</div>
      ) : (
        <Button type="button" size="sm" variant="ghost" className="mt-3" onClick={() => setShown(true)}>
          Reveal answer
        </Button>
      )}
    </div>
  );
}
