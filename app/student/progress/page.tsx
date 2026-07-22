import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/EmptyState";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Progress" };

export default async function ProgressPage() {
  await requireUser();
  return <ComingSoon title="Your full progress report" />;
}
