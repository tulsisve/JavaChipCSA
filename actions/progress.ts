"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";

export async function markLessonCompleteAction(lessonId: string, unitSlug: string, lessonSlug: string) {
  const user = await requireUser();
  const supabase = await createClient();

  await supabase.from("student_lesson_progress").upsert(
    {
      student_id: user.id,
      lesson_id: lessonId,
      status: "completed",
      completion_percentage: 100,
      completed_at: new Date().toISOString(),
      last_viewed_at: new Date().toISOString(),
    },
    { onConflict: "student_id,lesson_id" }
  );

  revalidatePath(`/student/units/${unitSlug}/lessons/${lessonSlug}`);
  revalidatePath("/student/dashboard");
  revalidatePath("/student/course-map");
}
