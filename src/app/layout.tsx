import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import Logo from "@/components/ui/logo";
import { Terminal } from "lucide-react";
import { AuthButton } from "@/components/auth-button";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Codex Open",
  description: "Codex Open",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
        <div className="grid min-h-dvh grid-rows-[auto_1fr_auto] w-full">
          <header className="sticky top-0 flex h-12 w-full items-center justify-between p-4">
            <Link href="/"> <Logo icon={Terminal} text="Codex Open" /> </Link>
            <div>
              <AuthButton size="icon" />
            </div>
          </header>

          <main className="">
            {children}
          </main>

          <footer className="flex h-10 w-full items-center justify-between p-3">
            {/* Footer */}
          </footer>
        </div> 
        </Providers>
      </body>
    </html>
  );
}
