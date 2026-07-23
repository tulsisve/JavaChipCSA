import { cn } from "@/lib/utilities/cn";

/** A small four-point pixel-style sparkle accent, built from a plus-shaped SVG so it stays crisp at any size. Purely decorative. */
export function PixelSparkle({
  className,
  size = 18,
  color = "var(--amber-glow)",
  delay = "0s",
}: {
  className?: string;
  size?: number;
  color?: string;
  delay?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={cn("pixel-sparkle pointer-events-none", className)}
      style={{ animationDelay: delay, shapeRendering: "crispEdges" }}
      aria-hidden="true"
    >
      <path
        fill={color}
        d="M7 0h2v4h4v2h-4v4H7V6H3V4h4V0Zm-6 9h2v2H1V9Zm12 0h2v2h-2V9ZM4 12h2v2H4v-2Zm6 0h2v2h-2v-2ZM7 13h2v2H7v-2Z"
      />
    </svg>
  );
}
