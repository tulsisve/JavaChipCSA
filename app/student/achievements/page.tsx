import type { Metadata } from "next";
import { Award } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { badgeDefinitions } from "@/lib/content/badges";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utilities/cn";

export const metadata: Metadata = { title: "Achievements" };

export default async function AchievementsPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: earned } = await supabase.from("student_badges").select("*").eq("student_id", user.id);
  const { data: badgeRows } = await supabase.from("badges").select("*");

  const earnedNames = new Set(
    (earned ?? [])
      .map((e) => (badgeRows ?? []).find((b) => b.id === e.badge_id)?.name)
      .filter(Boolean)
  );

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground">Achievements</h1>
        <p className="mt-1 text-foreground-muted">
          {earnedNames.size} of {badgeDefinitions.length} earned. Understated on purpose — no streak guilt trips here.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {badgeDefinitions.map((badge) => {
          const isEarned = earnedNames.has(badge.name);
          return (
            <Card
              key={badge.id}
              className={cn("flex items-start gap-3 p-5", !isEarned && "opacity-50")}
            >
              <div className={cn("flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full", isEarned ? "bg-gold/15 text-gold" : "bg-background-raised text-foreground-muted")}>
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-foreground">{badge.name}</h3>
                <p className="mt-1 text-xs text-foreground-muted">{badge.description}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
