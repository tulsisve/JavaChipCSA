import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { ProfileForm } from "@/components/forms/ProfileForm";
import { EmailForm, PasswordForm, DeleteAccountForm } from "@/components/forms/AccountSettingsForms";
import { PreferencesForm } from "@/components/forms/PreferencesForm";

export const metadata: Metadata = { title: "Settings" };

export default async function TeacherSettingsPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: preferences } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="font-display text-3xl font-semibold text-foreground">Settings</h1>

      <Card>
        <CardHeader><CardTitle>Teacher profile</CardTitle></CardHeader>
        <CardContent><ProfileForm profile={user.profile} /></CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accessibility &amp; appearance</CardTitle>
          <CardDescription>Applies across your dashboards and the classroom builder.</CardDescription>
        </CardHeader>
        <CardContent><PreferencesForm preferences={preferences} /></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Email</CardTitle></CardHeader>
        <CardContent><EmailForm currentEmail={user.email} /></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Password</CardTitle></CardHeader>
        <CardContent><PasswordForm /></CardContent>
      </Card>

      <Card className="border-danger/30">
        <CardHeader><CardTitle>Delete account</CardTitle></CardHeader>
        <CardContent><DeleteAccountForm /></CardContent>
      </Card>
    </div>
  );
}
