"use server";

import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";
import { computeMasteryUpdate } from "@/lib/spaced-repetition";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function updateMastery(
  supabase: Awaited<ReturnType<typeof createClient>>,
  studentId: string,
  unitId: string | null,
  topic: string,
  isCorrect: boolean,
  responseTimeMs: number | null,
  expectedTimeMs: number,
  confidence: number | null
) {
  const { data: existing } = await supabase
    .from("student_mastery")
    .select("*")
    .eq("student_id", studentId)
    .eq("topic", topic)
    .maybeSingle();

  const update = computeMasteryUpdate(
    existing ? { masteryScore: existing.mastery_score, reviewStatus: existing.review_status } : null,
    { isCorrect, responseTimeMs, expectedTimeMs, confidence }
  );

  await supabase.from("student_mastery").upsert(
    {
      student_id: studentId,
      unit_id: unitId,
      topic,
      mastery_score: update.masteryScore,
      mastery_level: update.masteryLevel,
      review_status: update.reviewStatus,
      last_practiced_at: new Date().toISOString(),
      next_review_at: update.nextReviewAt.toISOString(),
    },
    { onConflict: "student_id,unit_id,topic" }
  );
}

export async function recordSyntaxAttemptAction(input: {
  questionId: string;
  unitId: string | null;
  topic: string;
  response: string;
  isCorrect: boolean;
  responseTimeMs: number;
  confidence: number;
  hintsUsed: number;
}) {
  const user = await requireUser();
  const supabase = await createClient();

  if (UUID_RE.test(input.questionId)) {
    await supabase.from("student_syntax_attempts").insert({
      student_id: user.id,
      question_id: input.questionId,
      response: input.response,
      is_correct: input.isCorrect,
      response_time_ms: input.responseTimeMs,
      confidence: input.confidence,
      hints_used: input.hintsUsed,
      error_category: input.isCorrect ? null : "syntax_mismatch",
    });
  }

  await updateMastery(supabase, user.id, input.unitId, input.topic, input.isCorrect, input.responseTimeMs, 20000, input.confidence);
}

export async function recordMcqAttemptAction(input: {
  questionId: string;
  unitId: string | null;
  topic: string;
  selectedChoiceId: string | null;
  isCorrect: boolean;
  responseTimeMs: number;
  confidence: number;
  answerChanges: number;
}) {
  const user = await requireUser();
  const supabase = await createClient();

  if (UUID_RE.test(input.questionId)) {
    await supabase.from("student_mcq_attempts").insert({
      student_id: user.id,
      question_id: input.questionId,
      selected_choice_id: UUID_RE.test(input.selectedChoiceId ?? "") ? input.selectedChoiceId : null,
      is_correct: input.isCorrect,
      response_time_ms: input.responseTimeMs,
      confidence: input.confidence,
      answer_changes: input.answerChanges,
    });
  }

  await updateMastery(supabase, user.id, input.unitId, input.topic, input.isCorrect, input.responseTimeMs, 90000, input.confidence);
}
