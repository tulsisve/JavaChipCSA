import Link from "next/link";
import { Check, Pin, Coffee, BookOpen, PenLine, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { RainBackdrop } from "@/components/layout/RainBackdrop";
import { BokehLights } from "@/components/layout/BokehLights";
import { CafeWindow } from "@/components/layout/CafeWindow";
import { WindowsillPlant } from "@/components/layout/WindowsillPlant";
import { SteamCup } from "@/components/layout/SteamCup";
import { PixelHotCup, PixelFrappe } from "@/components/layout/PixelDrinks";
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

const FEATURES = [
  {
    icon: Coffee,
    title: "Syntax Café",
    description: "Quick active-recall drills that build Java syntax into muscle memory.",
    href: "/features#syntax-cafe",
    tint: "bg-amber/12 text-amber",
  },
  {
    icon: BookOpen,
    title: "Question Bank",
    description: "Original AP-style MCQs with an explanation for every answer choice.",
    href: "/features#mcq",
    tint: "bg-sage/15 text-sage-bright",
  },
  {
    icon: PenLine,
    title: "FRQ Workshop",
    description: "An eight-stage breakdown of every free-response question.",
    href: "/features#frq",
    tint: "bg-burgundy/15 text-burgundy-bright",
  },
  {
    icon: Users,
    title: "JavaChip Classroom",
    description: "Teachers assign work and track mastery across the whole class.",
    href: "/features#teachers",
    tint: "bg-gold/15 text-gold",
  },
] as const;

const UNIT_TINTS = [
  "bg-amber/10 text-amber",
  "bg-sage/12 text-sage-bright",
  "bg-burgundy/12 text-burgundy-bright",
  "bg-gold/12 text-gold",
] as const;

const NOTES = [
  {
    rotate: "-rotate-2",
    bg: "bg-warm-cream",
    text: "Student stories will appear here once JavaChip classrooms go live.",
  },
  {
    rotate: "rotate-1",
    bg: "bg-latte",
    text: "Real feedback from real classrooms — pinned right here, soon.",
  },
  {
    rotate: "-rotate-1",
    bg: "bg-parchment",
    text: "Teaching with JavaChip Pro? Your class's story could go here.",
  },
] as const;

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-espresso">
        <div className="lamp-glow absolute inset-0" />
        <BokehLights />
        <RainBackdrop withPuddleGlow={false} />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-8 lg:px-8">
          <div>
            <p className="font-serif-soft text-lg italic text-gold">Sip. Study. Compile.</p>
            <h1 className="mt-3 text-balance font-display text-5xl font-semibold leading-[1.05] text-warm-cream sm:text-6xl">
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

            <div className="mt-10 flex items-center gap-4 border-t border-latte/15 pt-6">
              <SteamCup size={34} />
              <p className="font-serif-soft text-base italic text-latte/70">
                Settle in, open your editor, and build your confidence one line at a time.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-3 -top-8 hidden rotate-[-6deg] sm:block">
              <PixelFrappe pixelSize={6} />
            </div>
            <div className="absolute -bottom-9 -right-1 hidden rotate-[5deg] sm:block">
              <PixelHotCup pixelSize={6} />
            </div>
            <CafeWindow className="w-full" />
            <WindowsillPlant className="absolute -bottom-6 -left-4 hidden sm:block" />

            {/* A small pinned index card with the concrete product demo —
                tucked over the window like a note stuck to the frame. */}
            <div className="absolute -bottom-8 right-2 hidden w-56 rotate-[3deg] rounded-2xl border border-latte/15 bg-dark-roast p-3.5 shadow-2xl shadow-black/50 sm:block">
              <Pin className="absolute -top-2.5 left-1/2 h-4 w-4 -translate-x-1/2 -rotate-12 text-burgundy-bright" />
              <p className="font-mono text-[11px] text-latte/70">TimeConverter.java</p>
              <pre className="mt-1.5 overflow-hidden font-mono text-[10px] leading-relaxed text-parchment">
{`int h = total / 60;
int m = total % 60;`}
              </pre>
              <p className="mt-1.5 flex items-center gap-1 font-mono text-[10px] text-sage-bright">
                <Check className="h-2.5 w-2.5" /> 2h 35m
              </p>
            </div>
          </div>
        </div>
        <div className="wood-surface absolute inset-x-0 bottom-0 h-3 bg-cafe-wood/70" aria-hidden="true" />
      </section>

      {/* Ticket strip — three short, differently-colored claims instead of one centered sentence */}
      <section className="border-y border-latte/15 bg-cafe-wood py-5">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 sm:px-6 lg:px-8">
          <TicketItem dot="bg-amber" text="Built on the full AP CSA course description" />
          <TicketItem dot="bg-sage-bright" text="100% original questions and FRQs" />
          <TicketItem dot="bg-burgundy-bright" text="No shortcuts, just genuine mastery" />
        </div>
      </section>

      {/* Feature cards — simple, scannable, a little playful */}
      <section className="bg-walnut py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
              Everything you need to study
            </h2>
            <p className="mt-3 text-foreground-muted">
              Four connected study modes, each built to grow a different kind of fluency.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <Link key={f.title} href={f.href}>
                <Card className="flex h-full items-start gap-4 p-6 transition-transform hover:-translate-y-1 hover:rotate-[-0.5deg] motion-reduce:hover:translate-y-0 motion-reduce:hover:rotate-0">
                  <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl ${f.tint}`}>
                    <f.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-display text-lg font-semibold text-foreground">{f.title}</span>
                    <span className="mt-1 block text-sm text-foreground-muted">{f.description}</span>
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="relative overflow-hidden bg-dark-roast py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="flex flex-col justify-center">
            <p className="font-serif-soft text-lg italic text-gold">Student Dashboard</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-warm-cream">
              A study desk that remembers where you left off
            </h2>
            <p className="mt-4 text-parchment/80">
              Today&apos;s Brew recommends your next best session. Your streak, unit mastery, and
              weakest topics stay visible without ever feeling like a scoreboard.
            </p>
            <Button href="/sign-up" className="mt-6 w-fit">Build your dashboard</Button>
          </div>

          <Card className="relative overflow-hidden border-warm-cream/10 bg-espresso/70 p-6 backdrop-blur-sm">
            <div className="light-sweep" />
            <div className="relative flex items-center gap-2 text-amber">
              <SteamCup size={20} />
              <span className="text-xs font-medium uppercase tracking-wide">Today&apos;s Brew</span>
            </div>
            <p className="relative mt-2 font-display text-lg text-warm-cream">
              Continue Unit 4 — Iteration, then a Quick Sip of Syntax Café.
            </p>
            <div className="relative mt-5 grid grid-cols-3 gap-3 text-center">
              <MiniStat label="Streak" value="12 days" accent="text-amber" />
              <MiniStat label="Unit mastery" value="Unit 4 · 68%" accent="text-sage-bright" />
              <MiniStat label="Due for review" value="7 items" accent="text-burgundy-bright" />
            </div>
          </Card>
        </div>
      </section>

      {/* Course map — a simple, colorful card grid */}
      <section className="bg-espresso py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
              The full AP CSA course map
            </h2>
            <p className="mt-3 text-foreground-muted">
              Ten units, each with lessons, a syntax reference sheet, MCQs, FRQs, and a mastery quiz.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {units.map((unit, i) => (
              <Link key={unit.slug} href={`/student/units/${unit.slug}`}>
                <Card className="h-full p-5 transition-transform hover:-translate-y-1 motion-reduce:hover:translate-y-0">
                  <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${UNIT_TINTS[i % UNIT_TINTS.length]}`}>
                    {unit.unitNumber}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-foreground">{unit.title}</h3>
                  <p className="mt-1.5 text-sm text-foreground-muted">{unit.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="border-y border-latte/15 bg-cafe-wood py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <SteamCup size={36} className="mx-auto mb-4" />
          <h2 className="font-display text-3xl font-semibold text-warm-cream sm:text-4xl">
            Free to explore. Simple to grow into.
          </h2>
          <p className="mt-4 text-parchment/75">
            Every teacher starts with a free demo classroom. JavaChip Pro unlocks unlimited
            classes, the full assignment builder, gradebook, and class analytics.
          </p>
          <Button href="/pricing" className="mt-8">See JavaChip Pro pricing</Button>
        </div>
      </section>

      {/* Student stories — pinned notes instead of empty cards */}
      <section className="bg-walnut py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Student stories
          </h2>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {NOTES.map((note, i) => (
              <div key={i} className={`relative ${note.rotate} rounded-xl ${note.bg} p-6 pt-8 shadow-xl shadow-black/30`}>
                <span className="absolute left-1/2 top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-burgundy shadow" />
                <p className="font-serif-soft text-base italic text-espresso">{note.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-dark-roast py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-3xl font-semibold text-warm-cream sm:text-4xl">
            Frequently asked questions
          </h2>
          <div className="mt-10">
            <FaqAccordion items={faqItems} />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-espresso py-24">
        <BokehLights />
        <div className="relative mx-auto grid max-w-5xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
          <div>
            <h2 className="font-display text-3xl font-semibold text-warm-cream sm:text-4xl">
              Your study desk is waiting.
            </h2>
            <p className="mt-4 text-latte">
              Create a free account and start your first Quick Sip in under two minutes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/sign-up" size="lg">Start Studying</Button>
              <Button href="/sign-up?role=teacher" variant="secondary" size="lg">
                Teach with JavaChip
              </Button>
            </div>
          </div>
          <CafeWindow className="hidden lg:block" />
        </div>
      </section>
    </>
  );
}

function TicketItem({ dot, text }: { dot: string; text: string }) {
  return (
    <span className="flex items-center gap-2 text-sm text-parchment">
      <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${dot}`} />
      {text}
    </span>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-xl bg-warm-cream/5 p-3">
      <div className="text-xs text-parchment/60">{label}</div>
      <div className={`mt-1 font-display text-sm font-semibold ${accent}`}>{value}</div>
    </div>
  );
}
