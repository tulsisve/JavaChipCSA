import Link from "next/link";
import { RainBackdrop } from "@/components/layout/RainBackdrop";
import { BokehLights } from "@/components/layout/BokehLights";
import { PixelWordmark } from "@/components/layout/PixelWordmark";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-espresso">
      <div className="lamp-glow absolute inset-0" />
      <BokehLights />
      <RainBackdrop />
      <header className="relative z-10 px-6 py-6 sm:px-10">
        <Link href="/" className="group inline-flex items-center transition-transform hover:-translate-y-0.5">
          <PixelWordmark size="md" />
        </Link>
      </header>
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <div className="wood-surface absolute inset-x-0 bottom-0 h-3 bg-cafe-wood/70" aria-hidden="true" />
    </div>
  );
}
