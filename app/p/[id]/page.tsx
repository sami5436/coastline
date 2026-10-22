import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ResultView } from "@/components/result-view";
import { getSharedResult } from "@/lib/plans";
import { shareText } from "@/lib/share-text";

export async function generateMetadata({ params }: PageProps<"/p/[id]">): Promise<Metadata> {
  const { id } = await params;
  const shared = await getSharedResult(id);
  if (!shared) return { title: "Plan not found" };
  const { title, description } = shareText(shared.result);
  return {
    title,
    description,
    openGraph: { title, description, url: `/p/${id}` },
    twitter: { title, description },
  };
}

async function SharedPlan({ params }: Pick<PageProps<"/p/[id]">, "params">) {
  const { id } = await params;
  const shared = await getSharedResult(id);
  if (!shared) notFound();

  return (
    <>
      <p className="mb-4 text-sm text-muted">A shared Coastline plan</p>
      <ResultView result={shared.result} amounts={shared.showAmounts} />
    </>
  );
}

export default function SharedPlanPage(props: PageProps<"/p/[id]">) {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 pt-8 pb-20 sm:px-6 sm:pt-14">
      <Suspense fallback={<p className="text-muted">Loading plan…</p>}>
        <SharedPlan params={props.params} />
      </Suspense>
      <div className="mt-14 border-t border-line pt-8">
        <h2 className="text-xl font-semibold">When can you stop saving?</h2>
        <p className="mt-2 text-muted">
          Run your own numbers against every stock market since 1928.
        </p>
        <Link
          href="/"
          className="mt-5 inline-block rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg"
        >
          Find my coast age
        </Link>
      </div>
    </main>
  );
}
