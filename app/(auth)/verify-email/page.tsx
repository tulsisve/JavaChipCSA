import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { ResendVerificationForm } from "@/components/forms/ResendVerificationForm";

export const metadata: Metadata = { title: "Verify your email" };

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email = "" } = await searchParams;

  return (
    <Card>
      <CardHeader className="items-center text-center">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber/15 text-amber">
          <Mail className="h-6 w-6" aria-hidden="true" />
        </div>
        <CardTitle>Check your inbox</CardTitle>
        <CardDescription>
          {email ? (
            <>We sent a confirmation link to <span className="text-foreground">{email}</span>.</>
          ) : (
            "We sent you a confirmation link."
          )}{" "}
          Click it to activate your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <ResendVerificationForm email={email} />
      </CardContent>
    </Card>
  );
}
