import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFrqById } from "@/lib/content/frq-questions";
import { requireUser } from "@/lib/auth/session";
import { Badge } from "@/components/ui/Badge";
import { GuidedFrqWorkshop } from "@/components/frq/GuidedFrqWorkshop";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ frqId: string }>;
}): Promise<Metadata> {
  const { frqId } = await params;
  const frq = getFrqById(frqId);
  return { title: frq ? frq.title : "FRQ" };
}

export default async function FrqDetailPage({
  params,
}: {
  params: Promise<{ frqId: string }>;
}) {
  const { frqId } = await params;
  const frq = getFrqById(frqId);
  if (!frq) notFound();

  await requireUser();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Link href="/student/frq-workshop" className="text-sm text-amber hover:underline">
        ← FRQ Workshop
      </Link>

      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-3xl font-semibold text-foreground">{frq.title}</h1>
          <Badge variant="amber">{frq.questionType}</Badge>
        </div>
        <p className="mt-1 text-sm text-foreground-muted">~{frq.estimatedMinutes} min · {frq.difficulty}</p>
      </div>

      {frq.guidedStages ? (
        <GuidedFrqWorkshop frq={frq} />
      ) : (
        <div className="rounded-md border border-border bg-background-card p-6">
          <p className="text-sm text-foreground-muted whitespace-pre-line">{frq.prompt}</p>
          <p className="mt-4 text-xs text-foreground-muted">
            Guided-mode breakdown for this FRQ is coming soon — the SnowfallTracker FRQ has the
            full eight-stage guided workshop available today.
          </p>
        </div>
      )}

      <p className="text-xs text-foreground-muted">
        Automated scoring on JavaChip is always an estimate and is never official College Board
        scoring. Your teacher&apos;s review is the score that counts for class credit.
      </p>
    </div>
  );
}
