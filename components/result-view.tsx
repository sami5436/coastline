import type { Result } from "@/lib/coast";
import { FIRST_YEAR } from "@/lib/returns";
import { money, percent, years } from "@/lib/format";
import { StartYearChart } from "./start-year-chart";

function headline(r: Result, amounts: boolean) {
  const { plan, saveYears, coastAge, successes, periods, target, coastNumber } = r;
  const odds = `${successes} of ${periods.length} market periods since ${FIRST_YEAR}`;
  const goal = amounts ? money(target) : "the target";

  if (saveYears === 0) {
    return {
      title: "You can stop saving now.",
      body: amounts
        ? `Leave your ${money(plan.invested)} invested and it grows past ${goal} by ${plan.retireAge} in ${odds}.`
        : `No more saving needed. This plan reaches its retirement target by ${plan.retireAge} in ${odds}.`,
    };
  }
  if (coastAge !== null) {
    return {
      title: `Stop saving at ${coastAge}.`,
      body: amounts
        ? `Keep saving ${money(plan.monthly)} a month for ${years(saveYears!)}. After that you never add another dollar, and you still reach ${goal} by ${plan.retireAge} in ${odds}.`
        : `After ${years(saveYears!)} of saving, this plan reaches its retirement target by ${plan.retireAge} in ${odds}.`,
    };
  }
  return {
    title: `Not by ${plan.retireAge} yet.`,
    body: !amounts
      ? `This plan reaches its retirement target in ${odds}.`
      : plan.monthly > 0
        ? `Even saving ${money(plan.monthly)} a month until ${plan.retireAge}, this plan reaches ${goal} in only ${odds}. Save more, spend less, or retire later.`
        : `With no new savings, you reach ${goal} in only ${odds}. You need ${money(coastNumber)} invested to coast today.`,
  };
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted sm:text-sm">{label}</dt>
      <dd className="mt-1 truncate text-lg font-medium tabular-nums sm:text-xl">{value}</dd>
    </div>
  );
}

export function ResultView({ result, amounts }: { result: Result; amounts: boolean }) {
  const { plan, target, coastNumber, successes, periods, worst, median, saveYears, coastAge } =
    result;
  const { title, body } = headline(result, amounts);
  const progress = Math.min(1, plan.invested / coastNumber);

  return (
    <div>
      <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h2>
      <p className="mt-3 text-base leading-relaxed text-muted">{body}</p>

      <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-line py-5">
        {amounts ? (
          <>
            <Stat label="Coast number" value={money(coastNumber)} />
            <Stat label={`Needed at ${plan.retireAge}`} value={money(target)} />
          </>
        ) : (
          <>
            <Stat label="Stop saving at" value={coastAge === null ? "Not yet" : String(coastAge)} />
            <Stat label="Retire at" value={String(plan.retireAge)} />
          </>
        )}
        <Stat label="Worked in" value={percent(successes, periods.length)} />
      </dl>

      {amounts && saveYears !== 0 && (
        <div className="mt-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Progress to coasting today</span>
            <span className="tabular-nums">{percent(progress, 1)}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-soft">
            <div className="h-full rounded-full bg-fg" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      )}

      <section className="mt-10">
        <h3 className="font-medium">Every start year since {FIRST_YEAR}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Each bar replays history from one year. It shows where this plan lands at{" "}
          {plan.retireAge} if the market repeated what it did starting that year.
        </p>
        <div className="mt-5">
          <StartYearChart periods={periods} target={target} amounts={amounts} />
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted">Worst start</dt>
            <dd className="mt-1 tabular-nums">
              {worst.start}, {percent(worst.final, target)} of target
            </dd>
          </div>
          <div>
            <dt className="text-muted">Typical outcome</dt>
            <dd className="mt-1 tabular-nums">
              {amounts ? money(median) : `${percent(median, target)} of target`}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
