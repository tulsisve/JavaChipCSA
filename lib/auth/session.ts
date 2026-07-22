import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/types/database";

export interface SessionUser {
  id: string;
  email: string;
  profile: ProfileRow;
}

/**
 * Resolves the current authenticated user + profile on the server.
 * Returns null rather than throwing — callers decide whether the route
 * requires auth (via requireUser/requireRole below) or is merely
 * personalized when signed in (the landing page, for instance).
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return { id: user.id, email: user.email ?? profile.email, profile };
}

/** Server Component / Server Action guard: redirects to /login when signed out. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.profile.suspended_at) redirect("/account-suspended");
  return user;
}

/** Guard for a single required role. Admins are never implicitly granted teacher/student routes. */
export async function requireRole(role: "student" | "teacher" | "admin"): Promise<SessionUser> {
  const user = await requireUser();
  if (user.profile.role !== role) {
    redirect(user.profile.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard");
  }
  return user;
}
