import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { TeacherSidebar } from "@/components/navigation/TeacherSidebar";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  if (user.profile.role === "student") {
    redirect("/student/dashboard");
  }

  return (
    <DashboardShell
      sidebar={<TeacherSidebar />}
      userLabel={user.profile.display_name}
      roleLabel={user.profile.role === "admin" ? "Admin" : "Teacher"}
    >
      {children}
    </DashboardShell>
  );
}
