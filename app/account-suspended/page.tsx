import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { logoutAction } from "@/actions/auth";

export const metadata: Metadata = { title: "Account suspended" };

export default function AccountSuspendedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-espresso px-4">
      <Card className="max-w-md">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-danger/15 text-danger">
            <ShieldAlert className="h-6 w-6" aria-hidden="true" />
          </div>
          <CardTitle>This account is suspended</CardTitle>
          <CardDescription>
            An administrator has suspended access to this account. If you believe this is a
            mistake, contact your teacher or reach out to JavaChip support.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <form action={logoutAction}>
            <Button type="submit" variant="secondary">Sign out</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
