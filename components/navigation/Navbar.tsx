import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";
import { Button } from "@/components/ui/Button";
import { MobileNav } from "@/components/navigation/MobileNav";

const links = [
  { href: "/features", label: "Features" },
  { href: "/course", label: "Course" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export async function Navbar() {
  const user = await getSessionUser();
  const dashboardHref = user?.profile.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface-nav/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-baseline gap-1 text-xl">
          <span className="font-display font-semibold text-foreground">Java</span>
          <span className="font-mono text-amber">Chip</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-foreground-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Button href={dashboardHref} size="sm">Go to dashboard</Button>
          ) : (
            <>
              <Button href="/login" variant="ghost" size="sm">Log in</Button>
              <Button href="/sign-up" size="sm">Start Studying</Button>
            </>
          )}
        </div>

        <MobileNav
          links={links}
          isAuthed={!!user}
          dashboardHref={dashboardHref}
        />
      </div>
    </header>
  );
}
