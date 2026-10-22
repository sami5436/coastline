import { FIRST_YEAR, LAST_YEAR } from "@/lib/returns";
import { Calculator } from "./calculator";

const steps = [
  {
    title: "What coasting means",
    body: "You have invested enough that growth alone carries you to retirement. You still work to cover today, but you can stop saving for later.",
  },
  {
    title: "Real markets, not a flat 7%",
    body: `Most calculators assume smooth returns. Coastline replays your plan through every stretch of the market since ${FIRST_YEAR}, crashes and all, after inflation.`,
  },
  {
    title: "Your coast age",
    body: "The first age where you can stop saving and still hit your target in enough of history. You pick how much: 90% is the default.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6">
      <section className="pt-10 pb-12 sm:pt-16 sm:pb-16">
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
          When can you stop saving for retirement?
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Enter your numbers. Coastline tests them against every stock market since {FIRST_YEAR}{" "}
          and finds the age you can stop.
        </p>
      </section>

      <Calculator />

      <section className="mt-24 border-t border-line pt-10">
        <h2 className="text-xl font-semibold">How it works</h2>
        <div className="mt-6 grid gap-8 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.title}>
              <h3 className="font-medium">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-xs leading-relaxed text-muted">
          Stocks are the S&amp;P 500 with dividends. Bonds are 10 year Treasuries. Rebalanced
          yearly, adjusted for inflation, data from {FIRST_YEAR} to {LAST_YEAR} by Aswath Damodaran
          at NYU Stern. Savings are assumed to rise with inflation. Past markets do not guarantee
          future ones, and this is not financial advice.
        </p>
      </section>
    </main>
  );
}
