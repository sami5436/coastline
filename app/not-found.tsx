import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 pt-16 pb-20 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Nothing here.</h1>
      <p className="mt-3 text-muted">This link may be mistyped, or the plan never existed.</p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg"
      >
        Find my coast age
      </Link>
    </main>
  );
}
