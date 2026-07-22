import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getAppearanceAttributes } from "@/lib/data/theme";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { TeacherSidebar } from "@/components/navigation/TeacherSidebar";
import { ApplyAppearance } from "@/components/layout/ApplyAppearance";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  if (user.profile.role === "student") {
    redirect("/student/dashboard");
  }

  const appearance = await getAppearanceAttributes(user.id);

  return (
    <>
      <ApplyAppearance {...appearance} />
      <DashboardShell
        sidebar={<TeacherSidebar />}
        userLabel={user.profile.display_name}
        roleLabel={user.profile.role === "admin" ? "Admin" : "Teacher"}
      >
        {children}
      </DashboardShell>
    </>
  );
}
