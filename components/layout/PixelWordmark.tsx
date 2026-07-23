import { cn } from "@/lib/utilities/cn";
import { PixelSparkle } from "@/components/layout/PixelSparkle";
import { PixelChocolateChip } from "@/components/layout/PixelDrinks";

const SIZE_CLASSES = {
  sm: "text-lg gap-1.5",
  md: "text-2xl gap-2",
  lg: "text-4xl gap-3",
  xl: "text-6xl gap-4 sm:text-7xl",
} as const;

const CHIP_PIXEL_SIZE = { sm: 2, md: 2, lg: 3, xl: 4 } as const;

/**
 * The JavaChip logo lockup: a chunky, pixel-font wordmark with a hard
 * extruded block shadow, a little chocolate-chip accent standing in for
 * the dot of the "j", and (optionally) twinkling sparkles — built entirely
 * in CSS/SVG (see .pixel-text in globals.css) so it's crisp at any size.
 */
export function PixelWordmark({
  size = "md",
  sparkles = false,
  className,
}: {
  size?: keyof typeof SIZE_CLASSES;
  sparkles?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("pixel-text relative inline-flex flex-wrap items-baseline text-amber", SIZE_CLASSES[size], className)}>
      {sparkles && (
        <>
          <PixelSparkle size={size === "xl" ? 28 : 14} className="absolute -left-4 -top-5 sm:-left-6 sm:-top-7" delay="0s" />
          <PixelSparkle size={size === "xl" ? 16 : 9} className="absolute -left-8 top-1 sm:-left-11" delay="0.6s" color="var(--soft-gold)" />
          <PixelSparkle size={size === "xl" ? 22 : 12} className="absolute -bottom-4 -right-5 sm:-bottom-6 sm:-right-8" delay="1.1s" />
          <PixelSparkle size={size === "xl" ? 14 : 8} className="absolute -right-9 bottom-1 sm:-right-12" delay="1.7s" color="var(--soft-gold)" />
        </>
      )}
      <span className="relative inline-block">
        <PixelChocolateChip
          pixelSize={CHIP_PIXEL_SIZE[size]}
          className="absolute -top-[0.5em] left-[0.16em] -rotate-12"
        />
        j
      </span>
      <span>ava</span>
      <span>chip</span>
    </span>
  );
}
