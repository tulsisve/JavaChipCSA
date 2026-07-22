import "server-only";
import Stripe from "stripe";

let stripeSingleton: Stripe | null = null;

/**
 * Lazily-constructed Stripe client. Lazy so the app can boot (and even
 * build) without STRIPE_SECRET_KEY set — billing routes will simply return
 * a clear "not configured" error instead of crashing the whole server.
 */
export function getStripe(): Stripe {
  if (stripeSingleton) return stripeSingleton;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not configured. Add it to your environment to enable JavaChip Pro billing."
    );
  }

  stripeSingleton = new Stripe(key, {
    apiVersion: "2026-06-24.dahlia",
    appInfo: { name: "JavaChip", version: "1.0.0" },
  });
  return stripeSingleton;
}
