# JavaChip

*Sip. Study. Compile.*

JavaChip is a full-stack AP Computer Science A study platform: detailed lessons, active-recall
syntax drills (Syntax Café), an original MCQ question bank, an eight-stage FRQ Workshop, spaced
repetition, progress tracking, and a teacher-run classroom system (JavaChip Classroom) with a
premium tier (JavaChip Pro) billed through Stripe.

This README covers everything needed to take the codebase from "cloned" to "running against a
real Supabase project and Stripe account."

## Tech stack

Next.js 16 (App Router, Turbopack) · TypeScript · React 19 · Tailwind CSS v4 · Supabase
(Postgres, Auth, RLS) · Stripe · React Hook Form · Zod · Monaco Editor · Recharts · ESLint

## 1. Install and run locally

```bash
npm install
cp .env.example .env.local   # then fill in the values — see section 2
npm run dev
```

The app boots without any environment variables set, but every data-backed page will error the
moment it tries to reach Supabase, so set up section 2 before clicking around.

```bash
npm run lint    # ESLint
npm run build   # production build + typecheck
```

## 2. Environment variables

All variables live in `.env.example`. Copy it to `.env.local` and fill in real values:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same page, "anon public" key |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page, "service_role" key. **Server-only** — never prefix with `NEXT_PUBLIC_`. |
| `STRIPE_SECRET_KEY` | Stripe dashboard → Developers → API keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Same page |
| `STRIPE_WEBHOOK_SECRET` | Stripe dashboard → Developers → Webhooks → your endpoint → Signing secret |
| `STRIPE_PRICE_ID_MONTHLY` / `STRIPE_PRICE_ID_ANNUAL` | Stripe dashboard → Product catalog → JavaChip Pro → each Price's ID |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` locally; your deployed origin in production |
| `JAVA_EXECUTION_SERVICE_URL` / `JAVA_EXECUTION_SERVICE_API_KEY` | Optional — see section 6 |

