import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { SignUpForm } from "@/components/forms/SignUpForm";

export const metadata: Metadata = { title: "Create your account" };

export default function SignUpPage() {
  return (
    <Card className="border-amber/15 bg-background-card/70 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <CardHeader>
        <CardTitle>Start studying</CardTitle>
        <CardDescription>Settle in, open your editor, and start building.</CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
        <p className="mt-6 text-center text-sm text-foreground-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-amber hover:underline">
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
