import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Assignments" };

export default async function StudentAssignmentsPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: memberships } = await supabase
    .from("class_members")
    .select("*")
    .eq("student_id", user.id)
    .eq("status", "active");
  const classIds = (memberships ?? []).map((m) => m.class_id);

  const { data: assignments } =
    classIds.length > 0
      ? await supabase
          .from("assignments")
          .select("*")
          .in("class_id", classIds)
          .eq("published", true)
          .order("due_at", { ascending: true })
      : { data: [] };

  const { data: submissions } = await supabase
    .from("assignment_submissions")
    .select("*")
    .eq("student_id", user.id);

  const statusFor = (assignmentId: string) =>
    (submissions ?? []).find((s) => s.assignment_id === assignmentId)?.status ?? "not_started";

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground">Assignments</h1>
        <p className="mt-1 text-foreground-muted">Across every classroom you&apos;ve joined.</p>
      </div>

      {(assignments ?? []).length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No assignments are waiting right now"
          description="Join a classroom to see teacher-assigned work here."
          actionLabel="Join a classroom"
          actionHref="/student/classrooms"
        />
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-background-card">
          {(assignments ?? []).map((a) => {
            const status = statusFor(a.id);
            return (
              <Link key={a.id} href={`/student/assignments/${a.id}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-background-raised">
                <div>
                  <p className="text-sm font-medium text-foreground">{a.title}</p>
                  <p className="text-xs text-foreground-muted">
                    {a.due_at ? `Due ${new Date(a.due_at).toLocaleDateString()}` : "No due date"}
                  </p>
                </div>
                <Badge variant={status === "graded" ? "sage" : status === "submitted" ? "gold" : "outline"}>
                  {status.replace("_", " ")}
                </Badge>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
