"use client";

import { useEffect, useMemo, useState } from "react";
import { CONFIDENCE_LEVELS, DEFAULT_PLAN, runPlan, sanitize, type Plan } from "@/lib/coast";
import { NumberField, Segmented } from "@/components/fields";
import { ResultView } from "@/components/result-view";

const STORAGE_KEY = "coastline:plan";
const WITHDRAWAL_RATES = [3, 3.5, 4, 4.5, 5] as const;

export function Calculator() {
  const [plan, setPlan] = useState<Plan>(DEFAULT_PLAN);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setPlan(sanitize(JSON.parse(saved)));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } catch {}
  }, [plan, loaded]);

  const result = useMemo(() => runPlan(plan), [plan]);
  const set = (key: keyof Plan) => (value: number) => setPlan((p) => ({ ...p, [key]: value }));

  return (
    <div className="grid gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16">
      <form className="space-y-5 md:sticky md:top-8 md:self-start" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="Your age" value={plan.age} onChange={set("age")} />
          <NumberField label="Retire at" value={plan.retireAge} onChange={set("retireAge")} />
        </div>
        <NumberField label="Invested now" prefix="$" value={plan.invested} onChange={set("invested")} />
        <NumberField
          label="Yearly spending in retirement"
          prefix="$"
          value={plan.spending}
          onChange={set("spending")}
        />
        <NumberField
          label="Saving each month"
          prefix="$"
          value={plan.monthly}
          onChange={set("monthly")}
        />

        <details className="group rounded-xl border border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm">
            Assumptions
            <span className="text-muted transition-transform group-open:rotate-45">+</span>
          </summary>
          <div className="space-y-5 border-t border-line p-4">
            <div>
              <div className="mb-1.5 flex justify-between text-sm">
                <label htmlFor="stocks" className="text-muted">
                  Stocks vs bonds
                </label>
                <span className="tabular-nums">
                  {plan.stocks}% stocks, {100 - plan.stocks}% bonds
                </span>
              </div>
              <input
                id="stocks"
                type="range"
                min={0}
                max={100}
                step={5}
                value={plan.stocks}
                onChange={(e) => set("stocks")(Number(e.target.value))}
                className="w-full accent-fg"
              />
            </div>
            <Segmented
              label="Withdrawal rate in retirement"
              options={WITHDRAWAL_RATES}
              value={plan.withdrawal as (typeof WITHDRAWAL_RATES)[number]}
              onChange={set("withdrawal")}
              format={(v) => `${v}%`}
            />
            <Segmented
              label="Must work in this share of history"
              options={CONFIDENCE_LEVELS}
              value={plan.confidence as (typeof CONFIDENCE_LEVELS)[number]}
              onChange={set("confidence")}
              format={(v) => `${v}%`}
            />
            <button
              type="button"
              onClick={() => setPlan(DEFAULT_PLAN)}
              className="text-sm text-muted underline underline-offset-4"
            >
              Reset to example
            </button>
          </div>
        </details>
      </form>

      <ResultView result={result} amounts />
    </div>
  );
}
