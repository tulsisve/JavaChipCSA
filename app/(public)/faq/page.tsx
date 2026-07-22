import type { Metadata } from "next";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";

export const metadata: Metadata = { title: "FAQ", description: "Frequently asked questions about JavaChip." };

const items = [
  { question: "Is JavaChip affiliated with the College Board?", answer: "No. JavaChip is independent and uses only original questions, FRQs, and explanations aligned to the public course description." },
  { question: "Is JavaChip free for students?", answer: "Yes, every student account is free, permanently." },
  { question: "What's included in a free teacher account?", answer: "Full course preview, teacher dashboard preview, and one demo class with up to three students and a few sample assignments." },
  { question: "What does JavaChip Pro add for teachers?", answer: "Unlimited classes and students, the full assignment builder, gradebook, class analytics, CSV export, and announcements." },
  { question: "How is my data protected?", answer: "Supabase Row Level Security enforces that students only ever see their own data, and teachers only see students enrolled in their own classes. See our Privacy Policy for details." },
  { question: "Can I cancel JavaChip Pro anytime?", answer: "Yes, from the billing page via the Stripe customer portal. Your plan stays active through the end of the current billing period." },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-semibold text-foreground">Frequently asked questions</h1>
      <div className="mt-10">
        <FaqAccordion items={items} />
      </div>
    </div>
  );
}
