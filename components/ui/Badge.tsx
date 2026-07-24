import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utilities/cn";

const badgeVariants = cva(
  "pixel-corners-sm inline-flex items-center gap-1.5 px-2.5 py-1 font-[family-name:var(--font-display)] text-[11px] font-medium tracking-wide shadow-[inset_0_0_0_1.5px_var(--pixel-line)]",
  {
    variants: {
      variant: {
        default: "bg-background-raised text-foreground-muted",
        amber: "bg-amber/20 text-amber",
        gold: "bg-gold/20 text-gold",
        sage: "bg-sage/20 text-sage-bright",
        danger: "bg-danger/20 text-danger",
        outline: "bg-transparent text-foreground",
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
