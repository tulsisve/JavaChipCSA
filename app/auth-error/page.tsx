import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Sign-in link expired" };

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-espresso px-4">
      <Card className="max-w-md">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-danger/15 text-danger">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>
          <CardTitle>That link didn&apos;t work</CardTitle>
          <CardDescription>
            It may have expired or already been used. Request a fresh one below.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center gap-3">
          <Button href="/login" variant="secondary">Back to login</Button>
          <Button href="/forgot-password">Reset password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
