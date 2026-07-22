"use client";

import { useState } from "react";
import { Check, X, Flag, ArrowRight } from "lucide-react";
import { recordMcqAttemptAction } from "@/actions/practice";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utilities/cn";

export interface McqChoiceItem {
  id: string;
  label: string;
  text: string;
  correct: boolean;
  explanation: string;
}

export interface McqItem {
  id: string;
  unitId: string | null;
  topic: string;
  prompt: string;
  code: string | null;
  difficulty: string;
  choices: McqChoiceItem[];
}

export function McqSession({ questions }: { questions: McqItem[] }) {
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answerChanges, setAnswerChanges] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [confidence, setConfidence] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);

  const question = questions[index];

  if (!question) {
    return <p className="text-sm text-foreground-muted">No questions available.</p>;
  }

  if (index >= questions.length) {
    return (
      <div className="rounded-xl border border-amber/30 bg-amber/5 p-8 text-center">
        <h3 className="font-display text-xl font-semibold text-foreground">Set complete</h3>
        <p className="mt-2 text-sm text-foreground-muted">
          {correctCount} of {questions.length} correct.
        </p>
      </div>
    );
  }

  function selectChoice(choiceId: string) {
    if (submitted) return;
    if (selectedId && selectedId !== choiceId) setAnswerChanges((n) => n + 1);
    setSelectedId(choiceId);
  }

  function handleSubmit() {
    if (!selectedId) return;
    const choice = question.choices.find((c) => c.id === selectedId);
    const correct = !!choice?.correct;
    setSubmitted(true);
    if (correct) setCorrectCount((c) => c + 1);

    void recordMcqAttemptAction({
      questionId: question.id,
      unitId: question.unitId,
      topic: question.topic,
      selectedChoiceId: selectedId,
      isCorrect: correct,
      responseTimeMs: Date.now() - startedAt,
      confidence,
      answerChanges,
    }).catch(() => {});
  }

  function handleNext() {
    setIndex((i) => i + 1);
    setSelectedId(null);
    setSubmitted(false);
    setAnswerChanges(0);
    setConfidence(3);
    setStartedAt(Date.now());
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Badge variant="amber">{question.topic}</Badge>
        <span className="text-xs text-foreground-muted">Question {index + 1} of {questions.length}</span>
      </div>

      <div className="rounded-xl border border-border bg-background-card p-6">
        <div className="flex items-start justify-between gap-3">
          <p className="font-display text-lg text-foreground">{question.prompt}</p>
          <button
            type="button"
            aria-label="Flag question"
            aria-pressed={flagged.has(index)}
            onClick={() =>
              setFlagged((prev) => {
                const next = new Set(prev);
                if (next.has(index)) {
                  next.delete(index);
                } else {
                  next.add(index);
                }
                return next;
              })
            }
            className={cn("flex-shrink-0 rounded-md p-1.5", flagged.has(index) ? "text-amber" : "text-foreground-muted hover:text-amber")}
          >
            <Flag className="h-4 w-4" />
          </button>
        </div>

        {question.code && (
          <pre className="mt-3 overflow-x-auto rounded-md bg-surface-code p-4 font-mono text-sm text-parchment">{question.code}</pre>
        )}

        <div className="mt-4 flex flex-col gap-2">
          {question.choices.map((choice) => {
            const isSelected = selectedId === choice.id;
            return (
              <button
                key={choice.id}
                type="button"
                onClick={() => selectChoice(choice.id)}
                disabled={submitted}
                aria-pressed={isSelected}
                className={cn(
                  "flex items-start gap-3 rounded-md border px-4 py-3 text-left text-sm transition-colors",
                  submitted && choice.correct && "border-sage/50 bg-sage/10",
                  submitted && isSelected && !choice.correct && "border-danger/50 bg-danger/10",
                  !submitted && isSelected && "border-amber bg-amber/10",
                  !submitted && !isSelected && "border-border hover:border-amber/40"
                )}
              >
                <span className="font-mono text-xs text-foreground-muted">{choice.label}</span>
                <span className="flex-1 text-foreground">{choice.text}</span>
                {submitted && choice.correct && <Check className="h-4 w-4 flex-shrink-0 text-sage" />}
                {submitted && isSelected && !choice.correct && <X className="h-4 w-4 flex-shrink-0 text-danger" />}
              </button>
            );
          })}
        </div>

        {!submitted ? (
          <div className="mt-4 flex justify-end">
            <Button size="sm" onClick={handleSubmit} disabled={!selectedId}>Submit answer</Button>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {question.choices.map((c) => (
              <p key={c.id} className="text-xs text-foreground-muted">
                <span className="font-mono text-amber">{c.label}.</span> {c.explanation}
              </p>
            ))}
            <div className="flex items-center justify-between border-t border-border pt-3">
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
              <Button size="sm" onClick={handleNext}>Next <ArrowRight className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
