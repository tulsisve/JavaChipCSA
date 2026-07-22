import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/EmptyState";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Analytics" };

export default async function TeacherAnalyticsPage() {
  await requireUser();
  return <ComingSoon title="Class analytics" />;
}
