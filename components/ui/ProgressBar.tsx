import { cn } from "@/lib/utilities/cn";

// A blocky, segmented "energy meter" — the fill is overlaid with a repeating
// mask of thin gaps so it reads as a row of pixel cells rather than a smooth
// bar. Matches the rest of the pixel UI.
const SEGMENT_MASK =
  "repeating-linear-gradient(90deg, #000 0 9px, transparent 9px 11px)";

export function ProgressBar({
  value,
  label,
  className,
  showValue = true,
}: {
  value: number;
  label?: string;
  className?: string;
  showValue?: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-[family-name:var(--font-display)] text-foreground-muted">{label}</span>}
          {showValue && <span className="font-mono text-foreground-muted">{Math.round(clamped)}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="pixel-corners-sm relative h-3.5 w-full overflow-hidden bg-background-raised shadow-[inset_0_0_0_2px_var(--pixel-line)]"
      >
        <div
          className="h-full bg-gradient-to-r from-gold to-amber transition-[width] duration-700 ease-out motion-reduce:transition-none"
          style={{ width: `${clamped}%`, maskImage: SEGMENT_MASK, WebkitMaskImage: SEGMENT_MASK }}
        />
      </div>
    </div>
  );
}
