import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, Bug, HelpCircle, ArrowRight, Lock } from "lucide-react";
import { getUnitBySlug } from "@/lib/content/units";
import { drillsForUnit } from "@/lib/content/syntax-drills";
import { mcqsForUnit } from "@/lib/content/mcq-questions";
import { frqQuestions } from "@/lib/content/frq-questions";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ unitSlug: string }>;
}): Promise<Metadata> {
  const { unitSlug } = await params;
  const unit = getUnitBySlug(unitSlug);
  return { title: unit ? unit.title : "Unit" };
}

export default async function UnitPage({
  params,
}: {
  params: Promise<{ unitSlug: string }>;
}) {
  const { unitSlug } = await params;
  const unit = getUnitBySlug(unitSlug);
  if (!unit) notFound();

  const user = await requireUser();
  const supabase = await createClient();
  const { data: mastery } = await supabase
    .from("student_mastery")
    .select("*")
    .eq("student_id", user.id)
    .like("topic", `${unit.slug}%`);

  const avgMastery =
    (mastery ?? []).length > 0
      ? Math.round((mastery ?? []).reduce((s, m) => s + m.mastery_score, 0) / (mastery ?? []).length)
      : 0;

  const drills = drillsForUnit(unit.slug);
  const mcqs = mcqsForUnit(unit.slug);
  const frqs = frqQuestions.filter((f) => f.unitSlug === unit.slug);
  const firstBuiltLesson = unit.lessons.find((l) => l.built);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <div>
        <span className="font-mono text-sm text-amber">Unit {unit.unitNumber}</span>
        <h1 className="mt-1 font-display text-4xl font-semibold text-foreground">{unit.title}</h1>
        <p className="mt-3 text-foreground-muted">{unit.description}</p>
        <p className="mt-2 text-xs text-foreground-muted">Estimated completion: ~{unit.estimatedMinutes} minutes</p>
        <div className="mt-4 max-w-sm">
          <ProgressBar value={avgMastery} label="Unit mastery" />
        </div>
        {firstBuiltLesson && (
          <Button href={`/student/units/${unit.slug}/lessons/${firstBuiltLesson.slug}`} className="mt-5">
            Recommended next: {firstBuiltLesson.title} <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Card>
        <CardHeader><CardTitle>Learning objectives</CardTitle></CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2">
            {unit.objectives.map((o) => (
              <li key={o} className="flex items-start gap-2 text-sm text-foreground-muted">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber" />
                {o}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Lessons</CardTitle></CardHeader>
        <CardContent>
          <ul className="flex flex-col divide-y divide-border">
            {unit.lessons.map((lesson) => (
              <li key={lesson.slug} className="flex items-center justify-between py-3">
                {lesson.built ? (
                  <Link href={`/student/units/${unit.slug}/lessons/${lesson.slug}`} className="text-sm font-medium text-foreground hover:text-amber">
                    {lesson.title}
                  </Link>
                ) : (
                  <span className="flex items-center gap-2 text-sm text-foreground-muted">
                    <Lock className="h-3.5 w-3.5" /> {lesson.title}
                  </span>
                )}
                <span className="text-xs text-foreground-muted">~{lesson.estimatedMinutes} min</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Vocabulary</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {unit.vocabulary.map((v) => (
            <div key={v.term} className="rounded-md border border-border p-3">
              <p className="font-mono text-sm text-amber">{v.term}</p>
              <p className="mt-1 text-xs text-foreground-muted">{v.definition}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 sm:grid-cols-3">
        <Card className="p-5">
          <h3 className="font-display text-base font-semibold text-foreground">Syntax Café</h3>
          <p className="mt-1 text-sm text-foreground-muted">{drills.length} drills for this unit</p>
          <Button href={`/student/syntax-cafe?unit=${unit.slug}`} size="sm" variant="secondary" className="mt-3">Practice</Button>
        </Card>
        <Card className="p-5">
          <h3 className="font-display text-base font-semibold text-foreground">Question Bank</h3>
          <p className="mt-1 text-sm text-foreground-muted">{mcqs.length} MCQs for this unit</p>
          <Button href={`/student/question-bank?unit=${unit.slug}`} size="sm" variant="secondary" className="mt-3">Practice</Button>
        </Card>
        <Card className="p-5">
          <h3 className="font-display text-base font-semibold text-foreground">FRQ Workshop</h3>
          <p className="mt-1 text-sm text-foreground-muted">{frqs.length} FRQs for this unit</p>
          {frqs[0] ? (
            <Button href={`/student/frq-workshop/${frqs[0].id}`} size="sm" variant="secondary" className="mt-3">Practice</Button>
          ) : (
            <Badge variant="outline" className="mt-3">Coming soon</Badge>
          )}
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Common misconceptions &amp; errors</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ErrorGroup icon={HelpCircle} label="Common misconceptions" items={unit.commonMisconceptions} />
          <ErrorGroup icon={Bug} label="Common compiler errors" items={unit.commonCompilerErrors.map((e) => `${e.error} — ${e.cause}`)} />
          <ErrorGroup icon={AlertTriangle} label="Common logic errors" items={unit.commonLogicErrors.map((e) => `${e.error} — ${e.cause}`)} />
        </CardContent>
      </Card>
    </div>
  );
}

function ErrorGroup({ icon: Icon, label, items }: { icon: React.ElementType; label: string; items: string[] }) {
  return (
    <div>
      <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
        <Icon className="h-3.5 w-3.5" /> {label}
      </h4>
      <ul className="mt-2 flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item} className="text-sm text-foreground-muted">{item}</li>
        ))}
      </ul>
    </div>
  );
}
