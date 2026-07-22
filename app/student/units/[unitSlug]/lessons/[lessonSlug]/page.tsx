import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getUnitBySlug } from "@/lib/content/units";
import { integerDivisionAndModulusLesson } from "@/lib/content/lessons/integer-division-and-modulus";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/lessons/Reveal";
import { MiniMcq } from "@/components/lessons/MiniMcq";
import { MarkCompleteButton } from "@/components/lessons/MarkCompleteButton";

const LESSONS = { [integerDivisionAndModulusLesson.slug]: integerDivisionAndModulusLesson };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lessonSlug: string }>;
}): Promise<Metadata> {
  const { lessonSlug } = await params;
  const lesson = LESSONS[lessonSlug as keyof typeof LESSONS];
  return { title: lesson ? lesson.title : "Lesson" };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ unitSlug: string; lessonSlug: string }>;
}) {
  const { unitSlug, lessonSlug } = await params;
  const unit = getUnitBySlug(unitSlug);
  const lesson = LESSONS[lessonSlug as keyof typeof LESSONS];
  if (!unit || !lesson || lesson.unitSlug !== unitSlug) notFound();

  await requireUser();
  const supabase = await createClient();
  const { data: lessonRow } = await supabase.from("lessons").select("*").eq("slug", lessonSlug).maybeSingle();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 pb-24">
      <div>
        <Link href={`/student/units/${unit.slug}`} className="text-sm text-amber hover:underline">
          ← {unit.title}
        </Link>
        <h1 className="mt-2 font-display text-4xl font-semibold text-foreground">{lesson.title}</h1>
        <p className="mt-4 text-foreground-muted">{lesson.hook}</p>
      </div>

      <Section title="Learning objectives">
        <BulletList items={lesson.objectives} />
      </Section>

      <Section title="Prerequisite knowledge">
        <BulletList items={lesson.prerequisites} />
      </Section>

      <Section title="Vocabulary">
        <div className="grid gap-3 sm:grid-cols-2">
          {lesson.vocabulary.map((v) => (
            <div key={v.term} className="rounded-md border border-border p-3">
              <p className="font-mono text-sm text-amber">{v.term}</p>
              <p className="mt-1 text-xs text-foreground-muted">{v.definition}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Explanation">
        <div className="flex flex-col gap-4">
          {lesson.explanation.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-foreground-muted">{p}</p>
          ))}
        </div>
      </Section>

      <Section title="Syntax template">
        <div className="flex flex-col gap-3">
          {lesson.syntaxTemplate.map((t) => (
            <div key={t.title}>
              <p className="text-xs font-medium text-foreground-muted">{t.title}</p>
              <pre className="mt-1 overflow-x-auto rounded-md bg-surface-code p-3 font-mono text-sm text-parchment">{t.code}</pre>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Annotated example">
        <p className="text-xs font-medium text-foreground-muted">{lesson.annotatedExample.title}</p>
        <pre className="mt-2 overflow-x-auto rounded-md bg-surface-code p-4 font-mono text-sm text-parchment">{lesson.annotatedExample.code}</pre>
      </Section>

      <Section title="Line-by-line breakdown">
        <div className="flex flex-col gap-2">
          {lesson.lineByLineBreakdown.map((l, i) => (
            <div key={i} className="rounded-md border border-border p-3">
              <code className="font-mono text-xs text-amber">{l.line}</code>
              <p className="mt-1 text-xs text-foreground-muted">{l.explanation}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Visual execution trace">
        <ol className="flex flex-col gap-2">
          {lesson.executionTrace.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-foreground-muted">
              <span className="font-mono text-xs text-amber">{i + 1}.</span> {step}
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Variable-state table">
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-background-raised text-xs uppercase text-foreground-muted">
              <tr>
                <th className="px-3 py-2">Step</th>
                {Object.keys(lesson.variableStateTable[0]?.variables ?? {}).map((k) => (
                  <th key={k} className="px-3 py-2 font-mono">{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lesson.variableStateTable.map((row) => (
                <tr key={row.step} className="border-t border-border">
                  <td className="px-3 py-2 text-foreground-muted">{row.step}</td>
                  {Object.values(row.variables).map((v, i) => (
                    <td key={i} className="px-3 py-2 font-mono text-foreground">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Memory / reference note">
        <p className="text-sm text-foreground-muted">{lesson.memoryNote}</p>
      </Section>

      <Section title="Common mistakes">
        <BulletList items={lesson.commonMistakes} tone="danger" />
      </Section>

      <Section title="Compiler-error examples">
        <div className="flex flex-col gap-3">
          {lesson.compilerErrorExamples.map((e, i) => (
            <div key={i} className="rounded-md border border-danger/30 bg-danger/5 p-3">
              <code className="font-mono text-xs text-foreground">{e.code}</code>
              <p className="mt-1 text-xs text-danger">{e.error}</p>
              <p className="mt-1 text-xs text-foreground-muted">Fix: {e.fix}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Logic-error examples">
        <div className="flex flex-col gap-3">
          {lesson.logicErrorExamples.map((e, i) => (
            <div key={i} className="rounded-md border border-border p-3">
              <pre className="overflow-x-auto font-mono text-xs text-parchment">{e.code}</pre>
              <p className="mt-2 text-xs text-foreground-muted">{e.issue}</p>
              <p className="mt-1 text-xs text-sage">Fix: {e.fix}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Predict the output">
        <div className="flex flex-col gap-3">
          {lesson.predictOutputQuestions.map((q, i) => (
            <Reveal key={i} prompt={q.code}>
              <p className="font-mono text-foreground">{q.answer}</p>
              <p className="mt-1">{q.explanation}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section title="Fill in the code">
        <div className="flex flex-col gap-3">
          {lesson.fillInCodeQuestions.map((q, i) => (
            <Reveal key={i} prompt={q.prompt}>
              <pre className="whitespace-pre-wrap font-mono">{q.code}</pre>
              <p className="mt-2 font-mono text-amber">{q.answer}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section title="Code-ordering activity">
        <p className="text-sm text-foreground-muted">{lesson.codeOrderingActivity.instructions}</p>
        <ol className="mt-2 flex flex-col gap-1.5">
          {lesson.codeOrderingActivity.lines.map((line, i) => (
            <li key={i} className="rounded-md border border-border bg-background-raised px-3 py-2 font-mono text-xs text-foreground">{line}</li>
          ))}
        </ol>
        <Reveal prompt="Correct order">
          <p className="font-mono">{lesson.codeOrderingActivity.correctOrder.map((n) => n + 1).join(" → ")}</p>
        </Reveal>
      </Section>

      <Section title="Error-correction activity">
        <pre className="overflow-x-auto rounded-md bg-surface-code p-4 font-mono text-sm text-parchment">{lesson.errorCorrectionActivity.brokenCode}</pre>
        <Reveal prompt={`Bug: ${lesson.errorCorrectionActivity.bug}`}>
          <pre className="whitespace-pre-wrap font-mono">{lesson.errorCorrectionActivity.fixedCode}</pre>
        </Reveal>
      </Section>

      <Section title="Short coding challenge">
        <p className="text-sm text-foreground-muted">{lesson.shortCodingChallenge.prompt}</p>
        <pre className="mt-3 overflow-x-auto rounded-md bg-surface-code p-4 font-mono text-sm text-parchment">{lesson.shortCodingChallenge.starterCode}</pre>
        <Reveal prompt="Show a sample solution">
          <pre className="whitespace-pre-wrap font-mono">{lesson.shortCodingChallenge.sampleSolution}</pre>
        </Reveal>
      </Section>

      <Section title="MCQ mini-set">
        <div className="flex flex-col gap-3">
          {lesson.mcqMiniSet.map((q, i) => (
            <MiniMcq key={i} prompt={q.prompt} code={q.code} choices={q.choices} />
          ))}
        </div>
      </Section>

      <Section title="Reflection">
        <BulletList items={lesson.reflectionPrompts} />
      </Section>

      <Section title="Mastery check">
        <ul className="flex flex-col gap-2">
          {lesson.masteryCheck.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-foreground-muted">
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-sage" /> {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Summary">
        <p className="text-sm leading-relaxed text-foreground-muted">{lesson.summary}</p>
      </Section>

      <div className="flex flex-wrap gap-2">
        {lesson.relatedReferenceLinks.map((l) => (
          <Badge key={l.href} variant="outline">
            <Link href={l.href}>{l.label}</Link>
          </Badge>
        ))}
      </div>

      <Card className="border-amber/30 p-6">
        {lessonRow ? (
          <MarkCompleteButton lessonId={lessonRow.id} unitSlug={unit.slug} lessonSlug={lesson.slug} />
        ) : (
          <p className="text-sm text-foreground-muted">
            Run the database seed script to enable progress tracking for this lesson.
          </p>
        )}
        <Link href={lesson.suggestedNextLesson.href} className="mt-3 block text-sm text-amber hover:underline">
          Next: {lesson.suggestedNextLesson.label} →
        </Link>
      </Card>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-display text-xl font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function BulletList({ items, tone = "default" }: { items: string[]; tone?: "default" | "danger" }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-foreground-muted">
          <span className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${tone === "danger" ? "bg-danger" : "bg-amber"}`} />
          {item}
        </li>
      ))}
    </ul>
  );
}
