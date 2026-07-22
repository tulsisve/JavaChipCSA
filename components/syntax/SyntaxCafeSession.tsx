"use client";

import { useMemo, useState } from "react";
import { Lightbulb, Check, X, ArrowRight } from "lucide-react";
import { recordSyntaxAttemptAction } from "@/actions/practice";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utilities/cn";

export interface DrillItem {
  id: string;
  unitId: string | null;
  topic: string;
  drillType: string;
  prompt: string;
  starterCode: string | null;
  correctAnswer: string;
  explanation: string;
  difficulty: string;
}

function normalize(code: string) {
  return code.replace(/\s+/g, " ").trim();
}

export function SyntaxCafeSession({ drills, mode }: { drills: DrillItem[]; mode: string | null }) {
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [confidence, setConfidence] = useState(3);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [completedCount, setCompletedCount] = useState(0);

  const drill = drills[index];
  const sessionLimit = mode === "quick-sip" ? 5 : mode === "deep-brew" ? 20 : drills.length;

  const progressLabel = useMemo(
    () => `${Math.min(completedCount + 1, sessionLimit)} of ${sessionLimit}`,
    [completedCount, sessionLimit]
  );

  if (!drill || completedCount >= sessionLimit) {
    return (
      <div className="rounded-xl border border-amber/30 bg-amber/5 p-8 text-center">
        <h3 className="font-display text-xl font-semibold text-foreground">Session complete</h3>
        <p className="mt-2 text-sm text-foreground-muted">
          You practiced {completedCount} drill{completedCount === 1 ? "" : "s"}. Nice work — that&apos;s time well brewed.
        </p>
        <Button
          className="mt-4"
          onClick={() => {
            setIndex(0);
            setCompletedCount(0);
            setResponse("");
            setSubmitted(false);
          }}
        >
          Practice again
        </Button>
      </div>
    );
  }

  function handleSubmit() {
    const correct = normalize(response) === normalize(drill.correctAnswer);
    setIsCorrect(correct);
    setSubmitted(true);
    const responseTimeMs = Date.now() - startedAt;
    void recordSyntaxAttemptAction({
      questionId: drill.id,
      unitId: drill.unitId,
      topic: drill.topic,
      response,
      isCorrect: correct,
      responseTimeMs,
      confidence,
      hintsUsed,
    }).catch(() => {
      // Practice still works locally even if the write fails (e.g. offline).
    });
  }

  function handleNext() {
    setCompletedCount((c) => c + 1);
    setIndex((i) => (i + 1) % drills.length);
    setResponse("");
    setSubmitted(false);
    setShowHint(false);
    setHintsUsed(0);
    setConfidence(3);
    setStartedAt(Date.now());
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Badge variant="amber">{drill.topic}</Badge>
        <span className="text-xs text-foreground-muted">{progressLabel}</span>
      </div>

      <div className="rounded-xl border border-border bg-background-card p-6">
        <p className="font-display text-lg text-foreground">{drill.prompt}</p>
        {drill.starterCode && (
          <pre className="mt-3 overflow-x-auto rounded-md bg-surface-code p-3 font-mono text-sm text-parchment">{drill.starterCode}</pre>
        )}

        <Textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          disabled={submitted}
          placeholder="Type the Java syntax from memory…"
          className="mt-4 min-h-32 font-mono text-sm"
          aria-label="Your answer"
        />

        {!submitted && (
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setShowHint(true);
                setHintsUsed((h) => h + 1);
              }}
              className="flex items-center gap-1.5 text-xs text-foreground-muted hover:text-amber"
            >
              <Lightbulb className="h-3.5 w-3.5" /> Hint
            </button>
            <Button size="sm" onClick={handleSubmit} disabled={!response.trim()}>
              Submit
            </Button>
          </div>
        )}

        {showHint && !submitted && (
          <p className="mt-2 text-xs text-foreground-muted">
            Hint: starts with <code className="font-mono text-amber">{drill.correctAnswer.slice(0, 8)}…</code>
          </p>
        )}

        {submitted && (
          <div className={cn("mt-4 rounded-md border p-4", isCorrect ? "border-sage/40 bg-sage/10" : "border-danger/40 bg-danger/10")}>
            <div className="flex items-center gap-2 text-sm font-medium">
              {isCorrect ? <Check className="h-4 w-4 text-sage" /> : <X className="h-4 w-4 text-danger" />}
              {isCorrect ? "Correct" : "Not quite"}
            </div>
            {!isCorrect && (
              <pre className="mt-2 overflow-x-auto font-mono text-xs text-foreground">{drill.correctAnswer}</pre>
            )}
            <p className="mt-2 text-xs text-foreground-muted">{drill.explanation}</p>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-foreground-muted">
                Confidence:
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setConfidence(n)}
                    className={cn("h-6 w-6 rounded-full border text-xs", confidence === n ? "border-amber bg-amber/20 text-amber" : "border-border text-foreground-muted")}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <Button size="sm" onClick={handleNext}>
                Next <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
