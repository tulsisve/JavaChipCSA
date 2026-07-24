import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utilities/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-[family-name:var(--font-display)] font-medium tracking-wide disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none",
  {
    variants: {
      variant: {
        primary: "pixel-btn bg-gradient-to-b from-gold to-amber text-espresso",
        secondary: "pixel-btn pixel-btn-light bg-background-raised text-foreground",
        ghost: "pixel-corners text-foreground hover:bg-background-raised transition-colors",
        outline: "pixel-btn pixel-btn-light bg-amber/10 text-amber",
        link: "bg-transparent underline-offset-4 hover:underline text-amber p-0 h-auto",
        danger: "pixel-btn bg-danger text-warm-cream",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-13 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, href, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className);
    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }
    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
