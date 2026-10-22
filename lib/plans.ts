import { neon } from "@neondatabase/serverless";
import { cacheLife } from "next/cache";
import { runPlan, sanitize, type Plan } from "./coast";

export const ID_PATTERN = /^[A-Za-z0-9]{8}$/;

export function sql() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  return neon(process.env.DATABASE_URL);
}

export type SharedPlan = { plan: Plan; showAmounts: boolean };

// Shared plans never change after they are created, so cache them for good.
export async function getSharedPlan(id: string): Promise<SharedPlan | null> {
  "use cache";
  cacheLife("max");
  if (!ID_PATTERN.test(id)) return null;
  const rows = await sql()`SELECT inputs, show_amounts FROM plans WHERE id = ${id}`;
  if (!rows[0]) return null;
  return { plan: sanitize(rows[0].inputs), showAmounts: rows[0].show_amounts === true };
}

export async function getSharedResult(id: string) {
  const shared = await getSharedPlan(id);
  return shared && { ...shared, result: runPlan(shared.plan) };
}
