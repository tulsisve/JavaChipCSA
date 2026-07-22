import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/EmptyState";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Custom Question Bank" };

export default async function TeacherQuestionBankPage() {
  await requireUser();
  return <ComingSoon title="The custom question bank" />;
}
