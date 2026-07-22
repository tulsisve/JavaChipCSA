"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/client";
import { priceIdForPlan, type PlanDefinition } from "@/lib/stripe/plans";
import type { ActionState } from "@/actions/auth";

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function createCheckoutSessionAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  if (user.profile.role !== "teacher") {
    return { error: "Only teacher accounts can subscribe to JavaChip Pro." };
  }

  const plan = formData.get("plan") as PlanDefinition["id"];
  if (plan !== "monthly" && plan !== "annual") {
    return { error: "Choose a plan." };
  }

  let priceId: string;
  let stripe;
  try {
    stripe = getStripe();
    priceId = priceIdForPlan(plan);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Billing isn't configured yet." };
  }

  const supabase = await createClient();
  const { data: existingSub } = await supabase
    .from("teacher_subscriptions")
    .select("*")
    .eq("teacher_id", user.id)
    .maybeSingle();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer: existingSub?.stripe_customer_id ?? undefined,
    customer_email: existingSub?.stripe_customer_id ? undefined : user.email,
    client_reference_id: user.id,
    subscription_data: { metadata: { teacher_id: user.id } },
    success_url: `${siteUrl()}/teacher/billing?checkout=success`,
    cancel_url: `${siteUrl()}/pricing?checkout=cancelled`,
  });

  if (!session.url) return { error: "Couldn't start checkout. Try again." };
  redirect(session.url);
}

export async function createPortalSessionAction(_prev: ActionState, _formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: sub } = await supabase
    .from("teacher_subscriptions")
    .select("*")
    .eq("teacher_id", user.id)
    .maybeSingle();

  if (!sub?.stripe_customer_id) {
    return { error: "No billing account found yet. Subscribe to JavaChip Pro first." };
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Billing isn't configured yet." };
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${siteUrl()}/teacher/billing`,
  });

  redirect(portal.url);
}
