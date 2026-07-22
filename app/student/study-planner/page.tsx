import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/EmptyState";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Study Planner" };

export default async function StudyPlannerPage() {
  await requireUser();
  return <ComingSoon title="The Study Planner" />;
}
