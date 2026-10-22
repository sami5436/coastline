const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const usdCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});

const plain = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export const money = (n: number) => usd.format(Math.round(n));
export const moneyShort = (n: number) => usdCompact.format(n);
export const grouped = (n: number) => plain.format(n);
export const percent = (part: number, whole: number) => `${Math.round((part / whole) * 100)}%`;
export const years = (n: number) => `${n} ${n === 1 ? "year" : "years"}`;
