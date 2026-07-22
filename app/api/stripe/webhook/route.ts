import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SubscriptionPlan, SubscriptionStatus } from "@/types/database";

export const runtime = "nodejs";

/**
 * Stripe webhook handler — the ONLY place teacher_subscriptions is ever
 * written. Signature verification (via STRIPE_WEBHOOK_SECRET) is what
 * proves a request actually came from Stripe; without it, anyone could
 * POST a fake "subscription active" event and grant themselves JavaChip
 * Pro. This route uses the service-role Supabase client because RLS
 * deliberately has no client-writable policy on this table at all.
 */
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json(
      { error: `Signature verification failed: ${err instanceof Error ? err.message : "unknown"}` },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();
  const stripe = getStripe();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const teacherId = session.client_reference_id;
      if (!teacherId || !session.subscription || !session.customer) break;

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      await upsertSubscription(supabase, teacherId, session.customer as string, subscription);
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.created": {
      const subscription = event.data.object as Stripe.Subscription;
      const teacherId = subscription.metadata?.teacher_id;
      if (!teacherId) break;
      await upsertSubscription(supabase, teacherId, subscription.customer as string, subscription);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await supabase
        .from("teacher_subscriptions")
        .update({ status: "canceled", cancel_at_period_end: false })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId =
        typeof invoice.parent?.subscription_details?.subscription === "string"
          ? invoice.parent.subscription_details.subscription
          : undefined;
      if (!subscriptionId) break;
      await supabase
        .from("teacher_subscriptions")
        .update({ status: "past_due" })
        .eq("stripe_subscription_id", subscriptionId);
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}

async function upsertSubscription(
  supabase: ReturnType<typeof createAdminClient>,
  teacherId: string,
  customerId: string,
  subscription: Stripe.Subscription
) {
  const item = subscription.items.data[0];
  const interval = item?.price.recurring?.interval;
  const plan: SubscriptionPlan = interval === "year" ? "annual" : "monthly";

  await supabase
    .from("teacher_subscriptions")
    .upsert(
      {
        teacher_id: teacherId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
        plan,
        status: subscription.status as SubscriptionStatus,
        current_period_start: item?.current_period_start
          ? new Date(item.current_period_start * 1000).toISOString()
          : null,
        current_period_end: item?.current_period_end
          ? new Date(item.current_period_end * 1000).toISOString()
          : null,
        cancel_at_period_end: subscription.cancel_at_period_end,
      },
      { onConflict: "teacher_id" }
    );
}
