# Seeding JavaChip

## 1. Course content (no auth required)

```bash
psql "$DATABASE_URL" -f database/migrations/0001_schema.sql
psql "$DATABASE_URL" -f database/migrations/0002_rls.sql
psql "$DATABASE_URL" -f database/seed/seed.sql
```

`seed.sql` is generated from the typed content in `lib/content/**` — it is
the single source of truth for course copy. After editing a file in
`lib/content/`, regenerate it rather than hand-editing the SQL:

```bash
node scripts/generate-seed.ts
```

This seeds: the AP CSA course, all 10 units, one fully-authored lesson
(*Integer Division and Modulus*, all 26 sections) plus stub rows for the
rest of the course map, 7 Java Reference Library entries, 33 Syntax Café
drills, 20 original MCQs with fully-explained choices, 3 original FRQs with
rubrics and test cases, and 12 badges.

## 2. Demo accounts (require Supabase Auth)

`auth.users` can't be seeded with plain SQL — Supabase manages password
hashing and email verification. Create the three demo accounts through the
app itself (recommended) or via the Supabase Admin API:

1. Sign up at `/sign-up` as a **teacher** (e.g. `demo.teacher@javachip.app`)
   and as a **student** (`demo.student@javachip.app`). The `handle_new_user`
   trigger in `0001_schema.sql` automatically creates matching `profiles`
   and `user_preferences` rows.
2. Promote an admin manually — there is no UI path to the admin role by
   design:
   ```sql
   update profiles set role = 'admin' where email = 'you@example.com';
   ```

## 3. Demo classroom + assignment

Once the demo teacher and student accounts exist, get their `profiles.id`
values and run:

```sql
-- Replace the two UUIDs below.
with demo_class as (
  insert into classes (teacher_id, name, course_name, period, school_year, description, join_code)
  values ('<teacher-profile-id>', 'Period 3 — AP CSA', 'AP Computer Science A', '3', '2025-2026',
          'Demo classroom seeded for JavaChip development.', 'DEMO-' || substr(md5(random()::text), 1, 6))
  returning id
)
insert into class_members (class_id, student_id)
select id, '<student-profile-id>' from demo_class;

with demo_assignment as (
  insert into assignments (class_id, teacher_id, title, instructions, due_at, attempt_limit, allow_late, published)
  select id, '<teacher-profile-id>', 'Unit 1 Checkpoint: Primitive Types',
         'Complete the Integer Division and Modulus lesson and its MCQ mini-set.',
         now() + interval '7 days', 2, true, true
  from classes where teacher_id = '<teacher-profile-id>' limit 1
  returning id
)
insert into assignment_items (assignment_id, content_type, content_id, sort_order, points)
select id, 'lesson', (select id from lessons where slug = 'integer-division-and-modulus'), 0, 10
from demo_assignment;
```

The app also creates a demo class + starter assignment automatically the
first time a **free-tier teacher** completes onboarding (`actions/classroom.ts`),
so manual seeding here is only needed for local development fixtures.