## 3. Connecting Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Copy the URL and anon/service-role keys into `.env.local` (section 2).
3. Run the migrations, in order, against your project (SQL Editor, or `psql`/the Supabase CLI):

   ```bash
   psql "$DATABASE_URL" -f database/migrations/0001_schema.sql
   psql "$DATABASE_URL" -f database/migrations/0002_rls.sql
   psql "$DATABASE_URL" -f database/migrations/0003_join_class_function.sql
   ```

   - `0001_schema.sql` — every table, enum, index, and the `handle_new_user()` trigger that turns
     a Supabase Auth signup into a `profiles` row.
   - `0002_rls.sql` — Row Level Security policies and helper functions (`is_admin()`,
     `is_pro_teacher()`, `owns_class()`, `teaches_student()`, etc.) for every table.
   - `0003_join_class_function.sql` — a `security definer` RPC students call to join a class by
     code (RLS otherwise correctly blocks browsing another teacher's classes by guessing codes).

4. Seed course content:

   ```bash
   psql "$DATABASE_URL" -f database/seed/seed.sql
   ```

   See `database/seed/README.md` for what's seeded and how to also create demo accounts, a demo
   class, and a demo assignment (those require real `auth.users` rows, which plain SQL can't
   create — see section 4).

### Row Level Security, in one paragraph

Every table with user data has RLS enabled. Students can only read/write their own progress,
notes, bookmarks, and submissions. Teachers can read (never write) data for students enrolled in
their own classes, and can fully manage only classes/assignments they own. Admin-only actions
check a `security definer` `is_admin()` helper. No policy lets a user change their own `role` to
`admin` or edit their own `teacher_subscriptions` row — those are written exclusively by the
Stripe webhook (service-role key), which bypasses RLS entirely and is the only trusted writer.

## 4. Authentication

Auth is Supabase Auth end-to-end, via `@supabase/ssr`:

- `lib/supabase/client.ts` — browser client (anon key).
- `lib/supabase/server.ts` — server client for Server Components/Actions (reads cookies, refreshes
  session where possible).
- `lib/supabase/admin.ts` — service-role client. Marked `server-only`; importing it from a Client
  Component fails the build rather than leaking the key.
- `proxy.ts` (Next.js 16 renamed Middleware to Proxy) — refreshes the session on every request and
  redirects unauthenticated/wrong-role users away from `/student`, `/teacher`, and `/admin`
  *before* any page renders. Every server page also re-checks via `lib/auth/session.ts`
  (`requireUser`/`requireRole`) — never rely on the proxy alone.

Email confirmation, password reset, and email-change links all land on `app/auth/callback/route.ts`,
which exchanges the one-time code for a session and routes by role.

**Creating demo accounts**: sign up through `/sign-up` as both a student and a teacher — the
`handle_new_user()` trigger creates their `profiles`/`user_preferences` rows automatically. To
promote an admin, there is deliberately no UI path:

```sql
update profiles set role = 'admin' where email = 'you@example.com';
```

## 5. Stripe (JavaChip Pro)

1. In Stripe, create a product ("JavaChip Pro") with a monthly and an annual recurring Price.
   Put their IDs in `STRIPE_PRICE_ID_MONTHLY` / `STRIPE_PRICE_ID_ANNUAL`.
2. Add a webhook endpoint pointing at `<your-site>/api/stripe/webhook`, subscribed to at least:
   `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`,
   `customer.subscription.deleted`, `invoice.payment_failed`. Put its signing secret in
   `STRIPE_WEBHOOK_SECRET`.
3. Locally, forward events with the Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.

**How it works**: `actions/billing.ts` creates a Checkout Session (subscribe) or a Billing Portal
Session (manage/cancel) and redirects there — the app never collects card details itself.
`app/api/stripe/webhook/route.ts` verifies the Stripe signature, then upserts `teacher_subscriptions`
using the **service-role** client. That table has no client-writable RLS policy at all — the
webhook is the only path that can ever set a teacher's plan/status.

**How premium status is verified**: `lib/permissions/subscription.ts#isProTeacher()` reads
`teacher_subscriptions.status` from the database (`active`/`trialing` = Pro) inside a server
context. Every classroom action that enforces the free-tier limit (1 class, 3 students, 3
assignments — see `FREE_TEACHER_LIMITS`) calls `assertWithinFreeTierOrPro()` server-side before
the insert. The client never supplies or trusts a plan/status value.

## 6. Java code execution

JavaChip never compiles or runs untrusted Java inside the main app server — see
`lib/code-execution/index.ts`. Today it performs a **simulated structural check** (does the code
contain the expected method name, a `return`, balanced braces?) and clearly labels every result as
simulated, never as a real compile/run. The FRQ Workshop's test-case panel and the syntax editor
both go through this module.

To enable genuine execution, stand up a sandboxed judge service — isolated container per run,
strict CPU/memory/wall-clock limits, no network access, validated input — set
`JAVA_EXECUTION_SERVICE_URL`/`_API_KEY`, and implement the client call in
`runStructuralCheck()` (the integration point is marked with a `throw` today so it fails loudly
instead of silently pretending to execute code).

## 7. What's seeded vs. what needs authoring

`database/seed/seed.sql` (generated by `node scripts/generate-seed.ts` from `lib/content/**` —
regenerate after editing content there, don't hand-edit the SQL) seeds:

- The AP CSA course and all 10 units
- **One** fully-authored, 26-section lesson: *Integer Division and Modulus* (the other lessons
  listed in each unit's course map exist as unpublished stub rows — the content pipeline is ready,
  the prose isn't written yet)
- 7 Java Reference Library entries
- 33 original Syntax Café drills across 9 drill types
- 20 original MCQs, each with a full explanation for every choice
- 3 original FRQs with rubrics and test cases (one — *SnowfallTracker* — has the full eight-stage
  guided workshop wired up end to end)
- 12 badge definitions

Demo accounts, a demo class, and a demo assignment are **not** in `seed.sql` (they need real
`auth.users` rows) — see `database/seed/README.md`.

## 8. Pages scaffolded but not yet built out

These routes exist (nav links work, layouts/auth guards are in place) but render a "coming soon"
empty state rather than real functionality: Study Planner, Progress report, teacher Analytics
dashboard, teacher Custom Question Bank. The admin dashboard (`/admin/*`) has RLS and an
`is_admin()` helper ready server-side but no UI yet. Student onboarding and teacher onboarding
wizards (multi-step preference collection before first dashboard visit) aren't built — signup goes
straight to the dashboard.

## 9. Deployment

Any Next.js host works (Vercel is the path of least resistance). In short:

1. Set every variable from section 2 in your host's environment/secrets config.
2. Point `NEXT_PUBLIC_SITE_URL` at your real deployed origin (Stripe redirect URLs and Supabase
   email-confirmation links are built from it).
3. Run the Supabase migrations + seed against your **production** Supabase project (section 3).
4. Point your Stripe webhook endpoint at `https://<your-domain>/api/stripe/webhook`.
5. Deploy. `npm run build` must pass — it runs a full TypeScript check as part of the build.

## Project structure

```
app/            Route groups: (public), (auth), student, teacher, admin, api
actions/        Server Actions (auth, billing, classroom, practice, frq, progress, preferences)
components/     ui, layout, navigation, course, lessons, syntax, mcq, frq, classroom,
                billing, forms, marketing
lib/            supabase, stripe, auth, permissions, validation, spaced-repetition,
                code-execution, content (seed-source data), data (dashboard queries), utilities
types/          Hand-maintained Database type (see the note at the top of types/database.ts —
                Row types MUST be `type` aliases, not `interface`s; see below)
database/       migrations/ (schema, RLS, functions), seed/ (generated SQL + accounts guide)
scripts/        generate-seed.ts — regenerates database/seed/seed.sql from lib/content/**
```

## A TypeScript/Supabase gotcha worth knowing

With the installed `@supabase/postgrest-js` (2.110.8), declaring a Supabase `Row` type as an
`interface` — even one with zero relation to any other type — makes postgrest-js's generic
`GetResult<...>` constraint check silently fail, and **every** `.select()` on that table
(including `.select("*")`) resolves to `never` instead of erroring. Declaring the same shape as a
`type` alias works correctly. Every Row type in `types/database.ts` is therefore a `type`, not an
`interface` — keep it that way when the schema changes, or queries will silently lose their types
without a build error pointing at the real cause.

## License / content policy

All lessons, syntax drills, MCQs, FRQs, rubrics, and explanations in this repository are original
content written for JavaChip. None reproduce College Board exam questions verbatim. Automated FRQ
scoring is explicitly labeled as an estimate throughout the app and is never presented as official
College Board scoring.
