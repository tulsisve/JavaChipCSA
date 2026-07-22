-- ============================================================================
-- JavaChip — Core Schema
-- Run against a Supabase Postgres database. Requires the pgcrypto extension
-- for gen_random_uuid(), which Supabase enables by default.
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------

create type user_role as enum ('student', 'teacher', 'admin');

create type theme_preference as enum ('light', 'dark', 'system');

create type subscription_plan as enum ('monthly', 'annual');

create type subscription_status as enum (
  'trialing', 'active', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid'
);

create type difficulty_level as enum ('intro', 'easy', 'medium', 'hard', 'exam');

create type mastery_level as enum (
  'not_started', 'beginning', 'developing', 'familiar', 'strong', 'mastered'
);

create type review_status as enum (
  'new', 'learning', 'developing', 'familiar', 'strong', 'mastered', 'due_for_review'
);

create type lesson_progress_status as enum ('not_started', 'in_progress', 'completed');

create type drill_type as enum (
  'type_from_memory', 'fill_in_blank', 'code_ordering', 'error_correction',
  'flashcard', 'speed_round', 'plain_english_to_java', 'java_to_plain_english',
  'compare_similar_syntax', 'method_header_drill', 'mixed_recall'
);

create type frq_question_type as enum (
  'guided', 'standard', 'exam', 'repair', 'rubric_grading',
  'method_header', 'trace_before_coding', 'pseudocode'
);

create type bookmark_content_type as enum (
  'lesson', 'unit', 'syntax_question', 'syntax_template', 'mcq_question',
  'frq_question', 'reference_entry', 'assignment'
);

create type assignment_content_type as enum (
  'lesson', 'lesson_section', 'syntax_drill_set', 'mcq_set', 'frq',
  'unit_checkpoint', 'mastery_quiz', 'custom_question', 'reflection', 'study_session'
);

create type submission_status as enum (
  'not_started', 'in_progress', 'submitted', 'graded', 'returned', 'missing', 'excused'
);

create type class_member_status as enum ('active', 'removed', 'invited');

create type study_plan_type as enum (
  'full_year', 'semester', 'eight_week_review', 'four_week_intensive',
  'two_week_emergency', 'weekend_only', 'syntax_recovery', 'frq_focused',
  'mcq_focused', 'custom'
);

create type study_session_status as enum ('scheduled', 'completed', 'skipped', 'rescheduled');

create type report_status as enum ('open', 'reviewing', 'resolved', 'dismissed');

-- ----------------------------------------------------------------------------
-- Profiles & preferences
-- ----------------------------------------------------------------------------

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role user_role not null default 'student',
  display_name text not null,
  email text not null,
  avatar_url text,
  school_name text,
  graduation_year integer,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  suspended_at timestamptz
);

create unique index profiles_email_idx on profiles (lower(email));
create index profiles_role_idx on profiles (role);

create table user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles (id) on delete cascade,
  theme theme_preference not null default 'system',
  editor_theme text not null default 'javachip-dark',
  reduced_motion boolean not null default false,
  high_contrast boolean not null default false,
  text_size text not null default 'md',
  ambient_audio_enabled boolean not null default false,
  notification_preferences jsonb not null default '{
    "assignment_due": true,
    "feedback_ready": true,
    "streak_reminder": true,
    "weekly_summary": true
  }'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Teacher subscriptions (JavaChip Pro / Stripe)
-- ----------------------------------------------------------------------------

