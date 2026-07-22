import { cn } from "@/lib/utilities/cn";

/**
 * A minimal line-art coffee cup with rising steam wisps — the closest thing
 * JavaChip has to a mascot, used sparingly as a brand accent. Steam is
 * decorative only (aria-hidden) and disabled under reduced motion via the
 * .steam-wisp animation rules in globals.css.
 */
export function SteamCup({ className, size = 56 }: { className?: string; size?: number }) {
  return (
    <div className={cn("relative inline-flex items-end justify-center", className)} style={{ width: size, height: size }} aria-hidden="true">
      <div className="absolute bottom-[62%] left-[30%] flex gap-2">
        <span className="steam-wisp" style={{ animationDelay: "0s" }} />
        <span className="steam-wisp" style={{ animationDelay: "1.1s", left: 6 }} />
        <span className="steam-wisp" style={{ animationDelay: "0.5s", left: 12 }} />
      </div>
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative text-amber"
      >
        <path d="M14 26h30v18a10 10 0 0 1-10 10H24a10 10 0 0 1-10-10V26Z" />
        <path d="M44 30h4a6 6 0 0 1 0 12h-4" />
        <path d="M20 26c0-4 2-5 2-8s-2-4-2-7" opacity="0.55" />
        <path d="M30 26c0-4 2-5 2-8s-2-4-2-7" opacity="0.55" />
      </svg>
    </div>
  );
}
