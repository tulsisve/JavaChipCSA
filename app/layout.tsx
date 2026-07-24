import type { Metadata } from "next";
import { Cormorant_Garamond, Pixelify_Sans, Inter, JetBrains_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";

// Readable pixel font — used for every heading and UI label so the whole
// interface reads "pixelated" without hurting legibility. Body copy stays
// in Inter (loaded below) so long-form reading is still comfortable.
const pixelify = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Chunky arcade font, reserved for the logo wordmark and tiny accents only.
const pixel = Press_Start_2P({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://javachip.app"),
  title: {
    default: "JavaChip — Java finally clicks.",
    template: "%s | JavaChip",
  },
  description:
    "Master AP Computer Science A through detailed lessons, syntax drills, original exam-style MCQs, guided FRQ breakdowns, and personalized review. Sip. Study. Compile.",
  openGraph: {
    title: "JavaChip — Java finally clicks.",
    description:
      "A cozy, detailed AP Computer Science A study platform: lessons, syntax drills, MCQs, FRQ breakdowns, and classrooms.",
    siteName: "JavaChip",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${pixelify.variable} ${cormorant.variable} ${inter.variable} ${jetbrainsMono.variable} ${pixel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
