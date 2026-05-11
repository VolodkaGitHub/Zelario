import type { Store } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";
import { isDemoMode } from "@/lib/demo-mode";
import { HttpError } from "@/lib/http-error";
import { handleMockRequest } from "@/mock/router";

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: RequestConfig;
}

export interface RequestConfig {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  data?: unknown;
  params?: Record<string, string>;
  withCredentials?: boolean;
  _retry?: boolean;
}

let storeInstance: Store<RootState> | null = null;

function buildUrl(path: string, params?: Record<string, string>) {
  if (!params || Object.keys(params).length === 0) return path;
  const qs = new URLSearchParams(params).toString();
  return `${path}?${qs}`;
}

async function request<T>(
  method: string,
  url: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const fullUrl = buildUrl(url, config.params);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...config.headers,
  };

  if (storeInstance) {
    const state = storeInstance.getState() as RootState;
    const adminToken = state?.adminAuth?.token;
    const communityAdminToken = state?.communityAdminAuth?.token;
    let token: string | null = null;

    if (fullUrl.includes("/admin") && !fullUrl.includes("/community-admin")) {
      token = adminToken;
    } else if (fullUrl.includes("/community-admin")) {
      token = communityAdminToken;
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  if (isDemoMode()) {
    const result = await handleMockRequest(
      method,
      fullUrl,
      config.data as Record<string, unknown> | undefined
    );
    return {
      data: result.data as T,
      status: result.status,
      statusText: result.statusText,
      headers: {},
      config: { ...config, url: fullUrl, method },
    };
  }

  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const res = await fetch(`${base}${fullUrl}`, {
    method,
    headers,
    credentials: config.withCredentials ? "include" : "same-origin",
    body:
      config.data !== undefined && method !== "GET"
        ? JSON.stringify(config.data)
        : undefined,
  });

  const text = await res.text();
  let data: T;
  try {
    data = text ? (JSON.parse(text) as T) : ({} as T);
  } catch {
    data = text as unknown as T;
  }

  if (!res.ok) {
    throw new HttpError(
      res.statusText || "Request failed",
      { status: res.status, statusText: res.statusText, data },
      { url: fullUrl, method }
    );
  }

  return {
    data,
    status: res.status,
    statusText: res.statusText,
    headers: {},
    config: { ...config, url: fullUrl, method },
  };
}

const api = {
  get: <T>(url: string, config?: RequestConfig) =>
    request<T>("GET", url, config),
  post: <T>(url: string, data?: unknown, config?: RequestConfig) =>
    request<T>("POST", url, { ...config, data }),
  put: <T>(url: string, data?: unknown, config?: RequestConfig) =>
    request<T>("PUT", url, { ...config, data }),
  patch: <T>(url: string, data?: unknown, config?: RequestConfig) =>
    request<T>("PATCH", url, { ...config, data }),
  delete: <T>(url: string, config?: RequestConfig) =>
    request<T>("DELETE", url, config),
  interceptors: {
    request: { use: () => undefined },
    response: { use: () => undefined },
  },
};

export const setupAxiosInterceptors = (store: Store<RootState>) => {
  storeInstance = store;
};

export default api;
