"use client";

import { useEffect, useId, useState } from "react";
import { grouped } from "@/lib/format";

const box =
  "flex items-center rounded-xl border border-line bg-bg px-3.5 focus-within:border-fg transition-colors";

export function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  const id = useId();
  const [text, setText] = useState(grouped(value));
  const [focused, setFocused] = useState(false);

  // Follow outside changes (like a reset) without fighting the user mid edit.
  useEffect(() => {
    if (!focused) setText(grouped(value));
  }, [value, focused]);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm text-muted">
        {label}
      </label>
      <div className={box}>
        {prefix && <span className="text-muted">{prefix}</span>}
        <input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          className="w-full min-w-0 bg-transparent py-3 text-base tabular-nums outline-none"
          value={text}
          onFocus={(e) => {
            setFocused(true);
            e.target.select();
          }}
          onBlur={() => setFocused(false)}
          onChange={(e) => {
            const digits = e.target.value.replace(/[^\d]/g, "").slice(0, 10);
            setText(digits ? grouped(Number(digits)) : "");
            if (digits) onChange(Number(digits));
          }}
        />
        {suffix && <span className="text-muted">{suffix}</span>}
      </div>
    </div>
  );
}

export function Segmented<T extends number>({
  label,
  options,
  value,
  onChange,
  format,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  format: (value: T) => string;
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm text-muted">{label}</legend>
      <div className="grid grid-flow-col auto-cols-fr gap-1 rounded-xl border border-line p-1">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === value}
            onClick={() => onChange(option)}
            className="rounded-lg py-2 text-sm tabular-nums transition-colors aria-pressed:bg-fg aria-pressed:text-bg"
          >
            {format(option)}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
