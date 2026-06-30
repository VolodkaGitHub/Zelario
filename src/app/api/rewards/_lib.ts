export { REWARD_AMOUNT } from "@/contants/rewards";
export const COOKIE_NAME = "zelario_dlb_last_claim";
export const COOKIE_MAX_AGE = 60 * 60 * 24;

export function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

let mapDay = "";
const claimedToday = new Set<string>();

function refreshIfNewDay(): void {
  const today = getToday();
  if (today !== mapDay) {
    claimedToday.clear();
    mapDay = today;
  }
}

export function hasClaimedToday(tokenId: string): boolean {
  refreshIfNewDay();
  return claimedToday.has(tokenId);
}

export function recordClaim(tokenId: string): void {
  refreshIfNewDay();
  claimedToday.add(tokenId);
}
