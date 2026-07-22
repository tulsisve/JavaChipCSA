import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getSubscription, isProTeacher } from "@/lib/permissions/subscription";

export interface TeacherDashboardData {
  classes: { id: string; name: string; studentCount: number }[];
  upcomingAssignments: { id: string; title: string; dueAt: string | null; className: string; classId: string }[];
  recentSubmissions: { id: string; assignmentTitle: string; studentName: string; status: string }[];
  missingCount: number;
  isPro: boolean;
  subscriptionStatus: string | null;
}

export async function getTeacherDashboardData(teacherId: string): Promise<TeacherDashboardData> {
  const supabase = await createClient();

  const [{ data: classRows }, subscription] = await Promise.all([
    supabase.from("classes").select("*").eq("teacher_id", teacherId).is("archived_at", null),
    getSubscription(teacherId),
  ]);

  const classes = classRows ?? [];
  const classIds = classes.map((c) => c.id);

  const classesWithCounts = await Promise.all(
    classes.map(async (c) => {
      const { count } = await supabase
        .from("class_members")
        .select("*", { count: "exact", head: true })
        .eq("class_id", c.id)
        .eq("status", "active");
      return { id: c.id, name: c.name, studentCount: count ?? 0 };
    })
  );

  let upcomingAssignments: TeacherDashboardData["upcomingAssignments"] = [];
  let recentSubmissions: TeacherDashboardData["recentSubmissions"] = [];
  let missingCount = 0;

  if (classIds.length > 0) {
    const classNameById = new Map(classes.map((c) => [c.id, c.name]));

    const { data: assignments } = await supabase
      .from("assignments")
      .select("*")
      .in("class_id", classIds)
      .eq("published", true)
      .order("due_at", { ascending: true })
      .limit(5);

    upcomingAssignments = (assignments ?? []).map((a) => ({
      id: a.id,
      title: a.title,
      dueAt: a.due_at,
      className: classNameById.get(a.class_id) ?? "Class",
      classId: a.class_id,
    }));

    const assignmentIds = (assignments ?? []).map((a) => a.id);
    if (assignmentIds.length > 0) {
      const { data: submissions } = await supabase
        .from("assignment_submissions")
        .select("*")
        .in("assignment_id", assignmentIds)
        .order("submitted_at", { ascending: false })
        .limit(5);

      const studentIds = (submissions ?? []).map((s) => s.student_id);
      const { data: students } =
        studentIds.length > 0
          ? await supabase.from("profiles").select("*").in("id", studentIds)
          : { data: [] };
      const studentNameById = new Map((students ?? []).map((s) => [s.id, s.display_name]));
      const assignmentTitleById = new Map((assignments ?? []).map((a) => [a.id, a.title]));

      recentSubmissions = (submissions ?? []).map((s) => ({
        id: s.id,
        assignmentTitle: assignmentTitleById.get(s.assignment_id) ?? "Assignment",
        studentName: studentNameById.get(s.student_id) ?? "Student",
        status: s.status,
      }));

      missingCount = (submissions ?? []).filter((s) => s.status === "not_started" || s.status === "missing").length;
    }
  }

  return {
    classes: classesWithCounts,
    upcomingAssignments,
    recentSubmissions,
    missingCount,
    isPro: await isProTeacher(teacherId),
    subscriptionStatus: subscription?.status ?? null,
  };
}
