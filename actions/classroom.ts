"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";
import { assertWithinFreeTierOrPro } from "@/lib/permissions/subscription";
import type { ActionState } from "@/actions/auth";
import type { AssignmentContentType } from "@/types/database";

function generateJoinCode(): string {
  return randomBytes(4).toString("hex").toUpperCase();
}

export async function joinClassAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireUser();
  const code = String(formData.get("code") ?? "").trim().toUpperCase();

  if (!code) {
    return { error: "Enter a class code." };
  }

  const supabase = await createClient();
  const { data: classId, error } = await supabase.rpc("join_class", { class_join_code: code });

  if (error || !classId) {
    return { error: error?.message ?? "That class code is invalid or has expired." };
  }

  revalidatePath("/student/classrooms");
  redirect(`/student/classrooms/${classId}`);
}

export async function createClassAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  if (user.profile.role !== "teacher") {
    return { error: "Only teacher accounts can create classes." };
  }

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Give your class a name." };

  const supabase = await createClient();

  const { count } = await supabase
    .from("classes")
    .select("*", { count: "exact", head: true })
    .eq("teacher_id", user.id)
    .is("archived_at", null);

  try {
    await assertWithinFreeTierOrPro(user.id, { currentClassCount: count ?? 0 });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Couldn't create class." };
  }

  const { data: newClass, error } = await supabase
    .from("classes")
    .insert({
      teacher_id: user.id,
      name,
      course_name: "AP Computer Science A",
      period: String(formData.get("period") ?? "") || null,
      school_year: String(formData.get("schoolYear") ?? "") || null,
      description: String(formData.get("description") ?? "") || null,
      join_code: generateJoinCode(),
    })
    .select("*")
    .single();

  if (error || !newClass) return { error: "Couldn't create the class. Try again." };

  revalidatePath("/teacher/classes");
  redirect(`/teacher/classes/${newClass.id}`);
}

export async function regenerateJoinCodeAction(classId: string) {
  const user = await requireUser();
  const supabase = await createClient();
  await supabase
    .from("classes")
    .update({ join_code: generateJoinCode() })
    .eq("id", classId)
    .eq("teacher_id", user.id);
  revalidatePath(`/teacher/classes/${classId}`);
}

export async function createAssignmentAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const classId = String(formData.get("classId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const instructions = String(formData.get("instructions") ?? "");
  const dueAt = String(formData.get("dueAt") ?? "");
  const contentType = String(formData.get("contentType") ?? "lesson");
  const contentId = String(formData.get("contentId") ?? "");

  if (!classId || !title) return { error: "A title and class are required." };

  const supabase = await createClient();

  const { count } = await supabase
    .from("assignments")
    .select("*", { count: "exact", head: true })
    .eq("class_id", classId);

  try {
    await assertWithinFreeTierOrPro(user.id, { currentAssignmentCount: count ?? 0 });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Couldn't create assignment." };
  }

  const { data: assignment, error } = await supabase
    .from("assignments")
    .insert({
      class_id: classId,
      teacher_id: user.id,
      title,
      instructions: instructions || null,
      due_at: dueAt ? new Date(dueAt).toISOString() : null,
      attempt_limit: 2,
      allow_late: true,
      published: true,
    })
    .select("*")
    .single();

  if (error || !assignment) return { error: "Couldn't create the assignment. Try again." };

  if (contentId) {
    await supabase.from("assignment_items").insert({
      assignment_id: assignment.id,
      content_type: contentType as AssignmentContentType,
      content_id: contentId,
      sort_order: 0,
      points: 10,
    });
  }

  revalidatePath(`/teacher/classes/${classId}`);
  redirect(`/teacher/classes/${classId}`);
}

export async function startAssignmentAction(assignmentId: string) {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("assignment_submissions")
    .select("*")
    .eq("assignment_id", assignmentId)
    .eq("student_id", user.id)
    .order("attempt_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!existing) {
    await supabase.from("assignment_submissions").insert({
      assignment_id: assignmentId,
      student_id: user.id,
      status: "in_progress",
      attempt_number: 1,
      started_at: new Date().toISOString(),
    });
  }

  revalidatePath(`/student/assignments/${assignmentId}`);
}

export async function submitAssignmentAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const assignmentId = String(formData.get("assignmentId") ?? "");
  if (!assignmentId) return { error: "Missing assignment." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("assignment_submissions")
    .update({ status: "submitted", submitted_at: new Date().toISOString() })
    .eq("assignment_id", assignmentId)
    .eq("student_id", user.id);

  if (error) return { error: "Couldn't submit. Try again." };

  revalidatePath(`/student/assignments/${assignmentId}`);
  return { success: true };
}

export async function gradeSubmissionAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const submissionId = String(formData.get("submissionId") ?? "");
  const score = Number(formData.get("score") ?? NaN);
  const feedback = String(formData.get("feedback") ?? "");
  const classId = String(formData.get("classId") ?? "");

  if (!submissionId || Number.isNaN(score)) return { error: "Enter a valid score." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("assignment_submissions")
    .update({ status: "graded", teacher_score: score, graded_at: new Date().toISOString() })
    .eq("id", submissionId);

  if (error) return { error: "Couldn't save the grade." };

  if (feedback) {
    await supabase.from("teacher_feedback").insert({
      submission_id: submissionId,
      teacher_id: user.id,
      feedback,
    });
  }

  revalidatePath(`/teacher/classes/${classId}`);
  return { success: true };
}
