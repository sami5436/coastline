import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Geist } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, baseOpenGraph, baseTwitter } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME}: when can you stop saving?`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  appleWebApp: { title: SITE_NAME, statusBarStyle: "default" },
  openGraph: {
    ...baseOpenGraph,
    title: "When can you stop saving for retirement?",
    description: SITE_DESCRIPTION,
    url: "/",
  },
  twitter: {
    ...baseTwitter,
    title: "When can you stop saving for retirement?",
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
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
