import type { Metadata } from "next";
import { Bookmark } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Bookmarks" };

export default async function BookmarksPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: bookmarks } = await supabase
    .from("student_bookmarks")
    .select("*")
    .eq("student_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground">Bookmarks</h1>
        <p className="mt-1 text-foreground-muted">Lessons, questions, and reference entries you&apos;ve saved.</p>
      </div>
      {(bookmarks ?? []).length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="Nothing bookmarked yet"
          description="Save a lesson or question and it will appear here."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {(bookmarks ?? []).map((b) => (
            <Card key={b.id} className="flex items-center justify-between p-4">
              <span className="text-sm text-foreground">{b.content_type.replace(/_/g, " ")}</span>
              <span className="text-xs text-foreground-muted">{b.folder_name}</span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
