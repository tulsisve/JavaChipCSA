import Link from "next/link";

const columns = [
  {
    title: "Learn",
    links: [
      { href: "/course", label: "Course Overview" },
      { href: "/features", label: "Student Features" },
      { href: "/pricing", label: "JavaChip Pro" },
    ],
  },
  {
    title: "Teach",
    links: [
      { href: "/features#teachers", label: "Teacher Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/sign-up", label: "Create a class" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/accessibility", label: "Accessibility" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="wood-surface relative border-t border-border bg-surface-nav">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber/25 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-sm font-semibold text-foreground">{col.title}</h3>
              <ul className="mt-3 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground-muted transition-colors hover:text-amber"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <Link href="/" className="inline-flex items-baseline gap-1">
            <span className="font-display font-semibold text-foreground">Java</span>
            <span className="font-mono text-amber">Chip</span>
          </Link>
          <p className="text-xs text-foreground-muted">
            © {new Date().getFullYear()} JavaChip. Not affiliated with or endorsed by the College Board.
          </p>
        </div>
      </div>
    </footer>
  );
}
