import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

import "./globals.css";

// Sora font beállítása
const sora = Sora({ subsets: ["latin"], display: 'swap', preload: true });

export const metadata: Metadata = {
  title: "Artist Cave Studio | Prémium Barbershop",
  description: "Ahol a stílus és a művészet találkozik. Prémium haj- és szakállápolás.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <SpeedInsights />
      <Analytics />
      {/* Itt cseréltük a class-t a sora.className-re */}
      <body className={sora.className}>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}