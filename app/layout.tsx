import type { Metadata } from "next";
import Link from "next/link";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coastline",
  description: "Find the age you can stop saving for retirement, tested against every stock market since 1928.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/" className="font-semibold tracking-tight">
            Coastline
          </Link>
          <a
            href="https://github.com/sami5436/coastline"
            className="text-sm text-muted hover:text-fg"
          >
            Source
          </a>
        </header>
        {children}
      </body>
    </html>
  );
}
