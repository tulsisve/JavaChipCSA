import { cn } from "@/lib/utilities/cn";

export type PixelPalette = Record<string, string>;

/** Renders a small ASCII-grid sprite (one character per pixel, "." = transparent) as a crisp CSS grid — used for the pixelated drink icons and other cute decorative accents. */
export function PixelArt({
  sprite,
  palette,
  pixelSize = 5,
  className,
}: {
  sprite: string[];
  palette: PixelPalette;
  pixelSize?: number;
  className?: string;
}) {
  const cols = sprite[0]?.length ?? 0;

  return (
    <div
      className={cn("pixel-drop-shadow inline-grid leading-none", className)}
      style={{ gridTemplateColumns: `repeat(${cols}, ${pixelSize}px)` }}
      aria-hidden="true"
    >
      {sprite.flatMap((row, y) =>
        row.split("").map((ch, x) => (
          <span
            key={`${y}-${x}`}
            style={{
              width: pixelSize,
              height: pixelSize,
              background: ch === "." ? "transparent" : palette[ch],
            }}
          />
        ))
      )}
    </div>
  );
}
