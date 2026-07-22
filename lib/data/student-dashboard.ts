import "server-only";
import { createClient } from "@/lib/supabase/server";
import { units } from "@/lib/content/units";

export interface StudentDashboardData {
  displayName: string;
  courseCompletionPercent: number;
  completedLessons: number;
  totalLessons: number;
  streakDays: number;
  mcqAccuracy: number | null;
  mcqAttempted: number;
  reviewQueueCount: number;
  weakestTopics: { topic: string; masteryScore: number }[];
  strongestTopics: { topic: string; masteryScore: number }[];
  upcomingAssignments: { id: string; title: string; dueAt: string | null; className: string }[];
  recentBadges: { name: string; icon: string; earnedAt: string }[];
  recentFeedback: { feedback: string; assignmentTitle: string }[];
  savedFrqCount: number;
  todaysBrew: { title: string; href: string; description: string };
}

const TOTAL_SEEDED_LESSONS = units.reduce((sum, u) => sum + u.lessons.length, 0);

export async function getStudentDashboardData(studentId: string, displayName: string): Promise<StudentDashboardData> {
  const supabase = await createClient();

  const [
    lessonProgressRes,
    mcqAttemptsRes,
    masteryRes,
    classMembershipsRes,
    badgesRes,
    frqSubmissionsRes,
  ] = await Promise.all([
    supabase.from("student_lesson_progress").select("*").eq("student_id", studentId),
    supabase.from("student_mcq_attempts").select("*").eq("student_id", studentId),
    supabase.from("student_mastery").select("*").eq("student_id", studentId),
    supabase.from("class_members").select("*").eq("student_id", studentId).eq("status", "active"),
    supabase
      .from("student_badges")
      .select("*")
      .eq("student_id", studentId)
      .order("earned_at", { ascending: false })
      .limit(3),
    supabase.from("student_frq_submissions").select("*").eq("student_id", studentId).eq("status", "in_progress"),
  ]);

  const lessonProgress = lessonProgressRes.data ?? [];
  const mcqAttempts = mcqAttemptsRes.data ?? [];
  const mastery = masteryRes.data ?? [];
  const classIds = (classMembershipsRes.data ?? []).map((m) => m.class_id);
  const frqSubmissions = frqSubmissionsRes.data ?? [];

  const completedLessons = lessonProgress.filter((p) => p.status === "completed").length;
  const courseCompletionPercent =
    TOTAL_SEEDED_LESSONS > 0 ? Math.round((completedLessons / TOTAL_SEEDED_LESSONS) * 100) : 0;

  const mcqCorrect = mcqAttempts.filter((a) => a.is_correct).length;
  const mcqAccuracy = mcqAttempts.length > 0 ? Math.round((mcqCorrect / mcqAttempts.length) * 100) : null;

  const reviewQueueCount = mastery.filter((m) => m.review_status === "due_for_review").length;

  const sortedByMastery = [...mastery].sort((a, b) => a.mastery_score - b.mastery_score);
  const weakestTopics = sortedByMastery.slice(0, 3).map((m) => ({ topic: m.topic, masteryScore: m.mastery_score }));
  const strongestTopics = sortedByMastery
    .slice(-3)
    .reverse()
    .map((m) => ({ topic: m.topic, masteryScore: m.mastery_score }));

  const attemptDates = new Set(
    [...mcqAttempts.map((a) => a.attempted_at)].map((ts) => new Date(ts).toDateString())
  );
  let streakDays = 0;
  const cursor = new Date();
  while (attemptDates.has(cursor.toDateString())) {
    streakDays += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  let upcomingAssignments: StudentDashboardData["upcomingAssignments"] = [];
  if (classIds.length > 0) {
    const { data: assignments } = await supabase
      .from("assignments")
      .select("*")
      .in("class_id", classIds)
      .eq("published", true)
      .order("due_at", { ascending: true })
      .limit(5);

    if (assignments && assignments.length > 0) {
      const classNameById = new Map<string, string>();
      const { data: classRows } = await supabase.from("classes").select("*").in("id", classIds);
      for (const c of classRows ?? []) classNameById.set(c.id, c.name);

      upcomingAssignments = assignments.map((a) => ({
        id: a.id,
        title: a.title,
        dueAt: a.due_at,
        className: classNameById.get(a.class_id) ?? "Class",
      }));
    }
  }

  const studentBadges = badgesRes.data ?? [];
  let recentBadges: StudentDashboardData["recentBadges"] = [];
  if (studentBadges.length > 0) {
    const { data: badgeDefs } = await supabase
      .from("badges")
      .select("*")
      .in("id", studentBadges.map((b) => b.badge_id));
    const badgeById = new Map((badgeDefs ?? []).map((b) => [b.id, b]));
    recentBadges = studentBadges.map((b) => ({
      name: badgeById.get(b.badge_id)?.name ?? "Badge",
      icon: badgeById.get(b.badge_id)?.icon ?? "award",
      earnedAt: b.earned_at,
    }));
  }

  // Simple heuristic: advance one unit per completed lesson. Good enough for
  // a "what's next" nudge; a real recommendation engine would match
  // individual lesson IDs against student_lesson_progress per unit.
  const firstIncompleteUnit = units[Math.min(completedLessons, units.length - 1)];
  const nextLesson = firstIncompleteUnit?.lessons.find((l) => l.built) ?? units[0].lessons[0];
  const todaysBrew = {
    title: nextLesson.title,
    href: `/student/units/${firstIncompleteUnit?.slug ?? units[0].slug}/lessons/${nextLesson.slug}`,
    description: `Continue Unit ${firstIncompleteUnit?.unitNumber ?? 1} — ${firstIncompleteUnit?.title ?? units[0].title}`,
  };

  return {
    displayName,
    courseCompletionPercent,
    completedLessons,
    totalLessons: TOTAL_SEEDED_LESSONS,
    streakDays,
    mcqAccuracy,
    mcqAttempted: mcqAttempts.length,
    reviewQueueCount,
    weakestTopics,
    strongestTopics,
    upcomingAssignments,
    recentBadges,
    recentFeedback: [],
    savedFrqCount: frqSubmissions.length,
    todaysBrew,
  };
}
