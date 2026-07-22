-- ============================================================================
-- JavaChip — Row Level Security
-- Every table that holds user data is locked down by default; access is
-- granted only through the policies below. Helper functions are
-- `security definer` so they can safely read `profiles`/`teacher_subscriptions`
-- without re-triggering RLS recursion, but they always key off auth.uid(),
-- never a client-supplied id — so a user can never impersonate another.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Helper functions
-- ----------------------------------------------------------------------------

create or replace function auth_role()
returns user_role
language sql
stable
security definer set search_path = public
as $$
  select role from profiles where id = auth.uid();
$$;

create or replace function is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select coalesce((select role = 'admin' from profiles where id = auth.uid()), false);
$$;

create or replace function is_teacher()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select coalesce((select role = 'teacher' from profiles where id = auth.uid()), false);
$$;

-- A teacher's premium status. Status is only ever written by the Stripe
-- webhook handler (service-role key), never by the client.
create or replace function is_pro_teacher(target_teacher_id uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select coalesce(
    (
      select status in ('active', 'trialing')
      from teacher_subscriptions
      where teacher_id = target_teacher_id
    ),
    false
  );
$$;

create or replace function owns_class(target_class_id uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select coalesce(
    (select teacher_id = auth.uid() from classes where id = target_class_id),
    false
  );
$$;

create or replace function is_class_member(target_class_id uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select coalesce(
    (
      select true
      from class_members
      where class_id = target_class_id
        and student_id = auth.uid()
        and status = 'active'
    ),
    false
  );
$$;

create or replace function teaches_student(target_student_id uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select coalesce(
    (
      select true
      from class_members cm
      join classes c on c.id = cm.class_id
      where cm.student_id = target_student_id
        and c.teacher_id = auth.uid()
        and cm.status = 'active'
    ),
    false
  );
$$;

-- ----------------------------------------------------------------------------
-- Enable RLS everywhere
-- ----------------------------------------------------------------------------

alter table profiles enable row level security;
alter table user_preferences enable row level security;
alter table teacher_subscriptions enable row level security;
alter table courses enable row level security;
alter table units enable row level security;
alter table lessons enable row level security;
alter table lesson_sections enable row level security;
alter table vocabulary_terms enable row level security;
alter table syntax_templates enable row level security;
alter table syntax_questions enable row level security;
alter table mcq_questions enable row level security;
alter table mcq_choices enable row level security;
alter table frq_questions enable row level security;
alter table frq_rubric_items enable row level security;
alter table frq_test_cases enable row level security;
alter table student_lesson_progress enable row level security;
alter table student_syntax_attempts enable row level security;
alter table student_mcq_attempts enable row level security;
alter table student_frq_submissions enable row level security;
alter table student_mastery enable row level security;
alter table student_bookmarks enable row level security;
alter table student_notes enable row level security;
alter table study_plans enable row level security;
alter table study_sessions enable row level security;
alter table classes enable row level security;
alter table class_members enable row level security;
alter table class_announcements enable row level security;
alter table assignments enable row level security;
alter table assignment_items enable row level security;
alter table assignment_submissions enable row level security;
alter table teacher_feedback enable row level security;
alter table badges enable row level security;
alter table student_badges enable row level security;
alter table reports enable row level security;
alter table audit_logs enable row level security;

-- ----------------------------------------------------------------------------
-- profiles — a user can read/update their own row; teachers can read the
-- profiles of students enrolled in their classes; admins can read/manage all.
-- Nobody may set their own role to 'admin', and nobody may edit suspended_at
-- on themselves.
-- ----------------------------------------------------------------------------

create policy "profiles_select_self" on profiles for select
  using (id = auth.uid());

create policy "profiles_select_teacher_of_student" on profiles for select
  using (teaches_student(id));

create policy "profiles_select_admin" on profiles for select
  using (is_admin());

create policy "profiles_update_self" on profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and role <> 'admin' and suspended_at is null);

create policy "profiles_update_admin" on profiles for update
  using (is_admin());

-- Row insertion happens exclusively via the handle_new_user() trigger
-- (security definer), so no insert policy is granted to authenticated users.

-- ----------------------------------------------------------------------------
-- user_preferences — strictly private to the owner.
-- ----------------------------------------------------------------------------

create policy "prefs_all_self" on user_preferences for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "prefs_select_admin" on user_preferences for select
  using (is_admin());

-- ----------------------------------------------------------------------------
-- teacher_subscriptions — teacher can read their own status; only the
-- service role (Stripe webhook) may insert/update, so no write policy is
-- granted to authenticated users at all.
-- ----------------------------------------------------------------------------

create policy "subscriptions_select_self" on teacher_subscriptions for select
  using (teacher_id = auth.uid());

create policy "subscriptions_select_admin" on teacher_subscriptions for select
  using (is_admin());

-- ----------------------------------------------------------------------------
-- Course content — published content is world-readable to any authenticated
-- user; only admins may write. Unpublished content is admin-only.
-- ----------------------------------------------------------------------------

create policy "courses_select_published" on courses for select
  using (published or is_admin());

create policy "courses_write_admin" on courses for all
  using (is_admin()) with check (is_admin());

create policy "units_select_published" on units for select
  using (published or is_admin());

create policy "units_write_admin" on units for all
  using (is_admin()) with check (is_admin());

create policy "lessons_select_published" on lessons for select
  using (published or is_admin());

create policy "lessons_write_admin" on lessons for all
  using (is_admin()) with check (is_admin());

create policy "lesson_sections_select" on lesson_sections for select
  using (
    is_admin() or exists (
      select 1 from lessons l where l.id = lesson_id and l.published
    )
  );

create policy "lesson_sections_write_admin" on lesson_sections for all
  using (is_admin()) with check (is_admin());

create policy "vocabulary_terms_select" on vocabulary_terms for select
  using (true);

create policy "vocabulary_terms_write_admin" on vocabulary_terms for all
  using (is_admin()) with check (is_admin());

create policy "syntax_templates_select" on syntax_templates for select
  using (true);

create policy "syntax_templates_write_admin" on syntax_templates for all
  using (is_admin()) with check (is_admin());

create policy "syntax_questions_select" on syntax_questions for select
  using (true);

create policy "syntax_questions_write_admin" on syntax_questions for all
  using (is_admin()) with check (is_admin());

create policy "mcq_questions_select_published" on mcq_questions for select
  using (published or is_admin());

create policy "mcq_questions_write_admin" on mcq_questions for all
  using (is_admin()) with check (is_admin());

create policy "mcq_choices_select" on mcq_choices for select
  using (
    is_admin() or exists (
      select 1 from mcq_questions q where q.id = question_id and q.published
    )
  );

create policy "mcq_choices_write_admin" on mcq_choices for all
  using (is_admin()) with check (is_admin());

create policy "frq_questions_select_published" on frq_questions for select
  using (published or is_admin());

create policy "frq_questions_write_admin" on frq_questions for all
  using (is_admin()) with check (is_admin());

create policy "frq_rubric_items_select" on frq_rubric_items for select
  using (
    is_admin() or exists (
      select 1 from frq_questions f where f.id = frq_id and f.published
    )
  );

create policy "frq_rubric_items_write_admin" on frq_rubric_items for all
  using (is_admin()) with check (is_admin());

create policy "frq_test_cases_select_visible" on frq_test_cases for select
  using (
    is_admin() or (
      not is_hidden and exists (
        select 1 from frq_questions f where f.id = frq_id and f.published
      )
    )
  );

create policy "frq_test_cases_write_admin" on frq_test_cases for all
  using (is_admin()) with check (is_admin());

-- ----------------------------------------------------------------------------
-- Student practice & progress data — visible only to the student who owns
-- it, the teacher of a class that student belongs to (read-only), and admins.
-- ----------------------------------------------------------------------------

create policy "lesson_progress_owner" on student_lesson_progress for all
  using (student_id = auth.uid()) with check (student_id = auth.uid());

create policy "lesson_progress_teacher_read" on student_lesson_progress for select
  using (teaches_student(student_id));

create policy "lesson_progress_admin_read" on student_lesson_progress for select
  using (is_admin());

create policy "syntax_attempts_owner" on student_syntax_attempts for all
  using (student_id = auth.uid()) with check (student_id = auth.uid());

create policy "syntax_attempts_teacher_read" on student_syntax_attempts for select
  using (teaches_student(student_id));

create policy "syntax_attempts_admin_read" on student_syntax_attempts for select
  using (is_admin());

create policy "mcq_attempts_owner" on student_mcq_attempts for all
  using (student_id = auth.uid()) with check (student_id = auth.uid());

create policy "mcq_attempts_teacher_read" on student_mcq_attempts for select
  using (teaches_student(student_id));

create policy "mcq_attempts_admin_read" on student_mcq_attempts for select
  using (is_admin());

create policy "frq_submissions_owner" on student_frq_submissions for all
  using (student_id = auth.uid()) with check (student_id = auth.uid());

create policy "frq_submissions_teacher_read" on student_frq_submissions for select
  using (teaches_student(student_id));

create policy "frq_submissions_teacher_score" on student_frq_submissions for update
  using (teaches_student(student_id));

create policy "frq_submissions_admin_read" on student_frq_submissions for select
  using (is_admin());

create policy "mastery_owner" on student_mastery for all
  using (student_id = auth.uid()) with check (student_id = auth.uid());

create policy "mastery_teacher_read" on student_mastery for select
  using (teaches_student(student_id));

create policy "mastery_admin_read" on student_mastery for select
  using (is_admin());

create policy "bookmarks_owner" on student_bookmarks for all
  using (student_id = auth.uid()) with check (student_id = auth.uid());

create policy "notes_owner" on student_notes for all
  using (student_id = auth.uid()) with check (student_id = auth.uid());

create policy "study_plans_owner" on study_plans for all
  using (student_id = auth.uid()) with check (student_id = auth.uid());

create policy "study_sessions_owner" on study_sessions for all
  using (student_id = auth.uid()) with check (student_id = auth.uid());

-- ----------------------------------------------------------------------------
-- Classes — a teacher manages only their own classes; students see classes
-- they've joined. Creating/editing a class beyond the free-tier demo limit
-- is enforced in the server action layer, which checks is_pro_teacher()
-- before allowing writes beyond one demo class.
-- ----------------------------------------------------------------------------

create policy "classes_select_owner" on classes for select
  using (teacher_id = auth.uid());

create policy "classes_select_member" on classes for select
  using (is_class_member(id));

create policy "classes_select_admin" on classes for select
  using (is_admin());

create policy "classes_insert_teacher" on classes for insert
  with check (teacher_id = auth.uid() and is_teacher());

create policy "classes_update_owner" on classes for update
  using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());

create policy "classes_delete_owner" on classes for delete
  using (teacher_id = auth.uid());

create policy "class_members_select_owner" on class_members for select
  using (owns_class(class_id));

create policy "class_members_select_self" on class_members for select
  using (student_id = auth.uid());

create policy "class_members_insert_self" on class_members for insert
  with check (student_id = auth.uid());

create policy "class_members_update_owner" on class_members for update
  using (owns_class(class_id));

create policy "class_members_delete_owner" on class_members for delete
  using (owns_class(class_id));

create policy "announcements_select_owner" on class_announcements for select
  using (owns_class(class_id));

create policy "announcements_select_member" on class_announcements for select
  using (is_class_member(class_id) and published_at is not null);

create policy "announcements_write_owner" on class_announcements for all
  using (owns_class(class_id)) with check (owns_class(class_id));

-- ----------------------------------------------------------------------------
-- Assignments — owned by the assigning teacher; visible to students in the
-- assigned class once published.
-- ----------------------------------------------------------------------------

create policy "assignments_select_owner" on assignments for select
  using (owns_class(class_id));

create policy "assignments_select_member" on assignments for select
  using (is_class_member(class_id) and published);

create policy "assignments_write_owner" on assignments for all
  using (owns_class(class_id)) with check (owns_class(class_id));

create policy "assignment_items_select_owner" on assignment_items for select
  using (exists (select 1 from assignments a where a.id = assignment_id and owns_class(a.class_id)));

create policy "assignment_items_select_member" on assignment_items for select
  using (
    exists (
      select 1 from assignments a
      where a.id = assignment_id and a.published and is_class_member(a.class_id)
    )
  );

create policy "assignment_items_write_owner" on assignment_items for all
  using (exists (select 1 from assignments a where a.id = assignment_id and owns_class(a.class_id)))
  with check (exists (select 1 from assignments a where a.id = assignment_id and owns_class(a.class_id)));

create policy "submissions_owner_student" on assignment_submissions for all
  using (student_id = auth.uid()) with check (student_id = auth.uid());

create policy "submissions_teacher_read" on assignment_submissions for select
  using (exists (select 1 from assignments a where a.id = assignment_id and owns_class(a.class_id)));

create policy "submissions_teacher_grade" on assignment_submissions for update
  using (exists (select 1 from assignments a where a.id = assignment_id and owns_class(a.class_id)));

create policy "feedback_select_student" on teacher_feedback for select
  using (
    exists (
      select 1 from assignment_submissions s
      where s.id = submission_id and s.student_id = auth.uid()
    )
  );

create policy "feedback_owner_teacher" on teacher_feedback for all
  using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());

-- ----------------------------------------------------------------------------
-- Gamification — badges are public reference data; earned badges are
-- private to the student (and visible to their teacher / admins).
-- ----------------------------------------------------------------------------

create policy "badges_select_all" on badges for select using (true);
create policy "badges_write_admin" on badges for all using (is_admin()) with check (is_admin());

create policy "student_badges_owner" on student_badges for select
  using (student_id = auth.uid());

create policy "student_badges_teacher_read" on student_badges for select
  using (teaches_student(student_id));

create policy "student_badges_admin" on student_badges for select
  using (is_admin());

create policy "student_badges_insert_self" on student_badges for insert
  with check (student_id = auth.uid());

-- ----------------------------------------------------------------------------
-- Reports & audit logs — write-your-own report; read/manage restricted to
-- admins. Audit logs are never client-writable.
-- ----------------------------------------------------------------------------

create policy "reports_insert_self" on reports for insert
  with check (reporter_id = auth.uid());

create policy "reports_select_self" on reports for select
  using (reporter_id = auth.uid());

create policy "reports_admin_all" on reports for all
  using (is_admin()) with check (is_admin());

create policy "audit_logs_admin_read" on audit_logs for select
  using (is_admin());

-- No insert/update/delete policies exist for audit_logs; only the
-- service-role key (which bypasses RLS entirely) may write to it.
