import type { Metadata } from "next";
import Link from "next/link";
import { Coffee, Flame, Clock3, BookOpen, Award, ClipboardList, ArrowRight } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getStudentDashboardData } from "@/lib/data/student-dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Dashboard" };

function formatTopic(topic: string) {
  return topic.replace(/_/g, " ");
}

export default async function StudentDashboardPage() {
  const user = await requireUser();
  const data = await getStudentDashboardData(user.id, user.profile.display_name);

  const firstName = data.displayName.split(" ")[0];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-foreground-muted">Welcome back,</p>
        <h1 className="font-display text-3xl font-semibold text-foreground">{firstName}</h1>
      </div>

      {/* Today's Brew */}
      <Card className="overflow-hidden border-amber/30 bg-gradient-to-br from-background-card to-background-raised">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber">
              <Coffee className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">Today&apos;s Brew</span>
            </div>
            <p className="mt-2 font-display text-xl text-foreground">{data.todaysBrew.description}</p>
            <p className="mt-1 text-sm text-foreground-muted">{data.todaysBrew.title}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button href={data.todaysBrew.href}>
              Continue learning <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/student/syntax-cafe?mode=quick-sip" variant="secondary">Quick Sip · 5 min</Button>
            <Button href="/student/syntax-cafe?mode=deep-brew" variant="ghost">Deep Brew · 50 min</Button>
          </div>
        </CardContent>
      </Card>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<Flame className="h-4 w-4" />} label="Study streak" value={`${data.streakDays} day${data.streakDays === 1 ? "" : "s"}`} />
        <StatCard
          icon={<BookOpen className="h-4 w-4" />}
          label="MCQ accuracy"
          value={data.mcqAccuracy === null ? "—" : `${data.mcqAccuracy}%`}
          hint={`${data.mcqAttempted} attempted`}
        />
        <StatCard icon={<Clock3 className="h-4 w-4" />} label="Due for review" value={String(data.reviewQueueCount)} hint="items" />
        <StatCard icon={<ClipboardList className="h-4 w-4" />} label="Saved FRQs" value={String(data.savedFrqCount)} hint="in progress" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Course completion */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Course completion</CardTitle>
            <CardDescription>{data.completedLessons} of {data.totalLessons} seeded lessons completed</CardDescription>
          </CardHeader>
          <CardContent>
            <ProgressBar value={data.courseCompletionPercent} label="Overall progress" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Weakest topics</h4>
                {data.weakestTopics.length === 0 ? (
                  <p className="mt-2 text-sm text-foreground-muted">Practice a few drills to see topic mastery here.</p>
                ) : (
                  <ul className="mt-2 flex flex-col gap-2">
                    {data.weakestTopics.map((t) => (
                      <li key={t.topic} className="flex items-center justify-between text-sm">
                        <span className="text-foreground-muted">{formatTopic(t.topic)}</span>
                        <Badge variant="danger">{Math.round(t.masteryScore)}%</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">Strongest topics</h4>
                {data.strongestTopics.length === 0 ? (
                  <p className="mt-2 text-sm text-foreground-muted">Your strongest skills will show up here.</p>
                ) : (
                  <ul className="mt-2 flex flex-col gap-2">
                    {data.strongestTopics.map((t) => (
                      <li key={t.topic} className="flex items-center justify-between text-sm">
                        <span className="text-foreground-muted">{formatTopic(t.topic)}</span>
                        <Badge variant="sage">{Math.round(t.masteryScore)}%</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Recent achievements</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentBadges.length === 0 ? (
              <EmptyState
                icon={Award}
                title="No badges yet"
                description="Complete lessons and drills to start earning badges."
              />
            ) : (
              <ul className="flex flex-col gap-3">
                {data.recentBadges.map((b) => (
                  <li key={b.name} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 text-gold">
                      <Award className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{b.name}</p>
                      <p className="text-xs text-foreground-muted">{new Date(b.earnedAt).toLocaleDateString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Button href="/student/achievements" variant="link" size="sm" className="mt-4">
              View all achievements →
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming assignments</CardTitle>
          <CardDescription>Due soonest first, across all your classrooms.</CardDescription>
        </CardHeader>
        <CardContent>
          {data.upcomingAssignments.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="Nothing is due right now"
              description="Join a classroom with a class code to see teacher assignments here."
              actionLabel="Join a classroom"
              actionHref="/student/classrooms"
            />
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {data.upcomingAssignments.map((a) => (
                <li key={a.id} className="flex items-center justify-between py-3">
                  <div>
                    <Link href={`/student/assignments/${a.id}`} className="text-sm font-medium text-foreground hover:text-amber">
                      {a.title}
                    </Link>
                    <p className="text-xs text-foreground-muted">{a.className}</p>
                  </div>
                  <span className="text-xs text-foreground-muted">
                    {a.dueAt ? `Due ${new Date(a.dueAt).toLocaleDateString()}` : "No due date"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon, label, value, hint }: { icon: React.ReactNode; label: string; value: string; hint?: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-amber">{icon}<span className="text-xs font-medium text-foreground-muted">{label}</span></div>
      <p className="mt-2 font-display text-2xl font-semibold text-foreground">{value}</p>
      {hint && <p className="text-xs text-foreground-muted">{hint}</p>}
    </Card>
  );
}
