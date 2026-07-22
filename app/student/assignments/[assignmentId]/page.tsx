import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { startAssignmentAction } from "@/actions/classroom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SubmitAssignmentForm } from "@/components/forms/SubmitAssignmentForm";

export const metadata: Metadata = { title: "Assignment" };

export default async function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ assignmentId: string }>;
}) {
  const { assignmentId } = await params;
  const user = await requireUser();
  const supabase = await createClient();

  const { data: assignment } = await supabase.from("assignments").select("*").eq("id", assignmentId).maybeSingle();
  if (!assignment) notFound();

  const [{ data: items }, { data: submission }] = await Promise.all([
    supabase.from("assignment_items").select("*").eq("assignment_id", assignmentId).order("sort_order"),
    supabase
      .from("assignment_submissions")
      .select("*")
      .eq("assignment_id", assignmentId)
      .eq("student_id", user.id)
      .order("attempt_number", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const resolvedItems = await Promise.all(
    (items ?? []).map(async (item) => {
      if (item.content_type === "lesson") {
        const { data: lesson } = await supabase.from("lessons").select("*").eq("id", item.content_id).maybeSingle();
        const { data: unit } = lesson ? await supabase.from("units").select("*").eq("id", lesson.unit_id).maybeSingle() : { data: null };
        return {
          label: lesson?.title ?? "Lesson",
          href: unit && lesson ? `/student/units/${unit.slug}/lessons/${lesson.slug}` : "/student/course-map",
        };
      }
      if (item.content_type === "frq") {
        return { label: "FRQ practice", href: `/student/frq-workshop/${item.content_id}` };
      }
      return { label: item.content_type.replace(/_/g, " "), href: "/student/dashboard" };
    })
  );

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link href="/student/assignments" className="text-sm text-amber hover:underline">
        ← All assignments
      </Link>

      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-3xl font-semibold text-foreground">{assignment.title}</h1>
          {submission && <Badge variant={submission.status === "graded" ? "sage" : "gold"}>{submission.status.replace("_", " ")}</Badge>}
        </div>
        <p className="mt-1 text-sm text-foreground-muted">
          {assignment.due_at ? `Due ${new Date(assignment.due_at).toLocaleString()}` : "No due date"}
          {" · "}Attempts allowed: {assignment.attempt_limit}
        </p>
      </div>

      {assignment.instructions && (
        <Card>
          <CardHeader><CardTitle>Instructions</CardTitle></CardHeader>
          <CardContent><p className="text-sm leading-relaxed text-foreground-muted">{assignment.instructions}</p></CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Assigned work</CardTitle>
          <CardDescription>Complete each item, then mark the assignment as submitted.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {resolvedItems.length === 0 ? (
            <p className="text-sm text-foreground-muted">No content has been attached to this assignment yet.</p>
          ) : (
            resolvedItems.map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-md border border-border p-4">
                <span className="text-sm text-foreground">{item.label}</span>
                <Button href={item.href} size="sm" variant="secondary">Open</Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {submission?.status === "graded" ? (
        <Card>
          <CardHeader><CardTitle>Your grade</CardTitle></CardHeader>
          <CardContent>
            <p className="font-display text-2xl text-foreground">{submission.teacher_score ?? "—"} / 10</p>
          </CardContent>
        </Card>
      ) : !submission ? (
        <form action={startAssignmentAction.bind(null, assignmentId)}>
          <Button type="submit">Start assignment</Button>
        </form>
      ) : (
        <SubmitAssignmentForm assignmentId={assignmentId} />
      )}
    </div>
  );
}
