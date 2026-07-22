import { cn } from "@/lib/utilities/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-background-raised motion-reduce:animate-none",
        className
      )}
      aria-hidden="true"
    />
  );
}
