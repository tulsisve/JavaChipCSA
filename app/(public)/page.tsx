import Link from "next/link";
import { Coffee, BookOpen, Code2, PenLine, Users, LayoutDashboard, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RainBackdrop } from "@/components/layout/RainBackdrop";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { units } from "@/lib/content/units";

const faqItems = [
  {
    question: "Is JavaChip affiliated with the College Board?",
    answer:
      "No. JavaChip is an independent study platform built around the official AP Computer Science A course description. All questions, FRQs, and explanations are original — we never reproduce copyrighted College Board exam questions.",
  },
  {
    question: "Is JavaChip free for students?",
    answer:
      "Yes. Every student account is free: full access to lessons, Syntax Café drills, the MCQ Question Bank, the FRQ Workshop, progress tracking, and spaced repetition.",
  },
  {
    question: "What does a free teacher account include?",
    answer:
      "Teachers can explore the entire course as a learner, preview the classroom and analytics tools, and create one demo class with up to three students to try the assignment builder before upgrading.",
  },
  {
    question: "Does JavaChip run my Java code for real?",
    answer:
      "JavaChip never executes untrusted code inside its main application server. Production deployments connect an isolated, sandboxed execution service for real compilation; without one configured, the editor falls back to simulated test-case checking so practice still works.",
  },
  {
    question: "How accurate is automated FRQ scoring?",
    answer:
      "Automated FRQ scoring is an estimate based on structural and test-case checks — it is not, and does not claim to be, official College Board scoring. Teachers can always review and override any automated score.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-espresso">
        <div className="lamp-glow absolute inset-0" />
        <RainBackdrop />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <Badge variant="amber" className="mb-6">Sip. Study. Compile.</Badge>
              <h1 className="font-display text-5xl font-semibold leading-[1.05] text-warm-cream sm:text-6xl">
                Java finally clicks.
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-latte">
                Master AP Computer Science A through detailed lessons, syntax drills, original
                exam-style MCQs, guided FRQ breakdowns, and personalized review.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button href="/sign-up" size="lg">Start Studying</Button>
                <Button href="/features" variant="secondary" size="lg">Explore JavaChip</Button>
              </div>
              <div className="mt-4">
                <Button href="/sign-up?role=teacher" variant="link" size="sm">
                  Teach with JavaChip →
                </Button>
              </div>
              <p className="mt-8 text-sm text-latte/70">
                Settle in, open your editor, and build your confidence one line at a time.
              </p>
            </div>

            <div className="relative hidden lg:block">
              <div className="rounded-xl border border-latte/20 bg-dark-roast/80 p-5 shadow-2xl shadow-black/40 backdrop-blur">
                <div className="flex items-center gap-1.5 pb-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-burgundy/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gold/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-sage/70" />
                  <span className="ml-3 text-xs text-latte/60">TimeConverter.java</span>
                </div>
                <pre className="overflow-x-auto rounded-md bg-surface-code p-4 font-mono text-[13px] leading-relaxed text-parchment">
{`public class TimeConverter {
    public static void main(String[] args) {
        int totalMinutes = 155;

        int hours = totalMinutes / 60;
        int minutesLeft = totalMinutes % 60;

        System.out.println(
            hours + " hours and " + minutesLeft + " minutes"
        );
    }
}`}
                </pre>
                <div className="mt-3 flex items-center gap-2 text-xs text-sage">
                  <Check className="h-3.5 w-3.5" /> 2 hours and 35 minutes
                </div>
              </div>
              <div className="absolute -right-6 -top-6 flex items-center gap-2 rounded-full border border-latte/20 bg-dark-roast/90 px-4 py-2 text-xs text-latte shadow-lg">
                <Coffee className="h-3.5 w-3.5 text-amber" /> Deep Brew session — 41:12 remaining
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted-learning message */}
      <section className="border-y border-border bg-background-raised py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-foreground-muted">
            Built around the full official AP Computer Science A course description ·
            100% original questions and FRQs · No shortcuts, just genuine mastery
          </p>
        </div>
      </section>

      {/* Feature previews */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Everything AP CSA, in one calm place
          </h2>
          <p className="mt-4 text-foreground-muted">
            Four connected study modes, each designed to build a different kind of fluency.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <PreviewCard
            icon={<Code2 className="h-5 w-5" />}
            title="Syntax Café"
            description="Active-recall drills that build Java syntax into muscle memory — type from memory, fill in the blank, and speed rounds."
            href="/features#syntax-cafe"
          />
          <PreviewCard
            icon={<BookOpen className="h-5 w-5" />}
            title="Question Bank"
            description="Original AP-style MCQs with an explanation for every choice, not just the correct one."
            href="/features#mcq"
          />
          <PreviewCard
            icon={<PenLine className="h-5 w-5" />}
            title="FRQ Workshop"
            description="An eight-stage breakdown of every free-response question, from reading the prompt to rubric self-review."
            href="/features#frq"
          />
          <PreviewCard
            icon={<Users className="h-5 w-5" />}
            title="JavaChip Classroom"
            description="Teachers assign lessons, drills, and FRQs, then track mastery and common errors across the whole class."
            href="/features#teachers"
          />
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="bg-background-raised py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="flex flex-col justify-center">
            <Badge variant="gold" className="mb-4 w-fit">Student Dashboard</Badge>
            <h2 className="font-display text-3xl font-semibold text-foreground">
              A study desk that remembers where you left off
            </h2>
            <p className="mt-4 text-foreground-muted">
              Today&apos;s Brew recommends your next best session. Your streak, unit mastery, and
              weakest topics stay visible without ever feeling like a scoreboard.
            </p>
            <Button href="/sign-up" className="mt-6 w-fit">Build your dashboard</Button>
          </div>
          <Card className="p-6">
            <div className="flex items-center gap-2 text-amber">
              <LayoutDashboard className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Today&apos;s Brew</span>
            </div>
            <p className="mt-2 font-display text-lg text-foreground">
              Continue Unit 4 — Iteration, then a Quick Sip of Syntax Café.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <MiniStat label="Streak" value="12 days" />
              <MiniStat label="Unit mastery" value="Unit 4 · 68%" />
              <MiniStat label="Due for review" value="7 items" />
            </div>
          </Card>
        </div>
      </section>

      {/* Course map */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
            The full AP CSA course map
          </h2>
          <p className="mt-4 text-foreground-muted">
            Ten units, each with lessons, a syntax reference sheet, MCQs, FRQs, and a mastery quiz.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {units.map((unit) => (
            <Link
              key={unit.slug}
              href={`/student/units/${unit.slug}`}
              className="group rounded-lg border border-border bg-background-card p-5 transition-colors hover:border-amber/50"
            >
              <span className="font-mono text-xs text-amber">Unit {unit.unitNumber}</span>
              <h3 className="mt-1 font-display text-lg font-semibold text-foreground group-hover:text-amber">
                {unit.title}
              </h3>
              <p className="mt-2 text-sm text-foreground-muted">{unit.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="border-y border-border bg-background-raised py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Badge variant="amber" className="mb-4">JavaChip Pro</Badge>
          <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Free to explore. Simple to grow into.
          </h2>
          <p className="mt-4 text-foreground-muted">
            Every teacher starts with a free demo classroom. JavaChip Pro unlocks unlimited
            classes, the full assignment builder, gradebook, and class analytics.
          </p>
          <Button href="/pricing" className="mt-8">See JavaChip Pro pricing</Button>
        </div>
      </section>

      {/* Testimonials placeholder */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-semibold text-foreground sm:text-4xl">
          Student stories
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex h-40 items-center justify-center p-6 text-center">
              <p className="text-sm text-foreground-muted">
                Student stories will appear here as JavaChip classrooms go live.
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-background-raised py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
          <div className="mt-10">
            <FaqAccordion items={faqItems} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-espresso py-24">
        <div className="lamp-glow absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold text-warm-cream sm:text-4xl">
            Your study desk is waiting.
          </h2>
          <p className="mt-4 text-latte">
            Create a free account and start your first Quick Sip in under two minutes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/sign-up" size="lg">Start Studying</Button>
            <Button href="/sign-up?role=teacher" variant="secondary" size="lg">
              Teach with JavaChip
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function PreviewCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} className="block">
      <Card className="h-full p-6 transition-transform hover:-translate-y-0.5 motion-reduce:hover:translate-y-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-amber/15 text-amber">
          {icon}
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-sm text-foreground-muted">{description}</p>
      </Card>
    </Link>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-background-raised p-3">
      <div className="text-xs text-foreground-muted">{label}</div>
      <div className="mt-1 font-display text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}
