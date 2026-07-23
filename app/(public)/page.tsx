import Link from "next/link";
import { Check, Pin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { RainBackdrop } from "@/components/layout/RainBackdrop";
import { BokehLights } from "@/components/layout/BokehLights";
import { CafeWindow } from "@/components/layout/CafeWindow";
import { WindowsillPlant } from "@/components/layout/WindowsillPlant";
import { SteamCup } from "@/components/layout/SteamCup";
import { PixelWordmark } from "@/components/layout/PixelWordmark";
import { PixelSparkle } from "@/components/layout/PixelSparkle";
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

const MENU_ITEMS = [
  {
    n: "01",
    title: "Syntax Café",
    description: "Active-recall drills that build Java syntax into muscle memory — type from memory, fill in the blank, and speed rounds.",
    href: "/features#syntax-cafe",
    text: "text-amber",
    bg: "bg-amber/10",
  },
  {
    n: "02",
    title: "Question Bank",
    description: "Original AP-style MCQs with an explanation for every answer choice, not just the correct one.",
    href: "/features#mcq",
    text: "text-sage-bright",
    bg: "bg-sage/10",
  },
  {
    n: "03",
    title: "FRQ Workshop",
    description: "An eight-stage breakdown of every free-response question, from reading the prompt to rubric self-review.",
    href: "/features#frq",
    text: "text-burgundy-bright",
    bg: "bg-burgundy/10",
  },
  {
    n: "04",
    title: "JavaChip Classroom",
    description: "Teachers assign lessons, drills, and FRQs, then track mastery and common errors across the whole class.",
    href: "/features#teachers",
    text: "text-slate-bright",
    bg: "bg-storm-blue/10",
  },
] as const;

const UNIT_ACCENTS = [
  { text: "text-amber", tab: "bg-amber" },
  { text: "text-sage-bright", tab: "bg-sage-bright" },
  { text: "text-burgundy-bright", tab: "bg-burgundy-bright" },
  { text: "text-slate-bright", tab: "bg-slate-bright" },
  { text: "text-gold", tab: "bg-gold" },
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
      {/* Hero, part one — the logo gets its own billboard moment */}
      <section className="relative overflow-hidden bg-espresso">
        <div className="lamp-glow absolute inset-0" />
        <BokehLights />
        <RainBackdrop withPuddleGlow={false} />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 pb-6 pt-20 text-center sm:pt-24">
          <PixelWordmark size="xl" sparkles className="justify-center" />
          <p className="mt-8 font-serif-soft text-xl italic text-gold sm:text-2xl">
            Sip. Study. Compile.
          </p>
        </div>
      </section>

      {/* Hero, part two — the headline moves here, alongside the window */}
      <section className="relative overflow-hidden bg-espresso">
        <RainBackdrop withPuddleGlow={false} />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-6 sm:px-6 sm:pb-28 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-8 lg:px-8">
          <div>
            <h1 className="text-balance font-display text-4xl font-semibold leading-[1.08] text-warm-cream sm:text-5xl">
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
            <PixelSparkle size={20} className="absolute -top-6 right-10 hidden sm:block" delay="0.3s" />
            <CafeWindow className="w-full" />
            <WindowsillPlant className="absolute -bottom-6 -left-4 hidden sm:block" />

            {/* A small pinned index card with the concrete product demo —
                tucked over the window like a note stuck to the frame. */}
            <div className="absolute -bottom-8 right-2 hidden w-56 rotate-[3deg] rounded-md border border-latte/15 bg-dark-roast p-3.5 shadow-2xl shadow-black/50 sm:block">
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
      <section className="border-y border-storm-blue/30 bg-rainy-slate/90 py-5">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 sm:px-6 lg:px-8">
          <TicketItem dot="bg-amber" text="Built on the full AP CSA course description" />
          <TicketItem dot="bg-sage-bright" text="100% original questions and FRQs" />
          <TicketItem dot="bg-burgundy-bright" text="No shortcuts, just genuine mastery" />
        </div>
      </section>

      {/* Feature menu — a chalkboard-style numbered list, not a repeated icon-card grid */}
      <section className="bg-walnut py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="relative inline-flex items-center gap-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            <PixelSparkle size={20} delay="0.4s" />
            What&apos;s on the menu
          </h2>
          <p className="mt-3 max-w-xl text-foreground-muted">
            Four connected study modes, each built to grow a different kind of fluency.
          </p>

          <ul className="mt-12 flex flex-col divide-y divide-latte/10">
            {MENU_ITEMS.map((item) => (
              <li key={item.n}>
                <Link
                  href={item.href}
                  className="group flex items-start gap-6 py-6 transition-colors hover:bg-warm-cream/[0.03] sm:items-center"
                >
                  <span className={`font-display text-3xl font-semibold ${item.text}`}>
                    {item.n}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-semibold text-foreground group-hover:underline">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-foreground-muted">{item.description}</p>
                  </div>
                  <span className={`hidden h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${item.bg} ${item.text} sm:flex`}>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="relative overflow-hidden bg-storm-blue/95 py-24">
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

          <div className="relative rounded-xl border border-warm-cream/10 bg-espresso/70 p-6 shadow-2xl shadow-black/40 backdrop-blur-sm">
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
          </div>
        </div>
      </section>

      {/* Course map — a book index, not a card grid */}
      <section className="bg-espresso py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
            The full AP CSA course map
          </h2>
          <p className="mt-3 text-foreground-muted">
            Ten units, each with lessons, a syntax reference sheet, MCQs, FRQs, and a mastery quiz.
          </p>

          <ol className="mt-10 flex flex-col divide-y divide-latte/10 border-y border-latte/10">
            {units.map((unit, i) => {
              const accent = UNIT_ACCENTS[i % UNIT_ACCENTS.length];
              return (
                <li key={unit.slug} className="relative">
                  <Link
                    href={`/student/units/${unit.slug}`}
                    className="group flex items-baseline gap-5 py-5 pl-4"
                  >
                    <span className={`absolute inset-y-0 left-0 w-1 scale-y-0 rounded-full ${accent.tab} transition-transform duration-200 group-hover:scale-y-100`} />
                    <span className={`font-display text-sm ${accent.text}`}>{String(unit.unitNumber).padStart(2, "0")}</span>
                    <span className="flex-1">
                      <span className="font-display text-lg font-medium text-foreground group-hover:text-warm-cream">
                        {unit.title}
                      </span>
                      <span className="mt-0.5 block text-sm text-foreground-muted">{unit.description}</span>
                    </span>
                    <span className="hidden whitespace-nowrap text-xs text-foreground-muted sm:block">
                      ~{unit.estimatedMinutes} min
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="border-y border-storm-blue/30 bg-rainy-slate py-24">
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
              <div key={i} className={`relative ${note.rotate} rounded-sm ${note.bg} p-6 pt-8 shadow-xl shadow-black/30`}>
                <span className="absolute left-1/2 top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-burgundy shadow" />
                <p className="font-serif-soft text-base italic text-espresso">{note.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-storm-blue/95 py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-3xl font-semibold text-warm-cream sm:text-4xl">
            Frequently asked questions
          </h2>
          <div className="mt-10">
            <FaqAccordion items={faqItems} />
          </div>
        </div>
      </section>

      {/* Final CTA — bookended with the window again, smaller */}
      <section className="relative overflow-hidden bg-espresso py-24">
        <div className="relative mx-auto grid max-w-5xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
          <div>
            <h2 className="relative inline-flex items-center gap-3 font-display text-3xl font-semibold text-warm-cream sm:text-4xl">
              <PixelSparkle size={20} delay="0.9s" />
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
    <div className="rounded-md bg-warm-cream/5 p-3">
      <div className="text-xs text-parchment/60">{label}</div>
      <div className={`mt-1 font-display text-sm font-semibold ${accent}`}>{value}</div>
    </div>
  );
}
