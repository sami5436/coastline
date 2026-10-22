"use client";

import { useState } from "react";
import type { Period } from "@/lib/coast";
import { moneyShort, percent } from "@/lib/format";

export function StartYearChart({
  periods,
  target,
  amounts,
}: {
  periods: Period[];
  target: number;
  amounts: boolean;
}) {
  const [active, setActive] = useState<number | null>(null);
  const n = periods.length;
  const top = Math.max(1.25, ...periods.map((p) => p.final / target)) * 1.05;
  const targetY = (1 / top) * 100;
  const mid = periods[Math.floor(n / 2)];
  const shown = active === null ? null : periods[active];

  const pick = (e: React.PointerEvent<HTMLDivElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const i = Math.floor(((e.clientX - box.left) / box.width) * n);
    setActive(Math.min(n - 1, Math.max(0, i)));
  };

  return (
    <figure>
      <div className="mb-3 flex min-h-10 items-end justify-between gap-4 text-sm" aria-live="polite">
        {shown ? (
          <p>
            <span className="font-medium tabular-nums">
              {shown.start} to {shown.end}
            </span>
            <span className="text-muted">
              {" "}
              ends at {percent(shown.final, target)} of target
              {amounts && <> ({moneyShort(shown.final)})</>}.
            </span>
          </p>
        ) : (
          <p className="text-muted">Tap or hover a bar to see that year.</p>
        )}
      </div>

      <div
        className="relative h-48 touch-pan-y select-none sm:h-56"
        onPointerMove={pick}
        onPointerDown={pick}
        onPointerLeave={() => setActive(null)}
        aria-hidden
      >
        <svg
          viewBox={`0 0 ${n * 10} 100`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          {periods.map((p, i) => {
            const h = Math.max(0.6, (p.final / target / top) * 100);
            return (
              <rect
                key={p.start}
                x={i * 10 + 1.5}
                width={7}
                y={100 - h}
                height={h}
                className={p.ok ? "fill-fg" : "fill-miss"}
                opacity={active === null || active === i ? 1 : 0.35}
              />
            );
          })}
        </svg>
        <div
          className="pointer-events-none absolute inset-x-0 border-t border-fg"
          style={{ bottom: `${targetY}%` }}
        >
          <span className="absolute right-0 -top-5 bg-bg pl-1.5 text-xs text-muted">
            Target {amounts ? moneyShort(target) : ""}
          </span>
        </div>
      </div>

      <div className="mt-2 flex justify-between text-xs tabular-nums text-muted">
        <span>{periods[0].start}</span>
        <span>{mid.start}</span>
        <span>{periods[n - 1].start}</span>
      </div>

      <figcaption className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-fg" /> Reached target
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-miss" /> Fell short
        </span>
        <span>Bars are start years</span>
      </figcaption>

      <table className="sr-only">
        <caption>Outcome by start year</caption>
        <thead>
          <tr>
            <th>Start year</th>
            <th>Percent of target</th>
            <th>Reached</th>
          </tr>
        </thead>
        <tbody>
          {periods.map((p) => (
            <tr key={p.start}>
              <td>{p.start}</td>
              <td>{percent(p.final, target)}</td>
              <td>{p.ok ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
