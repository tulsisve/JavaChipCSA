import type { Metadata } from "next";

export const metadata: Metadata = { title: "About", description: "Why JavaChip exists." };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold text-foreground">About JavaChip</h1>
      <div className="prose-none mt-6 flex flex-col gap-5 text-foreground-muted">
        <p>
          JavaChip is a study platform built for one course: AP Computer Science A. The name comes
          from two places at once — the Java language, and the quiet, focused ritual of a warm
          drink and an open notebook. That&apos;s the atmosphere we designed around: a calm place
          to actually understand why your code works, not just get an answer and move on.
        </p>
        <p>
          Every lesson, syntax drill, MCQ, and FRQ on JavaChip is original — written specifically
          for this platform, aligned to the official College Board course description, and never a
          reproduction of copyrighted exam material.
        </p>
        <p>
          JavaChip is independently built and is not affiliated with, endorsed by, or sponsored by
          the College Board or the AP Program.
        </p>
      </div>
    </div>
  );
}
