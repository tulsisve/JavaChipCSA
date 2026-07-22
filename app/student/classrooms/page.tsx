import type { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { JoinClassForm } from "@/components/forms/JoinClassForm";

export const metadata: Metadata = { title: "Classrooms" };

export default async function StudentClassroomsPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: memberships } = await supabase
    .from("class_members")
    .select("*")
    .eq("student_id", user.id)
    .eq("status", "active");

  const classIds = (memberships ?? []).map((m) => m.class_id);
  const { data: classes } =
    classIds.length > 0
      ? await supabase.from("classes").select("*").in("id", classIds)
      : { data: [] };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground">Classrooms</h1>
        <p className="mt-1 text-foreground-muted">Join a class with a code from your teacher.</p>
      </div>

      <Card className="p-6">
        <JoinClassForm />
      </Card>

      {(classes ?? []).length === 0 ? (
        <EmptyState
          icon={Users}
          title="No classrooms yet"
          description="Once you join a class, announcements and assignments will show up here."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {(classes ?? []).map((c) => (
            <Link key={c.id} href={`/student/classrooms/${c.id}`}>
              <Card className="p-5 transition-colors hover:border-amber/50">
                <h2 className="font-display text-lg font-semibold text-foreground">{c.name}</h2>
                <p className="mt-1 text-sm text-foreground-muted">{c.course_name}{c.period ? ` · Period ${c.period}` : ""}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
