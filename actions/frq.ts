"use server";

import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function saveFrqProgressAction(input: {
  frqId: string;
  code: string;
  planningNotes: string;
  reflection: string;
  submit: boolean;
}) {
  const user = await requireUser();
  if (!UUID_RE.test(input.frqId)) {
    return { saved: false, reason: "This FRQ hasn't been seeded to the database yet — your work is kept locally in this session only." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("student_frq_submissions")
    .select("*")
    .eq("student_id", user.id)
    .eq("frq_id", input.frqId)
    .maybeSingle();

  const payload = {
    student_id: user.id,
    frq_id: input.frqId,
    code: input.code,
    planning_notes: input.planningNotes,
    reflection: input.reflection,
    status: input.submit ? ("submitted" as const) : ("in_progress" as const),
    submitted_at: input.submit ? new Date().toISOString() : null,
  };

  if (existing) {
    await supabase.from("student_frq_submissions").update(payload).eq("id", existing.id);
  } else {
    await supabase.from("student_frq_submissions").insert(payload);
  }

  return { saved: true, reason: null };
}
