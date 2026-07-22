import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Service-role Supabase client. Bypasses Row Level Security entirely.
 *
 * This must NEVER be imported from a Client Component, and the
 * `server-only` import above enforces that at build time — bundling this
 * file into client JS throws a build error rather than leaking the key.
 *
 * Legitimate uses are narrow: the Stripe webhook handler (writing
 * subscription status the client must never set itself), and admin server
 * actions that have already verified `is_admin()`.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured. Server-only operations (Stripe webhooks, admin actions) cannot run without it."
    );
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
