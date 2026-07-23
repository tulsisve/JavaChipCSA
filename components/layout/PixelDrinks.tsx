import { PixelArt } from "@/components/layout/PixelArt";

const PALETTE = {
  l: "var(--dark-roast)", // lid / straw
  c: "var(--warm-cream)", // cup body / whipped cream
  s: "var(--cafe-wood)", // sleeve / cup outline
  d: "var(--soft-gold)", // drink liquid
  k: "var(--dark-roast)", // chocolate chip fleck
  a: "var(--amber-glow)", // accent stripe
};

const HOT_CUP = [
  ".llll.",
  ".llll.",
  "llllll",
  ".cccc.",
  ".cccc.",
  ".ssss.",
  ".ssss.",
  "..cc..",
];

const FRAPPE_CUP = [
  "....l..",
  "....l..",
  ".ccclc.",
  ".ccccc.",
  ".sdddds",
  ".sdkdds",
  ".sdddds",
  ".sdkdds",
  "..sss..",
];

/** A small pixel-art hot coffee cup — one of the "pixelated drinks" decorative accents. */
export function PixelHotCup({ className, pixelSize = 5 }: { className?: string; pixelSize?: number }) {
  return <PixelArt sprite={HOT_CUP} palette={PALETTE} pixelSize={pixelSize} className={className} />;
}

/** A small pixel-art Java Chip frappé — whipped cream, straw, and chocolate-chip flecks in the drink. */
export function PixelFrappe({ className, pixelSize = 5 }: { className?: string; pixelSize?: number }) {
  return <PixelArt sprite={FRAPPE_CUP} palette={PALETTE} pixelSize={pixelSize} className={className} />;
}

const CHOC_CHIP = [
  ".kk.",
  "kkkk",
  "kkkk",
  ".kk.",
];

const CHIP_PALETTE = { k: "var(--dark-roast)" };

/** A tiny chocolate-chip pixel — used as a cute accent dotting the "j" in the JavaChip wordmark. */
export function PixelChocolateChip({ className, pixelSize = 3 }: { className?: string; pixelSize?: number }) {
  return <PixelArt sprite={CHOC_CHIP} palette={CHIP_PALETTE} pixelSize={pixelSize} className={className} />;
}
