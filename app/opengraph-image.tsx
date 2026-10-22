import { DEFAULT_PLAN, runPlan } from "@/lib/coast";
import { OG_SIZE, ogCard } from "@/lib/og";

export const alt = "Coastline: when can you stop saving for retirement?";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    title: "When can you stop saving for retirement?",
    subtitle: "Tested against every stock market since 1928.",
    result: runPlan(DEFAULT_PLAN),
  });
}
