"use server";

import { sanitize } from "@/lib/coast";
import { ID_PATTERN, sql } from "@/lib/plans";

// The id comes from the browser so the share sheet can open inside the tap,
// before this round trip finishes. Existing ids are never overwritten.
export async function savePlan(id: string, input: unknown, showAmounts: boolean) {
  if (!ID_PATTERN.test(id)) return false;
  const plan = sanitize(input);
  const rows = await sql()`
    INSERT INTO plans (id, inputs, show_amounts)
    VALUES (${id}, ${JSON.stringify(plan)}::jsonb, ${showAmounts === true})
    ON CONFLICT (id) DO NOTHING
    RETURNING id`;
  return rows.length === 1;
}
