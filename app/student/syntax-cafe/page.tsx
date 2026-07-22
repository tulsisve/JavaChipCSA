import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { syntaxDrills } from "@/lib/content/syntax-drills";
import { SyntaxCafeSession, type DrillItem } from "@/components/syntax/SyntaxCafeSession";

export const metadata: Metadata = { title: "Syntax Café" };

export default async function SyntaxCafePage({
  searchParams,
}: {
  searchParams: Promise<{ unit?: string; mode?: string }>;
}) {
  const { unit: unitSlug, mode } = await searchParams;
  await requireUser();
  const supabase = await createClient();

  let unitId: string | null = null;
  if (unitSlug) {
    const { data: unitRow } = await supabase.from("units").select("*").eq("slug", unitSlug).maybeSingle();
    unitId = unitRow?.id ?? null;
  }

  const { data: dbDrills } = unitId
    ? await supabase.from("syntax_questions").select("*").eq("unit_id", unitId)
    : await supabase.from("syntax_questions").select("*");

  const drills: DrillItem[] =
    dbDrills && dbDrills.length > 0
      ? dbDrills.map((d) => ({
          id: d.id,
          unitId: d.unit_id,
          topic: d.topic,
          drillType: d.drill_type,
          prompt: d.prompt,
          starterCode: d.starter_code,
          correctAnswer: d.correct_answer,
          explanation: d.explanation,
          difficulty: d.difficulty,
        }))
      : syntaxDrills
          .filter((d) => !unitSlug || d.unitSlug === unitSlug)
          .map((d) => ({
            id: d.id,
            unitId: null,
            topic: d.topic,
            drillType: d.drillType,
            prompt: d.prompt,
            starterCode: d.starterCode ?? null,
            correctAnswer: d.correctAnswer,
            explanation: d.explanation,
            difficulty: d.difficulty,
          }));

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground">Syntax Café</h1>
        <p className="mt-1 text-foreground-muted">Type Java syntax from memory. Active recall builds it into muscle memory.</p>
      </div>

      {drills.length === 0 ? (
        <p className="text-sm text-foreground-muted">No drills found for this filter.</p>
      ) : (
        <SyntaxCafeSession drills={drills} mode={mode ?? null} />
      )}
    </div>
  );
}
