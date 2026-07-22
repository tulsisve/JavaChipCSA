// Hand-maintained mirror of database/migrations/0001_schema.sql.
// When the schema changes, prefer regenerating via:
//   npx supabase gen types typescript --project-id <id> > types/database.ts
// and re-applying the ergonomic aliases exported at the bottom of this file.
//
// IMPORTANT: every Row type below is a `type` alias, never an `interface`.
// With the installed @supabase/postgrest-js (2.110.8), a Row declared as an
// `interface` fails structural constraint checking against postgrest-js's
// internal `GenericSchema` (Schema silently falls back to `any`/`never`
// instead of erroring loudly), so every .select() on that table resolves to
// `never` — even a plain `.select("*")`. Type aliases satisfy the same
// constraint correctly. Keep it that way when adding tables.

export type UserRole = "student" | "teacher" | "admin";
export type ThemePreference = "light" | "dark" | "system";
export type SubscriptionPlan = "monthly" | "annual";
export type SubscriptionStatus =
  | "trialing" | "active" | "past_due" | "canceled" | "incomplete" | "incomplete_expired" | "unpaid";
export type DifficultyLevel = "intro" | "easy" | "medium" | "hard" | "exam";
export type MasteryLevel = "not_started" | "beginning" | "developing" | "familiar" | "strong" | "mastered";
export type ReviewStatus = "new" | "learning" | "developing" | "familiar" | "strong" | "mastered" | "due_for_review";
export type LessonProgressStatus = "not_started" | "in_progress" | "completed";
export type DrillType =
  | "type_from_memory" | "fill_in_blank" | "code_ordering" | "error_correction" | "flashcard"
  | "speed_round" | "plain_english_to_java" | "java_to_plain_english" | "compare_similar_syntax"
  | "method_header_drill" | "mixed_recall";
export type FrqQuestionType =
  | "guided" | "standard" | "exam" | "repair" | "rubric_grading" | "method_header"
  | "trace_before_coding" | "pseudocode";
export type BookmarkContentType =
  | "lesson" | "unit" | "syntax_question" | "syntax_template" | "mcq_question"
  | "frq_question" | "reference_entry" | "assignment";
export type AssignmentContentType =
  | "lesson" | "lesson_section" | "syntax_drill_set" | "mcq_set" | "frq" | "unit_checkpoint"
  | "mastery_quiz" | "custom_question" | "reflection" | "study_session";
export type SubmissionStatus = "not_started" | "in_progress" | "submitted" | "graded" | "returned" | "missing" | "excused";
export type ClassMemberStatus = "active" | "removed" | "invited";
export type StudyPlanType =
  | "full_year" | "semester" | "eight_week_review" | "four_week_intensive" | "two_week_emergency"
  | "weekend_only" | "syntax_recovery" | "frq_focused" | "mcq_focused" | "custom";
export type StudySessionStatus = "scheduled" | "completed" | "skipped" | "rescheduled";
export type ReportStatus = "open" | "reviewing" | "resolved" | "dismissed";

type Timestamps = {
  created_at: string;
  updated_at: string;
}

export type ProfileRow = Timestamps & {
  id: string;
  role: UserRole;
  display_name: string;
  email: string;
  avatar_url: string | null;
  school_name: string | null;
  graduation_year: number | null;
  bio: string | null;
  suspended_at: string | null;
}

export type UserPreferencesRow = Timestamps & {
  id: string;
  user_id: string;
  theme: ThemePreference;
  editor_theme: string;
  reduced_motion: boolean;
  high_contrast: boolean;
  text_size: string;
  ambient_audio_enabled: boolean;
  notification_preferences: Record<string, boolean>;
}

