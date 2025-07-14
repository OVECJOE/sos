import type { Metadata } from "next";
import { Geist_Mono, Abhaya_Libre } from "next/font/google";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const abhayaLibre = Abhaya_Libre({
  variable: "--font-abhaya-libre",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SoS - Social Scoring for Meetings",
  description: "Build trust and accountability in online meetings with public social scores.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistMono.variable} ${abhayaLibre.variable} antialiased`}
      >
        <Suspense fallback={<Spinner size="lg" variant="purple" className="mx-auto" />}>
          <SessionProvider>
            {children}
          </SessionProvider>
        </Suspense>
      </body>
    </html>
  );
}
