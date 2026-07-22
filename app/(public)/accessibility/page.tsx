import type { Metadata } from "next";

export const metadata: Metadata = { title: "Accessibility Statement" };

export default function AccessibilityPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold text-foreground">Accessibility Statement</h1>
      <div className="mt-8 flex flex-col gap-6 text-foreground-muted">
        <p>
          JavaChip is built to meet WCAG 2.1 AA guidelines. This is an ongoing commitment, not a
          one-time checklist — if you encounter a barrier, please tell us through the Contact page.
        </p>
        <Section title="What we support today">
          Full keyboard navigation, visible focus states, semantic headings and landmarks,
          screen-reader labels on interactive controls, adjustable text size, a high-contrast mode,
          and a reduced-motion mode that disables ambient rain and decorative transitions.
        </Section>
        <Section title="Color and status">
          No information is conveyed by color alone — mastery levels, correctness, and status
          indicators always pair color with text or an icon.
        </Section>
        <Section title="The code editor">
          The embedded Java editor includes labeled controls, adjustable font size, and keyboard
          shortcuts. We recommend pairing it with your screen reader&apos;s code-reading mode for the
          clearest experience.
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
