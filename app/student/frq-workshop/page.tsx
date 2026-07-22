import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { frqQuestions } from "@/lib/content/frq-questions";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "FRQ Workshop" };

export default async function FrqWorkshopPage() {
  await requireUser();

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground">FRQ Workshop</h1>
        <p className="mt-1 text-foreground-muted">Break every free-response question into a guided, stage-by-stage process.</p>
      </div>

      <div className="flex flex-col gap-3">
        {frqQuestions.map((frq) => (
          <Link key={frq.id} href={`/student/frq-workshop/${frq.id}`}>
            <Card className="flex items-center justify-between p-5 transition-colors hover:border-amber/50">
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">{frq.title}</h2>
                <p className="mt-1 text-xs text-foreground-muted">~{frq.estimatedMinutes} min · {frq.difficulty}</p>
              </div>
              <Badge variant={frq.questionType === "guided" ? "amber" : "outline"}>{frq.questionType}</Badge>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
