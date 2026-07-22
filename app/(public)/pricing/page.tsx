import type { Metadata } from "next";
import { Check } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { JAVACHIP_PRO_PLANS, JAVACHIP_PRO_FEATURES } from "@/lib/stripe/plans";
import { CheckoutButton } from "@/components/billing/CheckoutButton";

export const metadata: Metadata = {
  title: "Pricing",
  description: "JavaChip is free for students. Teachers can upgrade to JavaChip Pro.",
};

export default async function PricingPage() {
  const user = await getSessionUser();
  const isTeacher = user?.profile.role === "teacher";

  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="amber">Pricing</Badge>
        <h1 className="mt-4 font-display text-4xl font-semibold text-foreground">
          Free to study. Simple to teach with.
        </h1>
        <p className="mt-4 text-foreground-muted">
          Every student account is free, permanently. Teachers can preview the whole platform for
          free and upgrade to JavaChip Pro when they&apos;re ready for their full roster.
        </p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <h2 className="font-display text-xl font-semibold text-foreground">Student</h2>
          <p className="mt-1 font-display text-3xl font-semibold text-foreground">Free</p>
          <p className="mt-1 text-sm text-foreground-muted">Forever, for every student.</p>
          <ul className="mt-6 flex flex-col gap-2.5 text-sm text-foreground-muted">
            {["Full course access", "Syntax Café", "MCQ Question Bank", "FRQ Workshop", "Progress tracking & spaced repetition"].map((f) => (
              <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-sage" />{f}</li>
            ))}
          </ul>
          <Button href="/sign-up" variant="secondary" className="mt-6 w-full">Start Studying</Button>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-xl font-semibold text-foreground">Teacher (Free)</h2>
          <p className="mt-1 font-display text-3xl font-semibold text-foreground">Free</p>
          <p className="mt-1 text-sm text-foreground-muted">Explore everything, one demo class.</p>
          <ul className="mt-6 flex flex-col gap-2.5 text-sm text-foreground-muted">
            {["Full course preview", "Teacher dashboard preview", "1 demo class, up to 3 students", "A few sample assignments"].map((f) => (
              <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-sage" />{f}</li>
            ))}
          </ul>
          <Button href="/sign-up?role=teacher" variant="secondary" className="mt-6 w-full">Create a free account</Button>
        </Card>

        <Card className="border-amber/40 p-6 shadow-lg shadow-amber/5">
          <Badge variant="amber" className="w-fit">JavaChip Pro</Badge>
          <p className="mt-3 font-display text-3xl font-semibold text-foreground">{JAVACHIP_PRO_PLANS[0].priceLabel}</p>
          <p className="mt-1 text-sm text-foreground-muted">or {JAVACHIP_PRO_PLANS[1].priceLabel} billed annually</p>
          <ul className="mt-6 flex flex-col gap-2.5 text-sm text-foreground-muted">
            {JAVACHIP_PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber" />{f}</li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-2">
            {isTeacher ? (
              <>
                <CheckoutButton plan="monthly" label={`Subscribe monthly — ${JAVACHIP_PRO_PLANS[0].priceLabel}`} />
                <CheckoutButton plan="annual" label={`Subscribe annually — ${JAVACHIP_PRO_PLANS[1].priceLabel}`} />
              </>
            ) : (
              <Button href="/sign-up?role=teacher" className="w-full">Create a teacher account to subscribe</Button>
            )}
          </div>
        </Card>
      </div>

      <p className="mx-auto mt-10 max-w-xl text-center text-xs text-foreground-muted">
        Prices shown are illustrative defaults — configure your actual Stripe Price IDs and
        amounts in your Stripe dashboard; JavaChip reads whatever price you attach to
        STRIPE_PRICE_ID_MONTHLY and STRIPE_PRICE_ID_ANNUAL.
      </p>
    </div>
  );
}
