"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function MobileNav({
  links,
  isAuthed,
  dashboardHref,
}: {
  links: { href: string; label: string }[];
  isAuthed: boolean;
  dashboardHref: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-background-raised"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-16 z-40 border-b border-border bg-surface-nav px-4 py-4">
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-foreground-muted hover:bg-background-raised hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
            {isAuthed ? (
              <Button href={dashboardHref}>Go to dashboard</Button>
            ) : (
              <>
                <Button href="/login" variant="secondary">Log in</Button>
                <Button href="/sign-up">Start Studying</Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
