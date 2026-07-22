"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Map, Coffee, BookOpen, PenLine, Library,
  CalendarClock, ClipboardList, Users, TrendingUp, Award, Bookmark,
  StickyNote, Settings,
} from "lucide-react";
import { cn } from "@/lib/utilities/cn";

const sections = [
  {
    items: [
      { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/student/course-map", label: "Course Map", icon: Map },
    ],
  },
  {
    title: "Practice",
    items: [
      { href: "/student/syntax-cafe", label: "Syntax Café", icon: Coffee },
      { href: "/student/question-bank", label: "Question Bank", icon: BookOpen },
      { href: "/student/frq-workshop", label: "FRQ Workshop", icon: PenLine },
      { href: "/student/reference", label: "Reference Library", icon: Library },
    ],
  },
  {
    title: "Plan",
    items: [
      { href: "/student/study-planner", label: "Study Planner", icon: CalendarClock },
      { href: "/student/assignments", label: "Assignments", icon: ClipboardList },
      { href: "/student/classrooms", label: "Classrooms", icon: Users },
    ],
  },
  {
    title: "You",
    items: [
      { href: "/student/progress", label: "Progress", icon: TrendingUp },
      { href: "/student/achievements", label: "Achievements", icon: Award },
      { href: "/student/bookmarks", label: "Bookmarks", icon: Bookmark },
      { href: "/student/notes", label: "Notes", icon: StickyNote },
      { href: "/student/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function StudentSidebar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Student" className="flex h-full flex-col gap-6 overflow-y-auto px-3 py-6">
      {sections.map((section, i) => (
        <div key={i} className="flex flex-col gap-1">
          {section.title && (
            <h2 className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-foreground-muted/70">
              {section.title}
            </h2>
          )}
          {section.items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-amber/15 text-amber"
                    : "text-foreground-muted hover:bg-background-raised hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
