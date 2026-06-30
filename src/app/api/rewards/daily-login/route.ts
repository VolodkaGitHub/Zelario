import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { COOKIE_NAME, REWARD_AMOUNT, getToday, hasClaimedToday } from "../_lib";

export async function GET() {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const tokenId = headerStore.get("Authorization")?.slice(7).trim() ?? "";
  const today = getToday();
  const lastClaimDate = cookieStore.get(COOKIE_NAME)?.value ?? null;

  const eligible = lastClaimDate !== today && !hasClaimedToday(tokenId);

  return NextResponse.json({
    success: true,
    eligible,
    lastClaimDate,
    rewardAmount: REWARD_AMOUNT,
  });
}
