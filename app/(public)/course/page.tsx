import type { Metadata } from "next";
import Link from "next/link";
import { units } from "@/lib/content/units";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Course Overview",
  description: "The full ten-unit AP Computer Science A course map.",
};

export default function CourseOverviewPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold text-foreground">AP Computer Science A</h1>
      <p className="mt-4 max-w-2xl text-foreground-muted">
        Ten units, aligned to the official College Board course description. Every lesson, drill,
        MCQ, and FRQ on JavaChip is original content — never a reproduction of copyrighted exam
        material.
      </p>
      <div className="mt-10 flex flex-col gap-4">
        {units.map((unit) => (
          <Link key={unit.slug} href={`/student/units/${unit.slug}`}>
            <Card className="flex flex-col gap-2 p-6 transition-colors hover:border-amber/50 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="font-mono text-xs text-amber">Unit {unit.unitNumber}</span>
                <h2 className="font-display text-xl font-semibold text-foreground">{unit.title}</h2>
                <p className="mt-1 max-w-xl text-sm text-foreground-muted">{unit.description}</p>
              </div>
              <span className="whitespace-nowrap text-xs text-foreground-muted">
                ~{unit.estimatedMinutes} min
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
