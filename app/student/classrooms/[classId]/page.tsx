import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Pin, ClipboardList } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Classroom" };

export default async function StudentClassroomDetailPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = await params;
  await requireUser();
  const supabase = await createClient();

  const { data: classRow } = await supabase.from("classes").select("*").eq("id", classId).maybeSingle();
  if (!classRow) notFound();

  const [{ data: announcements }, { data: assignments }] = await Promise.all([
    supabase
      .from("class_announcements")
      .select("*")
      .eq("class_id", classId)
      .order("pinned", { ascending: false })
      .order("published_at", { ascending: false }),
    supabase
      .from("assignments")
      .select("*")
      .eq("class_id", classId)
      .eq("published", true)
      .order("due_at", { ascending: true }),
  ]);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground">{classRow.name}</h1>
        <p className="mt-1 text-foreground-muted">{classRow.course_name}{classRow.period ? ` · Period ${classRow.period}` : ""}</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Announcements</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-4">
          {(announcements ?? []).length === 0 ? (
            <p className="text-sm text-foreground-muted">No announcements yet.</p>
          ) : (
            (announcements ?? []).map((a) => (
              <div key={a.id} className="rounded-md border border-border p-4">
                <div className="flex items-center gap-2">
                  {a.pinned && <Pin className="h-3.5 w-3.5 text-amber" />}
                  <h3 className="font-display text-base font-semibold text-foreground">{a.title}</h3>
                </div>
                <p className="mt-1 text-sm text-foreground-muted">{a.message}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Assignments</CardTitle></CardHeader>
        <CardContent>
          {(assignments ?? []).length === 0 ? (
            <EmptyState icon={ClipboardList} title="No assignments yet" description="Your teacher hasn't posted any assignments for this class." />
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {(assignments ?? []).map((a) => (
                <li key={a.id} className="flex items-center justify-between py-3">
                  <Link href={`/student/assignments/${a.id}`} className="text-sm font-medium text-foreground hover:text-amber">
                    {a.title}
                  </Link>
                  <span className="text-xs text-foreground-muted">
                    {a.due_at ? `Due ${new Date(a.due_at).toLocaleDateString()}` : "No due date"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
