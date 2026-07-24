import { forwardRef } from "react";
import { cn } from "@/lib/utilities/cn";

// Notched pixel field. The border + focus ring are inset box-shadows (not an
// outset ring) so they stay visible inside the clipped notched corners.
const fieldBase =
  "pixel-corners w-full bg-background-raised text-sm text-foreground placeholder:text-foreground-muted/70 shadow-[inset_0_0_0_2px_var(--pixel-line)] focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--accent)]";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(fieldBase, "h-11 px-3.5", className)} {...props} />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(fieldBase, "min-h-28 px-3.5 py-2.5", className)} {...props} />
  )
);
Textarea.displayName = "Textarea";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("font-[family-name:var(--font-display)] text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}

export function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p role="alert" className="text-xs text-danger">
      {children}
    </p>
  );
}
