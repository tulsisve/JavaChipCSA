import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold text-foreground">Terms of Service</h1>
      <p className="mt-3 text-sm text-foreground-muted">Last updated: this is a template — replace with your reviewed legal copy before launch.</p>
      <div className="mt-8 flex flex-col gap-6 text-foreground-muted">
        <Section title="Accounts">
          You must provide accurate information when creating an account and are responsible for
          activity under your credentials. Admin roles are never self-assignable and are granted
          only by JavaChip operators.
        </Section>
        <Section title="Content ownership">
          Lessons, questions, FRQs, and rubrics on JavaChip are original works. You may use them
          for personal study or, if you're a teacher, within your own classroom — not for
          redistribution or resale.
        </Section>
        <Section title="Automated scoring">
          Automated FRQ scoring is an estimate intended to support learning. It is not official
          College Board scoring and should not be treated as a prediction of an actual AP Exam
          score.
        </Section>
        <Section title="Subscriptions">
          JavaChip Pro is billed monthly or annually through Stripe. You can cancel at any time;
          access continues through the end of the paid period. Fees are non-refundable except
          where required by law.
        </Section>
        <Section title="Termination">
          We may suspend accounts that violate these terms, misuse the platform, or attempt to
          circumvent security controls. You may delete your account at any time from Settings.
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed">{children}</p>
    </div>
  );
}
