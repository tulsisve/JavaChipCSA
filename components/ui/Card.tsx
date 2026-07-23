import { cn } from "@/lib/utilities/cn";

export function Card({
  className,
  children,
  as: Tag = "div",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { as?: React.ElementType }) {
  return (
    <Tag
      className={cn(
        "relative rounded-3xl border border-border bg-background-card/90 shadow-lg shadow-black/15 backdrop-blur-sm",
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:rounded-t-3xl before:bg-gradient-to-r before:from-transparent before:via-warm-cream/15 before:to-transparent",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1 p-5 pb-0", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-display text-xl font-semibold tracking-tight text-foreground", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-foreground-muted", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center gap-3 p-5 pt-0", className)} {...props} />;
}
