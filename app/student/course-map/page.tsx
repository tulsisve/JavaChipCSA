import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { units } from "@/lib/content/units";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";

export const metadata: Metadata = { title: "Course Map" };

export default async function CourseMapPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: mastery } = await supabase.from("student_mastery").select("*").eq("student_id", user.id);
  const { data: progress } = await supabase.from("student_lesson_progress").select("*").eq("student_id", user.id);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground">Course Map</h1>
        <p className="mt-1 text-foreground-muted">All ten AP CSA units, in order.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {units.map((unit) => {
          const unitMastery = (mastery ?? []).filter((m) => m.topic.startsWith(unit.slug));
          const avgMastery =
            unitMastery.length > 0
              ? Math.round(unitMastery.reduce((s, m) => s + m.mastery_score, 0) / unitMastery.length)
              : 0;
          const builtLessons = unit.lessons.filter((l) => l.built).map((l) => l.slug);
          const completedCount = (progress ?? []).filter(
            (p) => p.status === "completed" && builtLessons.length > 0
          ).length;

          return (
            <Link key={unit.slug} href={`/student/units/${unit.slug}`}>
              <Card className="flex h-full flex-col gap-3 p-5 transition-colors hover:border-amber/50">
                <span className="font-mono text-xs text-amber">Unit {unit.unitNumber}</span>
                <h2 className="font-display text-lg font-semibold text-foreground">{unit.title}</h2>
                <p className="line-clamp-2 flex-1 text-sm text-foreground-muted">{unit.description}</p>
                <ProgressBar value={avgMastery} label="Mastery" />
                <div className="flex items-center justify-between text-xs text-foreground-muted">
                  <span>{unit.lessons.length} lessons</span>
                  <span>{completedCount} completed</span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
