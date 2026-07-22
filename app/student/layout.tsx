import { requireUser } from "@/lib/auth/session";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StudentSidebar } from "@/components/navigation/StudentSidebar";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <DashboardShell
      sidebar={<StudentSidebar />}
      userLabel={user.profile.display_name}
      roleLabel={user.profile.role === "teacher" ? "Teacher · previewing" : "Student"}
    >
      {children}
    </DashboardShell>
  );
}
