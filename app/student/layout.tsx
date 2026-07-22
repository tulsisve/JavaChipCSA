import { requireUser } from "@/lib/auth/session";
import { getAppearanceAttributes } from "@/lib/data/theme";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { StudentSidebar } from "@/components/navigation/StudentSidebar";
import { ApplyAppearance } from "@/components/layout/ApplyAppearance";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const appearance = await getAppearanceAttributes(user.id);

  return (
    <>
      <ApplyAppearance {...appearance} />
      <DashboardShell
        sidebar={<StudentSidebar />}
        userLabel={user.profile.display_name}
        roleLabel={user.profile.role === "teacher" ? "Teacher · previewing" : "Student"}
      >
        {children}
      </DashboardShell>
    </>
  );
}
