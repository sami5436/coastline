import type { Metadata } from "next";

export const SITE_NAME = "Coastline";
export const SITE_DESCRIPTION =
  "Find the age you can stop saving for retirement, tested against every stock market since 1928.";

export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

// Pages that set their own openGraph or twitter replace these objects
// instead of merging, so they spread these in.
export const baseOpenGraph = {
  siteName: SITE_NAME,
  type: "website",
  locale: "en_US",
} satisfies Metadata["openGraph"];

export const baseTwitter = { card: "summary_large_image" } satisfies Metadata["twitter"];
