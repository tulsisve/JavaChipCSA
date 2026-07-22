"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/auth/session";
import {
  signUpSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from "@/lib/validation/auth";

export interface ActionState {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function signUpAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signUpSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { error: "Check the highlighted fields.", fieldErrors };
  }

  const { displayName, email, password, role } = parsed.data;
  const supabase = await createClient();

  // Role is client-supplied here, but only ever 'student' or 'teacher' —
  // 'admin' isn't an option zod will accept, and handle_new_user() in the
  // database trigger re-validates this server-side before writing the
  // profiles row, so a tampered request still can't self-promote.
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName, role },
      emailRedirectTo: `${siteUrl()}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect(`/verify-email?email=${encodeURIComponent(email)}`);
}

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const supabase = await createClient();
  const { error, data } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      redirect(`/verify-email?email=${encodeURIComponent(parsed.data.email)}`);
    }
    return { error: "That email and password don't match one of our accounts." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (profile?.suspended_at) {
    redirect("/account-suspended");
  }

  const redirectTo = formData.get("redirectTo");
  if (typeof redirectTo === "string" && redirectTo.startsWith("/")) {
    redirect(redirectTo);
  }

  redirect(profile?.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function forgotPasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: "Enter a valid email address." };
  }

  const supabase = await createClient();
  // Always return success regardless of whether the account exists, so we
  // never leak which emails are registered.
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl()}/reset-password`,
  });

  return { success: true };
}

export async function resetPasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) {
    return { error: "That reset link has expired. Request a new one." };
  }

  redirect("/login?reset=success");
}

export async function resendVerificationAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "");
  if (!email) return { error: "Missing email." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${siteUrl()}/auth/callback` },
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function updateProfileAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = updateProfileSchema.safeParse({
    displayName: formData.get("displayName"),
    schoolName: formData.get("schoolName"),
    graduationYear: formData.get("graduationYear") || undefined,
    bio: formData.get("bio"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your profile fields." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: parsed.data.displayName,
      school_name: parsed.data.schoolName || null,
      graduation_year: parsed.data.graduationYear ?? null,
      bio: parsed.data.bio || null,
    })
    .eq("id", user.id);

  if (error) return { error: "Couldn't save your profile. Try again." };

  revalidatePath("/student/settings");
  revalidatePath("/teacher/settings");
  return { success: true };
}

export async function updateEmailAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireUser();
  const newEmail = String(formData.get("email") ?? "");
  const parsed = loginSchema.pick({ email: true }).safeParse({ email: newEmail });
  if (!parsed.success) return { error: "Enter a valid email address." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser(
    { email: newEmail },
    { emailRedirectTo: `${siteUrl()}/auth/callback` }
  );

  if (error) return { error: error.message };
  return { success: true };
}

export async function changePasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteAccountAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const confirmation = String(formData.get("confirmation") ?? "");

  if (confirmation !== "DELETE") {
    return { error: 'Type "DELETE" to confirm — this permanently removes your account and data.' };
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return { error: "Couldn't delete your account. Please try again or contact support." };

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
