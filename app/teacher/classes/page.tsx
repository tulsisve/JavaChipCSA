import type { Metadata } from "next";
import Link from "next/link";
import { School } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Classes" };

export default async function TeacherClassesPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: classes } = await supabase
    .from("classes")
    .select("*")
    .eq("teacher_id", user.id)
    .is("archived_at", null)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-foreground">Classes</h1>
        <Button href="/teacher/classes/new">Create class</Button>
      </div>

      {(classes ?? []).length === 0 ? (
        <EmptyState icon={School} title="No classes yet" description="Create your first class to get a join code." actionLabel="Create a class" actionHref="/teacher/classes/new" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {(classes ?? []).map((c) => (
            <Link key={c.id} href={`/teacher/classes/${c.id}`}>
              <Card className="p-5 transition-colors hover:border-amber/50">
                <h2 className="font-display text-lg font-semibold text-foreground">{c.name}</h2>
                <p className="mt-1 text-sm text-foreground-muted">{c.course_name}{c.period ? ` · Period ${c.period}` : ""}</p>
                <p className="mt-3 font-mono text-xs text-amber">Code: {c.join_code}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
