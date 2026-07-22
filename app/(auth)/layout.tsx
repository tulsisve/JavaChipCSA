import Link from "next/link";
import { RainBackdrop } from "@/components/layout/RainBackdrop";
import { BokehLights } from "@/components/layout/BokehLights";
import { SteamCup } from "@/components/layout/SteamCup";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-espresso">
      <div className="lamp-glow absolute inset-0" />
      <BokehLights />
      <RainBackdrop />
      <header className="relative z-10 px-6 py-6 sm:px-10">
        <Link href="/" className="group inline-flex items-center gap-1.5 text-2xl">
          <SteamCup size={30} className="-mb-1 transition-transform group-hover:-translate-y-0.5" />
          <span className="inline-flex items-baseline gap-1">
            <span className="font-display font-semibold text-warm-cream">Java</span>
            <span className="font-mono text-amber">Chip</span>
          </span>
        </Link>
      </header>
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <div className="wood-surface absolute inset-x-0 bottom-0 h-3 bg-cafe-wood/70" aria-hidden="true" />
    </div>
  );
}
