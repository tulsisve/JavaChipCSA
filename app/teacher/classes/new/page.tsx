import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { CreateClassForm } from "@/components/forms/CreateClassForm";

export const metadata: Metadata = { title: "Create a class" };

export default function NewClassPage() {
  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Create a class</CardTitle>
          <CardDescription>
            Free accounts can create one demo class with up to three students. Upgrade to
            JavaChip Pro for unlimited classes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateClassForm />
        </CardContent>
      </Card>
    </div>
  );
}
