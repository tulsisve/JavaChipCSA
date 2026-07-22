import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Features",
  description: "Everything students and teachers get with JavaChip.",
};

const studentFeatures = [
  { title: "Syntax Café", description: "Nine drill modes — type from memory, fill in the blank, code ordering, error correction, flashcards, speed rounds, and more — build Java syntax into muscle memory." },
  { title: "Question Bank", description: "Original AP-style MCQs with a full explanation for every answer choice, filterable by unit, topic, difficulty, or weak area." },
  { title: "FRQ Workshop", description: "Guided, standard, exam, repair, and rubric-grading modes walk you through an eight-stage breakdown of every free-response question." },
  { title: "Spaced repetition", description: "Every drill and question feeds a review queue that resurfaces exactly what you're forgetting, right before you forget it." },
  { title: "Study Planner", description: "Enter your exam date and available study time; JavaChip builds a session-by-session plan and adapts it as you go." },
  { title: "Java Reference Library", description: "A searchable syntax and error reference with a mini practice question attached to every entry." },
];

const teacherFeatures = [
  { title: "JavaChip Classroom", description: "Create classes, generate join codes, and manage a roster without ever seeing another teacher's students." },
  { title: "Assignment Builder", description: "Assign lessons, drills, MCQ sets, FRQs, or checkpoints with due dates, attempt limits, and scheduled feedback release." },
  { title: "Gradebook & Analytics", description: "Class and student mastery, common errors, and completion rates — exportable to CSV." },
  { title: "Rubric-based FRQ scoring", description: "Automated structural estimates plus full teacher override, written feedback, and resubmission support." },
];

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <Badge variant="amber">For students</Badge>
        <h1 className="mt-4 font-display text-4xl font-semibold text-foreground">Built for genuine mastery</h1>
        <p className="mt-4 text-foreground-muted">
          JavaChip prioritizes understanding why code works over simply revealing the answer.
        </p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {studentFeatures.map((f) => (
          <Card key={f.title} className="p-6">
            <h3 className="font-display text-lg font-semibold text-foreground">{f.title}</h3>
            <p className="mt-2 text-sm text-foreground-muted">{f.description}</p>
          </Card>
        ))}
      </div>

      <div id="teachers" className="mt-24 max-w-2xl scroll-mt-24">
        <Badge variant="gold">For teachers</Badge>
        <h2 className="mt-4 font-display text-4xl font-semibold text-foreground">Run your whole classroom</h2>
        <p className="mt-4 text-foreground-muted">
          Start free with a demo class. Upgrade to JavaChip Pro when you&apos;re ready for your full roster.
        </p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {teacherFeatures.map((f) => (
          <Card key={f.title} className="p-6">
            <h3 className="font-display text-lg font-semibold text-foreground">{f.title}</h3>
            <p className="mt-2 text-sm text-foreground-muted">{f.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
