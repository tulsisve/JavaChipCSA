import "server-only";
import { createClient } from "@/lib/supabase/server";

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

export const FREE_TEACHER_LIMITS = {
  maxClasses: 1,
  maxStudentsPerClass: 3,
  maxAssignments: 3,
} as const;

/**
 * The single source of truth for "is this teacher's JavaChip Pro active."
 * Always reads from the database (populated exclusively by the Stripe
 * webhook) — never trust a client-supplied plan/status value.
 */
export async function isProTeacher(teacherId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("teacher_subscriptions")
    .select("status")
    .eq("teacher_id", teacherId)
    .maybeSingle();

  return !!data && ACTIVE_STATUSES.has(data.status);
}

export async function getSubscription(teacherId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("teacher_subscriptions")
    .select("*")
    .eq("teacher_id", teacherId)
    .maybeSingle();
  return data;
}

/**
 * Throws when a free-tier teacher attempts to exceed demo limits. Called
 * from server actions right before an insert — this is the actual
 * enforcement point, since RLS alone can't express "count < 1".
 */
export async function assertWithinFreeTierOrPro(
  teacherId: string,
  check: { currentClassCount?: number; currentStudentCount?: number; currentAssignmentCount?: number }
) {
  if (await isProTeacher(teacherId)) return;

  if (check.currentClassCount !== undefined && check.currentClassCount >= FREE_TEACHER_LIMITS.maxClasses) {
    throw new Error(
      `Free accounts can create ${FREE_TEACHER_LIMITS.maxClasses} demo class. Upgrade to JavaChip Pro for unlimited classes.`
    );
  }
  if (
    check.currentStudentCount !== undefined &&
    check.currentStudentCount >= FREE_TEACHER_LIMITS.maxStudentsPerClass
  ) {
    throw new Error(
      `Free demo classes are limited to ${FREE_TEACHER_LIMITS.maxStudentsPerClass} students. Upgrade to JavaChip Pro to invite your full roster.`
    );
  }
  if (
    check.currentAssignmentCount !== undefined &&
    check.currentAssignmentCount >= FREE_TEACHER_LIMITS.maxAssignments
  ) {
    throw new Error(
      `Free accounts can create ${FREE_TEACHER_LIMITS.maxAssignments} sample assignments. Upgrade to JavaChip Pro for unlimited assignments.`
    );
  }
}
