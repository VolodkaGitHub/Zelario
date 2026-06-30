import type { DailyLoginStatus, ClaimResult } from "@/types/rewards/rewards.types";
import { USER_API_ROUTES } from "@/routes/api.routes";

export type { DailyLoginStatus, ClaimResult };

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

async function call<T>(
  path: string,
  token: string,
  init: RequestInit = {}
): Promise<ServiceResponse<T>> {
  try {
    const requestHeaders: Record<string, string> = {
      ...(init.headers as Record<string, string>),
      Authorization: `Bearer ${token}`,
    };
    if (init.body !== undefined) {
      requestHeaders["Content-Type"] = "application/json";
    }

    const res = await fetch(path, { ...init, headers: requestHeaders });

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return { success: false, message: res.ok ? "Server returned an unexpected response format" : res.statusText };
    }

    const json = await res.json();
    if (!res.ok) {
      return { success: false, message: json.message ?? res.statusText };
    }
    return { success: true, data: json as T, message: json.message };
  } catch (e) {
    const message = e instanceof SyntaxError
      ? "Server returned an unexpected response format"
      : "Network error";
    return { success: false, message };
  }
}

export const rewardsApiService = {
  getDailyLoginStatus(token: string): Promise<ServiceResponse<DailyLoginStatus>> {
    return call<DailyLoginStatus>(USER_API_ROUTES.DAILY_LOGIN_STATUS, token);
  },

  claimDailyLoginBonus(token: string): Promise<ServiceResponse<ClaimResult>> {
    return call<ClaimResult>(USER_API_ROUTES.DAILY_LOGIN_CLAIM, token, {
      method: "POST",
    });
  },
};
