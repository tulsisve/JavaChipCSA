import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { mcqQuestions } from "@/lib/content/mcq-questions";
import { McqSession, type McqItem } from "@/components/mcq/McqSession";

export const metadata: Metadata = { title: "Question Bank" };

export default async function QuestionBankPage({
  searchParams,
}: {
  searchParams: Promise<{ unit?: string }>;
}) {
  const { unit: unitSlug } = await searchParams;
  await requireUser();
  const supabase = await createClient();

  let unitId: string | null = null;
  if (unitSlug) {
    const { data: unitRow } = await supabase.from("units").select("*").eq("slug", unitSlug).maybeSingle();
    unitId = unitRow?.id ?? null;
  }

  const { data: dbQuestions } = unitId
    ? await supabase.from("mcq_questions").select("*").eq("unit_id", unitId).eq("published", true)
    : await supabase.from("mcq_questions").select("*").eq("published", true);

  let questions: McqItem[] = [];

  if (dbQuestions && dbQuestions.length > 0) {
    const { data: choices } = await supabase
      .from("mcq_choices")
      .select("*")
      .in("question_id", dbQuestions.map((q) => q.id));

    questions = dbQuestions.map((q) => ({
      id: q.id,
      unitId: q.unit_id,
      topic: q.topic,
      prompt: q.prompt,
      code: q.code,
      difficulty: q.difficulty,
      choices: (choices ?? [])
        .filter((c) => c.question_id === q.id)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((c) => ({ id: c.id, label: c.choice_label, text: c.choice_text, correct: c.is_correct, explanation: c.explanation })),
    }));
  } else {
    questions = mcqQuestions
      .filter((q) => !unitSlug || q.unitSlug === unitSlug)
      .map((q) => ({
        id: q.id,
        unitId: null,
        topic: q.topic,
        prompt: q.prompt,
        code: q.code ?? null,
        difficulty: q.difficulty,
        choices: q.choices.map((c) => ({ id: `${q.id}-${c.label}`, label: c.label, text: c.text, correct: c.correct, explanation: c.explanation })),
      }));
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground">Question Bank</h1>
        <p className="mt-1 text-foreground-muted">Original AP-style MCQs with an explanation for every choice.</p>
      </div>
      <McqSession questions={questions} />
    </div>
  );
}
