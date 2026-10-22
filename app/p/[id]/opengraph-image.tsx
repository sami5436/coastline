import { getSharedResult } from "@/lib/plans";
import { shareText } from "@/lib/share-text";
import { OG_SIZE, ogCard } from "@/lib/og";
import { DEFAULT_PLAN, runPlan } from "@/lib/coast";

export const alt = "A Coastline retirement plan";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shared = await getSharedResult(id);
  if (!shared) {
    return ogCard({
      title: "When can you stop saving?",
      subtitle: "Find your coast age with Coastline.",
      result: runPlan(DEFAULT_PLAN),
    });
  }
  const { title, summary } = shareText(shared.result);
  return ogCard({ title, subtitle: summary, result: shared.result });
}
