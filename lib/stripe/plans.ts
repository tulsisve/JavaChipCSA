export interface PlanDefinition {
  id: "monthly" | "annual";
  name: string;
  priceLabel: string;
  billingNote: string;
  priceEnvVar: "STRIPE_PRICE_ID_MONTHLY" | "STRIPE_PRICE_ID_ANNUAL";
}

export const JAVACHIP_PRO_PLANS: PlanDefinition[] = [
  {
    id: "monthly",
    name: "Monthly",
    priceLabel: "$12/mo",
    billingNote: "Billed monthly. Cancel anytime.",
    priceEnvVar: "STRIPE_PRICE_ID_MONTHLY",
  },
  {
    id: "annual",
    name: "Annual",
    priceLabel: "$96/yr",
    billingNote: "Billed once a year — about $8/mo, a 33% saving.",
    priceEnvVar: "STRIPE_PRICE_ID_ANNUAL",
  },
];

export const JAVACHIP_PRO_FEATURES = [
  "Unlimited classes and join codes",
  "Unlimited students within reasonable platform limits",
  "Full assignment builder — lessons, drills, MCQs, FRQs, checkpoints",
  "Gradebook with CSV export",
  "Class and student mastery analytics",
  "Custom question banks",
  "Classroom announcements",
  "Scheduled feedback and explanation release",
];

export function priceIdForPlan(plan: PlanDefinition["id"]): string {
  const envVar = plan === "monthly" ? "STRIPE_PRICE_ID_MONTHLY" : "STRIPE_PRICE_ID_ANNUAL";
  const value = process.env[envVar];
  if (!value) {
    throw new Error(`${envVar} is not configured. Set it in your environment to enable checkout for this plan.`);
  }
  return value;
}
