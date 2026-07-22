"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Check, ChevronLeft, ChevronRight, Save, Send } from "lucide-react";
import { saveFrqProgressAction } from "@/actions/frq";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utilities/cn";
import type { FrqQuestion } from "@/lib/content/frq-questions";

export function GuidedFrqWorkshop({ frq }: { frq: FrqQuestion }) {
  const [stageIndex, setStageIndex] = useState(0);
  const [planningNotes, setPlanningNotes] = useState("");
  const [code, setCode] = useState(frq.starterCode);
  const [traceNotes, setTraceNotes] = useState("");
  const [checkedCases, setCheckedCases] = useState<Set<string>>(new Set());
  const [rubricChecks, setRubricChecks] = useState<Set<string>>(new Set());
  const [reflection, setReflection] = useState("");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const stages = frq.guidedStages ?? [];
  const stage = stages[stageIndex];

  async function persist(submit: boolean) {
    setSaving(true);
    const result = await saveFrqProgressAction({
      frqId: frq.id,
      code,
      planningNotes,
      reflection,
      submit,
    });
    setSaving(false);
    setSaveMessage(
      submit
        ? "Submitted for teacher review."
        : result.saved
          ? "Draft saved."
          : result.reason ?? "Draft saved locally."
    );
  }

  const earnedPoints = frq.rubric.filter((r) => rubricChecks.has(r.id)).reduce((s, r) => s + r.points, 0);
  const totalPoints = frq.rubric.reduce((s, r) => s + r.points, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Stage tabs */}
      <div className="flex flex-wrap gap-1.5">
        {stages.map((s, i) => (
          <button
            key={s.stage}
            type="button"
            onClick={() => setStageIndex(i)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              i === stageIndex ? "border-amber bg-amber/15 text-amber" : "border-border text-foreground-muted hover:border-amber/40"
            )}
          >
            {s.stage}. {s.title}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-background-card p-6">
        <Badge variant="gold" className="mb-2">Stage {stage.stage} of {stages.length}</Badge>
        <h2 className="font-display text-xl font-semibold text-foreground">{stage.title}</h2>
        <p className="mt-2 text-sm text-foreground-muted">{stage.prompt}</p>

        <div className="mt-5">
          {stage.stage === 1 && (
            <div className="rounded-md border border-border bg-background-raised p-4 text-sm leading-relaxed text-foreground whitespace-pre-line">
              {frq.prompt}
            </div>
          )}

          {stage.stage === 2 && (
            <Textarea
              value={planningNotes}
              onChange={(e) => setPlanningNotes(e.target.value)}
              placeholder="Write your plain-English plan: steps, loops, conditions, variables, edge cases…"
              className="min-h-40"
            />
          )}

          {stage.stage === 3 && (
            <div className="rounded-md border border-border bg-surface-code p-4 font-mono text-sm text-parchment">
              {frq.starterCode.split("\n").find((l) => l.includes("public")) ?? frq.starterCode.split("\n")[0]}
            </div>
          )}

          {stage.stage === 4 && (
            <div className="overflow-hidden rounded-md border border-border">
              <Editor
                height="360px"
                defaultLanguage="java"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value ?? "")}
                options={{ fontSize: 13, minimap: { enabled: false }, tabSize: 4 }}
              />
            </div>
          )}

          {stage.stage === 5 && (
            <Textarea
              value={traceNotes}
              onChange={(e) => setTraceNotes(e.target.value)}
              placeholder="Trace your method with the example input: what does each variable hold at each step?"
              className="min-h-32"
            />
          )}

          {stage.stage === 6 && (
            <ul className="flex flex-col gap-2">
              {frq.testCases.filter((t) => !t.hidden).map((t) => (
                <li key={t.id} className="flex items-start gap-3 rounded-md border border-border p-3">
                  <input
                    type="checkbox"
                    checked={checkedCases.has(t.id)}
                    onChange={() =>
                      setCheckedCases((prev) => {
                        const next = new Set(prev);
                        if (next.has(t.id)) {
                          next.delete(t.id);
                        } else {
                          next.add(t.id);
                        }
                        return next;
                      })
                    }
                    className="mt-1 h-4 w-4"
                  />
                  <div className="text-sm">
                    <p className="text-foreground">{t.inputDescription}</p>
                    <p className="text-foreground-muted">Expected: {t.expectedOutput}</p>
                  </div>
                </li>
              ))}
              <li className="rounded-md border border-amber/20 bg-amber/5 p-3 text-xs text-amber">
                Test cases here are for self-checking only — JavaChip doesn&apos;t execute Java in
                the main app. Configure a sandboxed execution service to run these for real (see
                lib/code-execution).
              </li>
            </ul>
          )}

          {stage.stage === 7 && (
            <div className="flex flex-col gap-2">
              {frq.rubric.map((r) => (
                <label key={r.id} className="flex items-start gap-3 rounded-md border border-border p-3 text-sm">
                  <input
                    type="checkbox"
                    checked={rubricChecks.has(r.id)}
                    onChange={() =>
                      setRubricChecks((prev) => {
                        const next = new Set(prev);
                        if (next.has(r.id)) {
                          next.delete(r.id);
                        } else {
                          next.add(r.id);
                        }
                        return next;
                      })
                    }
                    className="mt-1 h-4 w-4"
                  />
                  <span className="flex-1 text-foreground-muted">{r.description}</span>
                  <span className="font-mono text-xs text-amber">{r.points} pt</span>
                </label>
              ))}
              <p className="mt-2 text-sm text-foreground">
                Self-assessed: {earnedPoints} / {totalPoints} points. This is your own estimate — your
                teacher&apos;s score is the one that counts.
              </p>
            </div>
          )}

          {stage.stage === 8 && (
            <Textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What was difficult? What mistake did you make? What would you do differently?"
              className="min-h-32"
            />
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" disabled={stageIndex === 0} onClick={() => setStageIndex((i) => i - 1)}>
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          <Button variant="ghost" size="sm" disabled={stageIndex === stages.length - 1} onClick={() => setStageIndex((i) => i + 1)}>
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-3">
          {saveMessage && (
            <span className="flex items-center gap-1 text-xs text-sage"><Check className="h-3.5 w-3.5" /> {saveMessage}</span>
          )}
          <Button variant="secondary" size="sm" disabled={saving} onClick={() => persist(false)}>
            <Save className="h-3.5 w-3.5" /> Save draft
          </Button>
          <Button size="sm" disabled={saving} onClick={() => persist(true)}>
            <Send className="h-3.5 w-3.5" /> Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
