import { RETURNS } from "./returns";

// All dollar amounts are in today's dollars. The engine works in real
// (inflation adjusted) returns, so savings are assumed to rise with inflation.
export type Plan = {
  age: number;
  retireAge: number;
  invested: number;
  spending: number; // per year in retirement
  monthly: number; // saved per month until you coast
  stocks: number; // percent in stocks, the rest in 10 year Treasuries
  withdrawal: number; // safe withdrawal rate, percent
  confidence: number; // percent of historical periods the plan must survive
};

export const DEFAULT_PLAN: Plan = {
  age: 27,
  retireAge: 60,
  invested: 60000,
  spending: 50000,
  monthly: 1500,
  stocks: 90,
  withdrawal: 4,
  confidence: 90,
};

export const CONFIDENCE_LEVELS = [50, 75, 90, 95] as const;

// Long horizons leave too few historical windows to mean anything.
export const MAX_HORIZON = 60;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

function num(value: unknown, fallback: number) {
  const n = typeof value === "string" ? Number(value) : value;
  return typeof n === "number" && Number.isFinite(n) ? n : fallback;
}

// Accepts anything (form state, JSON from the database, a request body) and
// returns a plan the engine can always run.
export function sanitize(input: unknown): Plan {
  const raw = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const d = DEFAULT_PLAN;
  const age = Math.round(clamp(num(raw.age, d.age), 16, 79));
  const retireAge = Math.round(
    clamp(num(raw.retireAge, d.retireAge), age + 1, Math.min(85, age + MAX_HORIZON)),
  );
  const confidence = num(raw.confidence, d.confidence);
  return {
    age,
    retireAge,
    invested: Math.round(clamp(num(raw.invested, d.invested), 0, 1e9)),
    spending: Math.round(clamp(num(raw.spending, d.spending), 1000, 1e8)),
    monthly: Math.round(clamp(num(raw.monthly, d.monthly), 0, 1e7)),
    stocks: Math.round(clamp(num(raw.stocks, d.stocks), 0, 100)),
    withdrawal: Math.round(clamp(num(raw.withdrawal, d.withdrawal), 2, 8) * 10) / 10,
    confidence: (CONFIDENCE_LEVELS as readonly number[]).includes(confidence)
      ? confidence
      : d.confidence,
  };
}

export type Period = {
  start: number; // first calendar year of the window
  end: number; // last calendar year of the window
  final: number; // balance at retirement
  ok: boolean; // reached the target
};

export type Result = {
  plan: Plan;
  horizon: number; // years until retirement
  target: number; // the FI number needed at retirement
  coastNumber: number; // needed today to never save again
  saveYears: number | null; // years of saving left; null if never enough
  coastAge: number | null;
  periods: Period[]; // outcome of the plan in every historical window
  successes: number;
  median: number;
  worst: Period;
};

function realReturns(stocks: number) {
  const s = stocks / 100;
  return RETURNS.map(([, stock, bond, cpi]) => (1 + s * stock + (1 - s) * bond) / (1 + cpi) - 1);
}

// Balance at retirement in every window, saving for the first `saveYears`.
function finals(plan: Plan, real: number[], horizon: number, saveYears: number) {
  const yearly = plan.monthly * 12;
  const out: number[] = [];
  for (let i = 0; i + horizon <= real.length; i++) {
    let b = plan.invested;
    for (let t = 0; t < horizon; t++) {
      if (t < saveYears) b += yearly;
      b *= 1 + real[i + t];
    }
    out.push(b);
  }
  return out;
}

const reaches = (final: number, target: number) => final >= target * (1 - 1e-9);

export function runPlan(input: Plan): Result {
  const plan = sanitize(input);
  const horizon = plan.retireAge - plan.age;
  const target = plan.spending / (plan.withdrawal / 100);
  const real = realReturns(plan.stocks);
  const windows = real.length - horizon + 1;
  const needed = Math.ceil((plan.confidence / 100) * windows);

  // Growth of one dollar in each window, best first. The coast number is the
  // amount that still reaches the target in the `needed`th best window.
  const growth = finals({ ...plan, invested: 1, monthly: 0 }, real, horizon, 0).sort(
    (a, b) => b - a,
  );
  const coastNumber = target / growth[needed - 1];

  // More years of saving never lowers a balance, so the first k that works is the answer.
  let saveYears: number | null = null;
  let balances: number[] = [];
  for (let k = 0; k <= horizon; k++) {
    balances = finals(plan, real, horizon, k);
    if (balances.filter((b) => reaches(b, target)).length >= needed) {
      saveYears = k;
      break;
    }
    if (plan.monthly === 0) break;
  }

  const periods = balances.map((final, i) => ({
    start: RETURNS[i][0],
    end: RETURNS[i + horizon - 1][0],
    final,
    ok: reaches(final, target),
  }));
  const sorted = [...balances].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  return {
    plan,
    horizon,
    target,
    coastNumber,
    saveYears,
    coastAge: saveYears === null ? null : plan.age + saveYears,
    periods,
    successes: periods.filter((p) => p.ok).length,
    median: sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2,
    worst: periods.reduce((w, p) => (p.final < w.final ? p : w)),
  };
}