create table teacher_subscriptions (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null unique references profiles (id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan subscription_plan,
  status subscription_status not null default 'incomplete',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index teacher_subscriptions_status_idx on teacher_subscriptions (status);

-- ----------------------------------------------------------------------------
-- Course content
-- ----------------------------------------------------------------------------

create table courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  slug text not null unique,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table units (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses (id) on delete cascade,
  unit_number integer not null,
  title text not null,
  slug text not null,
  description text not null,
  estimated_minutes integer not null default 120,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, unit_number),
  unique (course_id, slug)
);

create index units_course_idx on units (course_id, sort_order);

create table lessons (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references units (id) on delete cascade,
  title text not null,
  slug text not null,
  description text not null,
  estimated_minutes integer not null default 20,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (unit_id, slug)
);

create index lessons_unit_idx on lessons (unit_id, sort_order);

create table lesson_sections (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons (id) on delete cascade,
  section_type text not null,
  title text not null,
  content jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index lesson_sections_lesson_idx on lesson_sections (lesson_id, sort_order);

create table vocabulary_terms (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid references units (id) on delete cascade,
  lesson_id uuid references lessons (id) on delete cascade,
  term text not null,
  definition text not null,
  example text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index vocabulary_terms_unit_idx on vocabulary_terms (unit_id);
create index vocabulary_terms_lesson_idx on vocabulary_terms (lesson_id);

create table syntax_templates (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid references units (id) on delete cascade,
  topic text not null,
  title text not null,
  description text not null,
  template_code text not null,
  example_code text not null,
  common_mistake text,
  difficulty difficulty_level not null default 'easy',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index syntax_templates_unit_idx on syntax_templates (unit_id);
create index syntax_templates_topic_idx on syntax_templates (topic);

create table syntax_questions (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid references units (id) on delete cascade,
  lesson_id uuid references lessons (id) on delete cascade,
  topic text not null,
  drill_type drill_type not null,
  prompt text not null,
  starter_code text,
  correct_answer text not null,
  explanation text not null,
  difficulty difficulty_level not null default 'easy',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index syntax_questions_unit_idx on syntax_questions (unit_id);
create index syntax_questions_topic_idx on syntax_questions (topic);
create index syntax_questions_drill_type_idx on syntax_questions (drill_type);

create table mcq_questions (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid references units (id) on delete cascade,
  lesson_id uuid references lessons (id) on delete cascade,
  topic text not null,
  prompt text not null,
  code text,
  explanation text not null,
  difficulty difficulty_level not null default 'medium',
  estimated_seconds integer not null default 90,
  skills_tested text[] not null default '{}',
  common_misconception text,
  hint text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index mcq_questions_unit_idx on mcq_questions (unit_id);
create index mcq_questions_topic_idx on mcq_questions (topic);
create index mcq_questions_published_idx on mcq_questions (published);

create table mcq_choices (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references mcq_questions (id) on delete cascade,
  choice_label text not null,
  choice_text text not null,
  is_correct boolean not null default false,
  explanation text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (question_id, choice_label)
);

create index mcq_choices_question_idx on mcq_choices (question_id);

create table frq_questions (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid references units (id) on delete cascade,
  title text not null,
  prompt text not null,
  starter_code text,
  difficulty difficulty_level not null default 'medium',
  estimated_minutes integer not null default 25,
  question_type frq_question_type not null default 'standard',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index frq_questions_unit_idx on frq_questions (unit_id);

create table frq_rubric_items (
  id uuid primary key default gen_random_uuid(),
  frq_id uuid not null references frq_questions (id) on delete cascade,
  description text not null,
  point_value numeric(4, 1) not null default 1,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index frq_rubric_items_frq_idx on frq_rubric_items (frq_id);

create table frq_test_cases (
  id uuid primary key default gen_random_uuid(),
  frq_id uuid not null references frq_questions (id) on delete cascade,
  input_data text not null,
  expected_output text not null,
  is_hidden boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index frq_test_cases_frq_idx on frq_test_cases (frq_id);

-- ----------------------------------------------------------------------------
-- Student progress & practice history
-- ----------------------------------------------------------------------------

create table student_lesson_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles (id) on delete cascade,
  lesson_id uuid not null references lessons (id) on delete cascade,
  status lesson_progress_status not null default 'not_started',
  completion_percentage integer not null default 0,
  completed_at timestamptz,
  last_viewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, lesson_id)
);

create index student_lesson_progress_student_idx on student_lesson_progress (student_id);

create table student_syntax_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles (id) on delete cascade,
  question_id uuid not null references syntax_questions (id) on delete cascade,
  response text not null,
  is_correct boolean not null,
  response_time_ms integer,
  confidence smallint,
  hints_used integer not null default 0,
  error_category text,
  attempted_at timestamptz not null default now()
);

create index student_syntax_attempts_student_idx on student_syntax_attempts (student_id, attempted_at desc);
create index student_syntax_attempts_question_idx on student_syntax_attempts (question_id);

create table student_mcq_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles (id) on delete cascade,
  question_id uuid not null references mcq_questions (id) on delete cascade,
  selected_choice_id uuid references mcq_choices (id) on delete set null,
  is_correct boolean not null,
  response_time_ms integer,
  confidence smallint,
  answer_changes integer not null default 0,
  attempted_at timestamptz not null default now()
);

create index student_mcq_attempts_student_idx on student_mcq_attempts (student_id, attempted_at desc);
create index student_mcq_attempts_question_idx on student_mcq_attempts (question_id);

create table student_frq_submissions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles (id) on delete cascade,
  frq_id uuid not null references frq_questions (id) on delete cascade,
  assignment_id uuid,
  code text not null default '',
  planning_notes text,
  reflection text,
  automated_score numeric(5, 1),
  teacher_score numeric(5, 1),
  status submission_status not null default 'in_progress',
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index student_frq_submissions_student_idx on student_frq_submissions (student_id);
create index student_frq_submissions_frq_idx on student_frq_submissions (frq_id);

create table student_mastery (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles (id) on delete cascade,
  unit_id uuid references units (id) on delete cascade,
  topic text not null,
  mastery_score numeric(5, 2) not null default 0,
  mastery_level mastery_level not null default 'not_started',
  review_status review_status not null default 'new',
  last_practiced_at timestamptz,
  next_review_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, unit_id, topic)
);

create index student_mastery_student_idx on student_mastery (student_id);
create index student_mastery_next_review_idx on student_mastery (student_id, next_review_at);

create table student_bookmarks (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles (id) on delete cascade,
  content_type bookmark_content_type not null,
  content_id uuid not null,
  folder_name text not null default 'General',
  created_at timestamptz not null default now(),
  unique (student_id, content_type, content_id)
);

create index student_bookmarks_student_idx on student_bookmarks (student_id);

create table student_notes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles (id) on delete cascade,
  content_type bookmark_content_type not null,
  content_id uuid not null,
  note text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index student_notes_student_idx on student_notes (student_id);
create index student_notes_content_idx on student_notes (content_type, content_id);

-- ----------------------------------------------------------------------------
-- Study planner
-- ----------------------------------------------------------------------------

create table study_plans (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles (id) on delete cascade,
  exam_date date,
  target_score smallint,
  sessions_per_week smallint not null default 3,
  minutes_per_session smallint not null default 25,
  plan_type study_plan_type not null default 'custom',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index study_plans_student_idx on study_plans (student_id);

create table study_sessions (
  id uuid primary key default gen_random_uuid(),
  study_plan_id uuid not null references study_plans (id) on delete cascade,
  student_id uuid not null references profiles (id) on delete cascade,
  title text not null,
  scheduled_at timestamptz not null,
  duration_minutes smallint not null default 25,
  status study_session_status not null default 'scheduled',
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index study_sessions_student_idx on study_sessions (student_id, scheduled_at);
create index study_sessions_plan_idx on study_sessions (study_plan_id);

-- ----------------------------------------------------------------------------
-- JavaChip Classroom
-- ----------------------------------------------------------------------------

create table classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references profiles (id) on delete cascade,
  name text not null,
  course_name text not null default 'AP Computer Science A',
  period text,
  school_name text,
  school_year text,
  description text,
  join_code text not null unique,
  join_code_expires_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index classes_teacher_idx on classes (teacher_id);
create unique index classes_join_code_idx on classes (join_code) where archived_at is null;

create table class_members (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes (id) on delete cascade,
  student_id uuid not null references profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  status class_member_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (class_id, student_id)
);

create index class_members_class_idx on class_members (class_id);
create index class_members_student_idx on class_members (student_id);

create table class_announcements (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes (id) on delete cascade,
  teacher_id uuid not null references profiles (id) on delete cascade,
  title text not null,
  message text not null,
  published_at timestamptz,
  expires_at timestamptz,
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index class_announcements_class_idx on class_announcements (class_id, published_at desc);

-- ----------------------------------------------------------------------------
-- Assignments & grading
-- ----------------------------------------------------------------------------

create table assignments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes (id) on delete cascade,
  teacher_id uuid not null references profiles (id) on delete cascade,
  title text not null,
  instructions text,
  available_at timestamptz,
  due_at timestamptz,
  time_limit_minutes integer,
  attempt_limit integer not null default 1,
  allow_late boolean not null default true,
  feedback_release_at timestamptz,
  explanation_release_at timestamptz,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index assignments_class_idx on assignments (class_id);
create index assignments_due_idx on assignments (due_at);

create table assignment_items (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references assignments (id) on delete cascade,
  content_type assignment_content_type not null,
  content_id uuid not null,
  sort_order integer not null default 0,
  points numeric(5, 1) not null default 1,
  created_at timestamptz not null default now()
);

create index assignment_items_assignment_idx on assignment_items (assignment_id, sort_order);

alter table student_frq_submissions
  add constraint student_frq_submissions_assignment_fkey
  foreign key (assignment_id) references assignments (id) on delete set null;

create table assignment_submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references assignments (id) on delete cascade,
  student_id uuid not null references profiles (id) on delete cascade,
  status submission_status not null default 'not_started',
  score numeric(6, 2),
  teacher_score numeric(6, 2),
  attempt_number integer not null default 1,
  started_at timestamptz,
  submitted_at timestamptz,
  graded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assignment_id, student_id, attempt_number)
);

create index assignment_submissions_assignment_idx on assignment_submissions (assignment_id);
create index assignment_submissions_student_idx on assignment_submissions (student_id);

create table teacher_feedback (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references assignment_submissions (id) on delete cascade,
  teacher_id uuid not null references profiles (id) on delete cascade,
  feedback text,
  rubric_feedback jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index teacher_feedback_submission_idx on teacher_feedback (submission_id);

-- ----------------------------------------------------------------------------
-- Gamification
-- ----------------------------------------------------------------------------

create table badges (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null,
  icon text not null,
  requirement_type text not null,
  requirement_value integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table student_badges (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles (id) on delete cascade,
  badge_id uuid not null references badges (id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique (student_id, badge_id)
);

create index student_badges_student_idx on student_badges (student_id);

-- ----------------------------------------------------------------------------
-- Moderation & platform operations
-- ----------------------------------------------------------------------------

create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references profiles (id) on delete cascade,
  content_type text not null,
  content_id uuid not null,
  reason text not null,
  status report_status not null default 'open',
  reviewed_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index reports_status_idx on reports (status);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_actor_idx on audit_logs (actor_id);
create index audit_logs_entity_idx on audit_logs (entity_type, entity_id);
create index audit_logs_created_idx on audit_logs (created_at desc);

-- ----------------------------------------------------------------------------
-- updated_at maintenance
-- ----------------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  for t in
    select table_name from information_schema.columns
    where column_name = 'updated_at' and table_schema = 'public'
  loop
    execute format(
      'create trigger set_updated_at before update on %I for each row execute function set_updated_at();',
      t
    );
  end loop;
end;
$$;

-- ----------------------------------------------------------------------------
-- Auto-create a profile row whenever a new auth user is created.
-- Role and display name arrive via signup metadata set client-side by the
-- sign-up server action; default to 'student' when absent so no row is
-- ever left without a role. Admin can never be set through this path.
-- ----------------------------------------------------------------------------

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, display_name, email)
  values (
    new.id,
    case
      when new.raw_user_meta_data ->> 'role' = 'teacher' then 'teacher'::user_role
      else 'student'::user_role
    end,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    new.email
  );

  insert into public.user_preferences (user_id) values (new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
