import type { Metadata } from "next";
import { StickyNote } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Notes" };

export default async function NotesPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: notes } = await supabase
    .from("student_notes")
    .select("*")
    .eq("student_id", user.id)
    .order("updated_at", { ascending: false });

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground">Notes</h1>
        <p className="mt-1 text-foreground-muted">Your notes on lessons, questions, and reference entries.</p>
      </div>
      {(notes ?? []).length === 0 ? (
        <EmptyState
          icon={StickyNote}
          title="No notes yet"
          description="Add a note while studying a lesson or question and it will appear here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {(notes ?? []).map((n) => (
            <Card key={n.id} className="p-4">
              <p className="text-xs text-foreground-muted">{n.content_type.replace(/_/g, " ")}</p>
              <p className="mt-1 text-sm text-foreground">{n.note}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
