import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { COOKIE_NAME, COOKIE_MAX_AGE, REWARD_AMOUNT, getToday, hasClaimedToday, recordClaim } from "../../_lib";

export async function POST() {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);
  const tokenId = headerStore.get("Authorization")?.slice(7).trim() ?? "";
  const today = getToday();

  if (cookieStore.get(COOKIE_NAME)?.value === today || hasClaimedToday(tokenId)) {
    return NextResponse.json(
      { success: false, message: "Reward already claimed today" },
      { status: 409 }
    );
  }

  recordClaim(tokenId);

  const response = NextResponse.json({
    success: true,
    message: "Reward claimed successfully",
    rewardAmount: REWARD_AMOUNT,
    claimDate: today,
  });

  response.cookies.set(COOKIE_NAME, today, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
  });

  return response;
}
