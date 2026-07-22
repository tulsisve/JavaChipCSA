import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold text-foreground">Privacy Policy</h1>
      <p className="mt-3 text-sm text-foreground-muted">Last updated: this is a template — replace with your reviewed legal copy before launch.</p>
      <div className="mt-8 flex flex-col gap-6 text-foreground-muted">
        <Section title="What we collect">
          Account information (name, email, role), study activity (lesson progress, drill and
          question attempts, FRQ submissions), classroom membership, and optional profile details
          (school name, graduation year, bio, avatar).
        </Section>
        <Section title="What we don't do">
          We never sell student data. We never display individual student grades or rosters
          publicly. Teachers can only see students who have joined one of their own classes.
        </Section>
        <Section title="Your controls">
          You can update or delete your profile, export your notes, and permanently delete your
          account and all associated data from Settings at any time.
        </Section>
        <Section title="Data storage">
          Data is stored in Supabase (PostgreSQL) with Row Level Security enforced on every table
          containing personal or academic data. Payment data is handled directly by Stripe —
          JavaChip never stores raw card numbers.
        </Section>
        <Section title="Children's privacy">
          JavaChip is designed for high-school-aged AP students. Where required, accounts for
          students under the applicable age of consent should be created and managed through a
          teacher-administered classroom rather than self-registration.
        </Section>
        <Section title="Contact">
          Questions about this policy can be sent through the Contact page.
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
