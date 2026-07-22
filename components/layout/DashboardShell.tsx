"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { cn } from "@/lib/utilities/cn";

export function DashboardShell({
  sidebar,
  children,
  userLabel,
  roleLabel,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  userLabel: string;
  roleLabel: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface-nav px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-md text-foreground lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link href="/" className="inline-flex items-baseline gap-1">
            <span className="font-display text-lg font-semibold text-foreground">Java</span>
            <span className="font-mono text-amber">Chip</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <div className="text-sm font-medium text-foreground">{userLabel}</div>
            <div className="text-xs text-foreground-muted">{roleLabel}</div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-md border border-border px-3 py-1.5 text-xs text-foreground-muted hover:text-foreground"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="flex flex-1">
        <aside
          className={cn(
            "fixed inset-y-16 left-0 z-20 w-64 border-r border-border bg-surface-nav transition-transform lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebar}
        </aside>
        {mobileOpen && (
          <button
            aria-label="Close menu overlay"
            className="fixed inset-0 top-16 z-10 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
