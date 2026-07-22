import Link from "next/link";
import { RainBackdrop } from "@/components/layout/RainBackdrop";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-espresso">
      <div className="lamp-glow absolute inset-0" />
      <RainBackdrop />
      <header className="relative z-10 px-6 py-6 sm:px-10">
        <Link href="/" className="inline-flex items-baseline gap-1 text-2xl">
          <span className="font-display font-semibold text-warm-cream">Java</span>
          <span className="font-mono text-amber">Chip</span>
        </Link>
      </header>
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
