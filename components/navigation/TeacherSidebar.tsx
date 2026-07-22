"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, School, BarChart3, BookMarked, CreditCard, Settings,
} from "lucide-react";
import { cn } from "@/lib/utilities/cn";

const sections = [
  {
    items: [
      { href: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/teacher/classes", label: "Classes", icon: School },
    ],
  },
  {
    title: "Teach",
    items: [
      { href: "/teacher/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/teacher/question-bank", label: "Custom Question Bank", icon: BookMarked },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/teacher/billing", label: "JavaChip Pro", icon: CreditCard },
      { href: "/teacher/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function TeacherSidebar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Teacher" className="flex h-full flex-col gap-6 overflow-y-auto px-3 py-6">
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
