import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utilities/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-[background-color,box-shadow,transform,border-color] duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none active:scale-[0.98] motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-gold to-amber text-espresso shadow-md shadow-black/25 hover:shadow-lg hover:shadow-amber/25 hover:-translate-y-0.5",
        secondary:
          "bg-transparent border border-border text-foreground hover:bg-background-raised hover:border-latte/50 hover:-translate-y-0.5",
        ghost: "bg-transparent text-foreground hover:bg-background-raised",
        outline:
          "border border-amber/60 text-amber hover:bg-amber/10 hover:border-amber hover:-translate-y-0.5",
        link: "bg-transparent underline-offset-4 hover:underline text-amber p-0 h-auto",
        danger: "bg-danger text-warm-cream hover:brightness-110",
      },
      size: {
        sm: "h-9 px-3 text-sm",
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
