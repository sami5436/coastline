"use client";

import { useState } from "react";
import { savePlan } from "@/app/actions";
import type { Plan } from "@/lib/coast";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

function newId() {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

type Status = "idle" | "shared" | "copied" | "error";

export function ShareButton({ plan, title }: { plan: Plan; title: string }) {
  const [showAmounts, setShowAmounts] = useState(false);
  // A link is a snapshot of one plan, so it is only shown while that plan is on screen.
  const snapshot = JSON.stringify([plan, showAmounts]);
  const [made, setMade] = useState<{ snapshot: string; link: string; status: Status } | null>(null);
  const current = made?.snapshot === snapshot ? made : null;

  function share() {
    const url = `${location.origin}/p/${newId()}`;
    const saved = savePlan(url.split("/").pop()!, plan, showAmounts);
    const done = (status: Status) => setMade({ snapshot, link: url, status });

    // Safari only allows the share sheet and clipboard during the tap itself,
    // so both start before waiting on the save.
    const opened = navigator.share
      ? navigator.share({ title, url }).then(
          () => "shared" as const,
          (e: Error) => (e.name === "AbortError" ? ("idle" as const) : copy(url)),
        )
      : copy(url);

    Promise.all([saved, opened])
      .then(([ok, next]) => done(ok ? next : "error"))
      .catch(() => done("error"));
  }

  function copy(url: string) {
    return navigator.clipboard.writeText(url).then(
      () => "copied" as const,
      () => "idle" as const,
    );
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          type="button"
          onClick={share}
          className="rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-opacity active:opacity-70"
        >
          Share my result
        </button>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={showAmounts}
            onChange={(e) => setShowAmounts(e.target.checked)}
            className="size-4 accent-fg"
          />
          Show dollar amounts
        </label>
      </div>
      {current && current.status !== "idle" && (
        <p className="mt-3 text-sm text-muted" aria-live="polite">
          {current.status === "error" ? (
            "Could not save that link. Try again."
          ) : (
            <>
              {current.status === "copied" ? "Link copied: " : "Shared: "}
              <a href={current.link} className="break-all text-fg underline underline-offset-4">
                {current.link.replace(/^https?:\/\//, "")}
              </a>
            </>
          )}
        </p>
      )}
    </div>
  );
}
