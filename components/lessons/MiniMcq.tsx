"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utilities/cn";

export function MiniMcq({
  prompt,
  code,
  choices,
}: {
  prompt: string;
  code?: string;
  choices: { label: string; text: string; correct: boolean; explanation: string }[];
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="rounded-md border border-border p-4">
      <p className="text-sm font-medium text-foreground">{prompt}</p>
      {code && (
        <pre className="mt-2 overflow-x-auto rounded-md bg-surface-code p-3 font-mono text-xs text-parchment">{code}</pre>
      )}
      <div className="mt-3 flex flex-col gap-2">
        {choices.map((choice) => {
          const isSelected = selected === choice.label;
          const showResult = selected !== null;
          return (
            <button
              key={choice.label}
              type="button"
              onClick={() => setSelected(choice.label)}
              disabled={selected !== null}
              className={cn(
                "flex items-start gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors",
                showResult && choice.correct && "border-sage/50 bg-sage/10",
                showResult && isSelected && !choice.correct && "border-danger/50 bg-danger/10",
                !showResult && "border-border hover:border-amber/40"
              )}
            >
              <span className="font-mono text-xs text-foreground-muted">{choice.label}</span>
              <span className="flex-1 text-foreground">{choice.text}</span>
              {showResult && choice.correct && <Check className="h-4 w-4 flex-shrink-0 text-sage" />}
              {showResult && isSelected && !choice.correct && <X className="h-4 w-4 flex-shrink-0 text-danger" />}
            </button>
          );
        })}
      </div>
      {selected && (
        <p className="mt-3 text-xs text-foreground-muted">
          {choices.find((c) => c.label === selected)?.explanation}
        </p>
      )}
    </div>
  );
}
