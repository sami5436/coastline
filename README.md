# Coastline

When can you stop saving for retirement?

Coastline finds your coast age: the first age where you can stop adding money and still reach your retirement number on investment growth alone. Instead of assuming a flat 7% a year, it replays your plan through every stretch of the US stock market since 1928, crashes included, after inflation.

## How the math works

1. Your target is yearly retirement spending divided by your withdrawal rate (4% by default).
2. Each historical window the length of your horizon is one test. Starting in 1929, 1966, 2000 and every other year gives a different real path.
3. Your coast number is what you need invested today so the target is reached in your chosen share of windows (90% by default).
4. Your coast age is the first year of saving after which the plan clears that bar with no more contributions.

Returns blend the S&P 500 with dividends and 10 year Treasuries, rebalanced yearly, all adjusted by CPI. Data from Aswath Damodaran at NYU Stern covers 1928 to 2025. The engine lives in `lib/coast.ts`.

## Sharing

Results can be shared as a link. Each link is a saved snapshot in Neon Postgres with a preview card made for iMessage. Dollar amounts stay hidden unless you choose to show them.

## Running it

```bash
npm install
echo 'DATABASE_URL="postgres://..."' > .env.local
npm run dev
```

The database needs one table:

```sql
CREATE TABLE plans (
  id text PRIMARY KEY,
  inputs jsonb NOT NULL,
  show_amounts boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

Built with Next.js, Neon, and Vercel. Not financial advice.
