import type { Result } from "./coast";
import { FIRST_YEAR } from "./returns";
import { percent } from "./format";

// The words used for link previews: the page title, iMessage card, and OG image.
export function shareText(result: Result) {
  const { plan, saveYears, coastAge, successes, periods } = result;
  const title =
    saveYears === 0
      ? "I can stop saving for retirement now"
      : coastAge !== null
        ? `I can stop saving at ${coastAge}`
        : `Not coasting yet, retiring at ${plan.retireAge}`;
  const summary = `Retire at ${plan.retireAge}. Works in ${percent(successes, periods.length)} of markets since ${FIRST_YEAR}.`;
  return {
    title,
    summary,
    description: `${summary} Find the age you can stop saving with Coastline.`,
  };
}
