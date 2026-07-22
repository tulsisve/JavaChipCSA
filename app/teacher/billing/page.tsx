import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import { getSubscription } from "@/lib/permissions/subscription";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { CheckoutButton } from "@/components/billing/CheckoutButton";
import { PortalButton } from "@/components/billing/PortalButton";
import { JAVACHIP_PRO_PLANS } from "@/lib/stripe/plans";

export const metadata: Metadata = { title: "JavaChip Pro" };

const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  trialing: "Trial",
  past_due: "Past due",
  canceled: "Canceled",
  incomplete: "Incomplete",
  incomplete_expired: "Expired",
  unpaid: "Unpaid",
};

export default async function TeacherBillingPage() {
  const user = await requireUser();
  const subscription = await getSubscription(user.id);

  const isActive = subscription && ["active", "trialing"].includes(subscription.status);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground">JavaChip Pro</h1>
        <p className="mt-1 text-foreground-muted">Your subscription status and billing history.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current plan</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Badge variant={isActive ? "amber" : "outline"}>
              {subscription ? STATUS_LABEL[subscription.status] ?? subscription.status : "Free plan"}
            </Badge>
            {subscription?.plan && <span className="text-sm text-foreground-muted capitalize">{subscription.plan} billing</span>}
          </div>

          {subscription?.current_period_end && (
            <p className="text-sm text-foreground-muted">
              {subscription.cancel_at_period_end ? "Access ends" : "Renews"} on{" "}
              {new Date(subscription.current_period_end).toLocaleDateString()}
            </p>
          )}

          {subscription?.status === "past_due" && (
            <p className="text-sm text-danger">
              Your last payment failed. Update your payment method to keep JavaChip Pro active.
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {isActive ? (
              <PortalButton />
            ) : (
              <>
                <CheckoutButton plan="monthly" label={`Subscribe monthly — ${JAVACHIP_PRO_PLANS[0].priceLabel}`} />
                <CheckoutButton plan="annual" label={`Subscribe annually — ${JAVACHIP_PRO_PLANS[1].priceLabel}`} />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>
            Automated FRQ scoring is always an estimate and is never official College Board
            scoring. Subscription status shown here is synchronized exclusively via verified
            Stripe webhooks — it is never set directly by the browser.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