export type TeacherSubscriptionRow = Timestamps & {
  id: string;
  teacher_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: SubscriptionPlan | null;
  status: SubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

export type CourseRow = Timestamps & {
  id: string;
  title: string;
  description: string;
  slug: string;
  published: boolean;
}

export type UnitRow = Timestamps & {
  id: string;
  course_id: string;
  unit_number: number;
  title: string;
  slug: string;
  description: string;
  estimated_minutes: number;
  sort_order: number;
  published: boolean;
}

export type LessonRow = Timestamps & {
  id: string;
  unit_id: string;
  title: string;
  slug: string;
  description: string;
  estimated_minutes: number;
  sort_order: number;
  published: boolean;
}

export type LessonSectionRow = Timestamps & {
  id: string;
  lesson_id: string;
  section_type: string;
  title: string;
  content: Record<string, unknown>;
  sort_order: number;
}

export type VocabularyTermRow = Timestamps & {
  id: string;
  unit_id: string | null;
  lesson_id: string | null;
  term: string;
  definition: string;
  example: string | null;
}

export type SyntaxTemplateRow = Timestamps & {
  id: string;
  unit_id: string | null;
  topic: string;
  title: string;
  description: string;
  template_code: string;
  example_code: string;
  common_mistake: string | null;
  difficulty: DifficultyLevel;
}

export type SyntaxQuestionRow = Timestamps & {
  id: string;
  unit_id: string | null;
  lesson_id: string | null;
  topic: string;
  drill_type: DrillType;
  prompt: string;
  starter_code: string | null;
  correct_answer: string;
  explanation: string;
  difficulty: DifficultyLevel;
}

export type McqQuestionRow = Timestamps & {
  id: string;
  unit_id: string | null;
  lesson_id: string | null;
  topic: string;
  prompt: string;
  code: string | null;
  explanation: string;
  difficulty: DifficultyLevel;
  estimated_seconds: number;
  skills_tested: string[];
  common_misconception: string | null;
  hint: string | null;
  published: boolean;
}

export type McqChoiceRow = Timestamps & {
  id: string;
  question_id: string;
  choice_label: string;
  choice_text: string;
  is_correct: boolean;
  explanation: string;
  sort_order: number;
}

export type FrqQuestionRow = Timestamps & {
  id: string;
  unit_id: string | null;
  title: string;
  prompt: string;
  starter_code: string | null;
  difficulty: DifficultyLevel;
  estimated_minutes: number;
  question_type: FrqQuestionType;
  published: boolean;
}

export type FrqRubricItemRow = Timestamps & {
  id: string;
  frq_id: string;
  description: string;
  point_value: number;
  sort_order: number;
}

export type FrqTestCaseRow = Timestamps & {
  id: string;
  frq_id: string;
  input_data: string;
  expected_output: string;
  is_hidden: boolean;
  sort_order: number;
}

export type StudentLessonProgressRow = Timestamps & {
  id: string;
  student_id: string;
  lesson_id: string;
  status: LessonProgressStatus;
  completion_percentage: number;
  completed_at: string | null;
  last_viewed_at: string | null;
}

export type StudentSyntaxAttemptRow = {
  id: string;
  student_id: string;
  question_id: string;
  response: string;
  is_correct: boolean;
  response_time_ms: number | null;
  confidence: number | null;
  hints_used: number;
  error_category: string | null;
  attempted_at: string;
}

export type StudentMcqAttemptRow = {
  id: string;
  student_id: string;
  question_id: string;
  selected_choice_id: string | null;
  is_correct: boolean;
  response_time_ms: number | null;
  confidence: number | null;
  answer_changes: number;
  attempted_at: string;
}

export type StudentFrqSubmissionRow = Timestamps & {
  id: string;
  student_id: string;
  frq_id: string;
  assignment_id: string | null;
  code: string;
  planning_notes: string | null;
  reflection: string | null;
  automated_score: number | null;
  teacher_score: number | null;
  status: SubmissionStatus;
  submitted_at: string | null;
}

export type StudentMasteryRow = Timestamps & {
  id: string;
  student_id: string;
  unit_id: string | null;
  topic: string;
  mastery_score: number;
  mastery_level: MasteryLevel;
  review_status: ReviewStatus;
  last_practiced_at: string | null;
  next_review_at: string | null;
}

export type StudentBookmarkRow = {
  id: string;
  student_id: string;
  content_type: BookmarkContentType;
  content_id: string;
  folder_name: string;
  created_at: string;
}

export type StudentNoteRow = Timestamps & {
  id: string;
  student_id: string;
  content_type: BookmarkContentType;
  content_id: string;
  note: string;
}

export type StudyPlanRow = Timestamps & {
  id: string;
  student_id: string;
  exam_date: string | null;
  target_score: number | null;
  sessions_per_week: number;
  minutes_per_session: number;
  plan_type: StudyPlanType;
}

export type StudySessionRow = Timestamps & {
  id: string;
  study_plan_id: string;
  student_id: string;
  title: string;
  scheduled_at: string;
  duration_minutes: number;
  status: StudySessionStatus;
  completed_at: string | null;
}

export type ClassRow = Timestamps & {
  id: string;
  teacher_id: string;
  name: string;
  course_name: string;
  period: string | null;
  school_name: string | null;
  school_year: string | null;
  description: string | null;
  join_code: string;
  join_code_expires_at: string | null;
  archived_at: string | null;
}

export type ClassMemberRow = Timestamps & {
  id: string;
  class_id: string;
  student_id: string;
  joined_at: string;
  status: ClassMemberStatus;
}

export type ClassAnnouncementRow = Timestamps & {
  id: string;
  class_id: string;
  teacher_id: string;
  title: string;
  message: string;
  published_at: string | null;
  expires_at: string | null;
  pinned: boolean;
}

export type AssignmentRow = Timestamps & {
  id: string;
  class_id: string;
  teacher_id: string;
  title: string;
  instructions: string | null;
  available_at: string | null;
  due_at: string | null;
  time_limit_minutes: number | null;
  attempt_limit: number;
  allow_late: boolean;
  feedback_release_at: string | null;
  explanation_release_at: string | null;
  published: boolean;
}

export type AssignmentItemRow = {
  id: string;
  assignment_id: string;
  content_type: AssignmentContentType;
  content_id: string;
  sort_order: number;
  points: number;
  created_at: string;
}

export type AssignmentSubmissionRow = Timestamps & {
  id: string;
  assignment_id: string;
  student_id: string;
  status: SubmissionStatus;
  score: number | null;
  teacher_score: number | null;
  attempt_number: number;
  started_at: string | null;
  submitted_at: string | null;
  graded_at: string | null;
}

export type TeacherFeedbackRow = Timestamps & {
  id: string;
  submission_id: string;
  teacher_id: string;
  feedback: string | null;
  rubric_feedback: unknown[];
}

export type BadgeRow = Timestamps & {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement_type: string;
  requirement_value: number;
}

export type StudentBadgeRow = {
  id: string;
  student_id: string;
  badge_id: string;
  earned_at: string;
}

export type ReportRow = Timestamps & {
  id: string;
  reporter_id: string;
  content_type: string;
  content_id: string;
  reason: string;
  status: ReportStatus;
  reviewed_by: string | null;
}

export type AuditLogRow = {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

type TableDef<Row, InsertOmit extends keyof Row = never> = {
  Row: Row;
  Insert: Omit<Row, InsertOmit> & Partial<Pick<Row, InsertOmit>>;
  Update: Partial<Row>;
  Relationships: [];
};

type Auto = "id" | "created_at" | "updated_at";

export type Database = {
  public: {
    Tables: {
      profiles: TableDef<ProfileRow, "created_at" | "updated_at" | "suspended_at">;
      user_preferences: TableDef<UserPreferencesRow, Auto>;
      teacher_subscriptions: TableDef<TeacherSubscriptionRow, Auto>;
      courses: TableDef<CourseRow, Auto>;
      units: TableDef<UnitRow, Auto>;
      lessons: TableDef<LessonRow, Auto>;
      lesson_sections: TableDef<LessonSectionRow, Auto>;
      vocabulary_terms: TableDef<VocabularyTermRow, Auto>;
      syntax_templates: TableDef<SyntaxTemplateRow, Auto>;
      syntax_questions: TableDef<SyntaxQuestionRow, Auto>;
      mcq_questions: TableDef<McqQuestionRow, Auto>;
      mcq_choices: TableDef<McqChoiceRow, Auto>;
      frq_questions: TableDef<FrqQuestionRow, Auto>;
      frq_rubric_items: TableDef<FrqRubricItemRow, Auto>;
      frq_test_cases: TableDef<FrqTestCaseRow, Auto>;
      student_lesson_progress: TableDef<StudentLessonProgressRow, Auto>;
      student_syntax_attempts: TableDef<StudentSyntaxAttemptRow, "id" | "attempted_at">;
      student_mcq_attempts: TableDef<StudentMcqAttemptRow, "id" | "attempted_at">;
      student_frq_submissions: TableDef<
        StudentFrqSubmissionRow,
        Auto | "assignment_id" | "code" | "planning_notes" | "reflection" | "automated_score" | "teacher_score" | "status" | "submitted_at"
      >;
      student_mastery: TableDef<StudentMasteryRow, Auto>;
      student_bookmarks: TableDef<StudentBookmarkRow, "id" | "created_at">;
      student_notes: TableDef<StudentNoteRow, Auto>;
      study_plans: TableDef<StudyPlanRow, Auto>;
      study_sessions: TableDef<StudySessionRow, Auto>;
      classes: TableDef<ClassRow, Auto | "school_name" | "join_code_expires_at" | "archived_at">;
      class_members: TableDef<ClassMemberRow, Auto | "status">;
      class_announcements: TableDef<ClassAnnouncementRow, Auto | "published_at" | "expires_at" | "pinned">;
      assignments: TableDef<
        AssignmentRow,
        Auto | "instructions" | "available_at" | "due_at" | "time_limit_minutes" | "attempt_limit" | "allow_late" | "feedback_release_at" | "explanation_release_at" | "published"
      >;
      assignment_items: TableDef<AssignmentItemRow, "id" | "created_at">;
      assignment_submissions: TableDef<
        AssignmentSubmissionRow,
        Auto | "score" | "teacher_score" | "attempt_number" | "started_at" | "submitted_at" | "graded_at" | "status"
      >;
      teacher_feedback: TableDef<TeacherFeedbackRow, Auto | "feedback" | "rubric_feedback">;
      badges: TableDef<BadgeRow, Auto>;
      student_badges: TableDef<StudentBadgeRow, "id" | "earned_at">;
      reports: TableDef<ReportRow, Auto>;
      audit_logs: TableDef<AuditLogRow, "id" | "created_at">;
    };
    Views: Record<string, never>;
    Functions: {
      join_class: {
        Args: { class_join_code: string };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
