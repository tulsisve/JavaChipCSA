import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utilities/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-background-raised text-foreground-muted border border-border",
        amber: "bg-amber/15 text-amber border border-amber/30",
        gold: "bg-gold/15 text-gold border border-gold/30",
        sage: "bg-sage/15 text-sage border border-sage/30",
        danger: "bg-danger/15 text-danger border border-danger/30",
        outline: "border border-border text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
