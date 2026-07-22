import type { Metadata } from "next";
import Link from "next/link";
import { School, ClipboardList, AlertCircle, Sparkles } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getTeacherDashboardData } from "@/lib/data/teacher-dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Teacher Dashboard" };

export default async function TeacherDashboardPage() {
  const user = await requireUser();
  const data = await getTeacherDashboardData(user.id);
  const firstName = user.profile.display_name.split(" ")[0];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-foreground-muted">Welcome back,</p>
          <h1 className="font-display text-3xl font-semibold text-foreground">{firstName}</h1>
        </div>
        <div className="flex gap-2">
          <Button href="/teacher/classes/new" variant="secondary">Create class</Button>
        </div>
      </div>

      {!data.isPro && (
        <Card className="border-amber/30 bg-amber/5 p-5">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-amber" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">You&apos;re on the free plan</p>
              <p className="text-sm text-foreground-muted">Preview every teacher tool with one demo class. Upgrade to JavaChip Pro for unlimited classes and students.</p>
            </div>
            <Button href="/pricing" size="sm">See JavaChip Pro</Button>
          </div>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your classes</CardTitle>
          </CardHeader>
          <CardContent>
            {data.classes.length === 0 ? (
              <EmptyState
                icon={School}
                title="No classes yet"
                description="Create your first class to generate a join code and start assigning work."
                actionLabel="Create a class"
                actionHref="/teacher/classes/new"
              />
            ) : (
              <ul className="flex flex-col divide-y divide-border">
                {data.classes.map((c) => (
                  <li key={c.id} className="flex items-center justify-between py-3">
                    <Link href={`/teacher/classes/${c.id}`} className="text-sm font-medium text-foreground hover:text-amber">
                      {c.name}
                    </Link>
                    <span className="text-xs text-foreground-muted">{c.studentCount} students</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Needs attention</CardTitle>
            <CardDescription>Supportive framing, not a scoreboard.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-3 rounded-md border border-border p-3">
              <AlertCircle className="h-4 w-4 text-amber" />
              <div>
                <p className="text-sm text-foreground">{data.missingCount} submissions may benefit from a nudge</p>
                <p className="text-xs text-foreground-muted">Missing or not-started, among recent assignments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {data.upcomingAssignments.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No assignments scheduled"
              description="Create an assignment from a class page to see it here."
            />
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {data.upcomingAssignments.map((a) => (
                <li key={a.id} className="flex items-center justify-between py-3">
                  <div>
                    <Link href={`/teacher/classes/${a.classId}`} className="text-sm font-medium text-foreground hover:text-amber">
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

      <Card>
        <CardHeader>
          <CardTitle>Recent submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentSubmissions.length === 0 ? (
            <p className="text-sm text-foreground-muted">No submissions yet.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {data.recentSubmissions.map((s) => (
                <li key={s.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm text-foreground">{s.studentName}</p>
                    <p className="text-xs text-foreground-muted">{s.assignmentTitle}</p>
                  </div>
                  <Badge variant={s.status === "graded" ? "sage" : s.status === "submitted" ? "gold" : "outline"}>
                    {s.status.replace("_", " ")}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
