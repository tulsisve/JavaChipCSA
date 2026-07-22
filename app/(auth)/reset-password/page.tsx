import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";

export const metadata: Metadata = { title: "Set a new password" };

export default function ResetPasswordPage() {
  return (
    <Card className="border-amber/15 bg-background-card/70 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <CardHeader>
        <CardTitle>Choose a new password</CardTitle>
        <CardDescription>This link is single-use and expires shortly.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm />
      </CardContent>
    </Card>
  );
}
