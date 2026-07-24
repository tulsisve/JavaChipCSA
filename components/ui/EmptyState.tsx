import Link from "next/link";
import { Hammer, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="pixel-corners flex flex-col items-center gap-3 bg-background-card/50 px-6 py-16 text-center shadow-[inset_0_0_0_2px_var(--pixel-line)]">
      <div className="pixel-corners-sm flex h-12 w-12 items-center justify-center bg-amber/15 text-amber">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
      <p className="max-w-sm text-sm text-foreground-muted">{description}</p>
      {actionLabel && actionHref && (
        <Button href={actionHref} size="sm" variant="secondary" className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/student/dashboard" className="text-sm text-amber hover:underline">
        ← Back to dashboard
      </Link>
      <EmptyState
        icon={Hammer}
        title={`${title} is brewing`}
        description="This corner of JavaChip is still being built out. Check back soon."
      />
    </div>
  );
}
