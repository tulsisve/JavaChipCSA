import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RegenerateJoinCodeButton } from "@/components/forms/RegenerateJoinCodeButton";
import { CreateAssignmentForm, type AssignableContentOption } from "@/components/forms/CreateAssignmentForm";
import { GradeSubmissionForm } from "@/components/forms/GradeSubmissionForm";

export const metadata: Metadata = { title: "Class" };

export default async function TeacherClassDetailPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  const user = await requireUser();
  const supabase = await createClient();

  const { data: classRow } = await supabase
    .from("classes")
    .select("*")
    .eq("id", classId)
    .eq("teacher_id", user.id)
    .maybeSingle();
  if (!classRow) notFound();

  const [{ data: members }, { data: assignments }, { data: lessonOption }, { data: frqOption }] = await Promise.all([
    supabase.from("class_members").select("*").eq("class_id", classId).eq("status", "active"),
    supabase.from("assignments").select("*").eq("class_id", classId).order("created_at", { ascending: false }),
    supabase.from("lessons").select("*").eq("slug", "integer-division-and-modulus").maybeSingle(),
    supabase.from("frq_questions").select("*").eq("title", "SnowfallTracker: Days Above Average").maybeSingle(),
  ]);

  const studentIds = (members ?? []).map((m) => m.student_id);
  const { data: students } =
    studentIds.length > 0 ? await supabase.from("profiles").select("*").in("id", studentIds) : { data: [] };

  const options: AssignableContentOption[] = [];
  if (lessonOption) options.push({ contentType: "lesson", contentId: lessonOption.id, label: `Lesson: ${lessonOption.title}` });
  if (frqOption) options.push({ contentType: "frq", contentId: frqOption.id, label: `FRQ: ${frqOption.title}` });

  const assignmentIds = (assignments ?? []).map((a) => a.id);
  const { data: submissions } =
    assignmentIds.length > 0
      ? await supabase.from("assignment_submissions").select("*").in("assignment_id", assignmentIds)
      : { data: [] };
  const studentNameById = new Map((students ?? []).map((s) => [s.id, s.display_name]));
  const assignmentTitleById = new Map((assignments ?? []).map((a) => [a.id, a.title]));

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground">{classRow.name}</h1>
        <p className="mt-1 text-foreground-muted">{classRow.course_name}{classRow.period ? ` · Period ${classRow.period}` : ""}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Join code</CardTitle>
          <CardDescription>Share this code with students so they can join.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="font-mono text-2xl tracking-wider text-amber">{classRow.join_code}</span>
          <RegenerateJoinCodeButton classId={classId} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Roster</CardTitle>
          <CardDescription>{(students ?? []).length} students</CardDescription>
        </CardHeader>
        <CardContent>
          {(students ?? []).length === 0 ? (
            <p className="text-sm text-foreground-muted">No students have joined yet — share the join code above.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {(students ?? []).map((s) => (
                <li key={s.id} className="py-2 text-sm text-foreground">{s.display_name}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create an assignment</CardTitle>
        </CardHeader>
        <CardContent>
          {options.length === 0 ? (
            <p className="text-sm text-foreground-muted">
              Run the database seed script to enable assignable content, then refresh this page.
            </p>
          ) : (
            <CreateAssignmentForm classId={classId} options={options} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Assignments &amp; submissions</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-5">
          {(assignments ?? []).length === 0 ? (
            <p className="text-sm text-foreground-muted">No assignments yet.</p>
          ) : (
            (assignments ?? []).map((a) => {
              const relatedSubmissions = (submissions ?? []).filter((s) => s.assignment_id === a.id);
              return (
                <div key={a.id} className="rounded-md border border-border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-base font-semibold text-foreground">{a.title}</h3>
                    <Badge variant={a.published ? "sage" : "outline"}>{a.published ? "Published" : "Draft"}</Badge>
                  </div>
                  {relatedSubmissions.length === 0 ? (
                    <p className="mt-2 text-xs text-foreground-muted">No submissions yet.</p>
                  ) : (
                    <ul className="mt-3 flex flex-col divide-y divide-border">
                      {relatedSubmissions.map((s) => (
                        <li key={s.id} className="flex items-center justify-between gap-3 py-2">
                          <div>
                            <p className="text-sm text-foreground">{studentNameById.get(s.student_id) ?? "Student"}</p>
                            <p className="text-xs text-foreground-muted">{assignmentTitleById.get(s.assignment_id)}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={s.status === "graded" ? "sage" : s.status === "submitted" ? "gold" : "outline"}>
                              {s.status.replace("_", " ")}
                            </Badge>
                            {s.status === "submitted" && <GradeSubmissionForm submissionId={s.id} classId={classId} />}
                            {s.status === "graded" && <span className="text-xs text-foreground-muted">{s.teacher_score}/10</span>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
