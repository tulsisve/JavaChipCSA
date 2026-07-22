import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { LoginForm } from "@/components/forms/LoginForm";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Your study desk is waiting.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-center text-sm text-foreground-muted">
          New to JavaChip?{" "}
          <Link href="/sign-up" className="text-amber hover:underline">
            Create an account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
