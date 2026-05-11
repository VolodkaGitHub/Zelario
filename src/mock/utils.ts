import { HttpError } from "@/lib/http-error";

export type MockBody = Record<string, unknown> | undefined;

export type MockResult = {
  data: unknown;
  status: number;
  statusText: string;
};

export function ok<T>(data: T, status = 200): MockResult {
  return { data, status, statusText: "OK" };
}

export function fail(message: string, status = 400): never {
  throw new HttpError(message, {
    status,
    statusText: status === 401 ? "Unauthorized" : "Bad Request",
    data: { success: false, error: message, message },
  });
}

export function pathOnly(url: string): string {
  return url.split("?")[0];
}

export function queryOf(url: string): URLSearchParams {
  const i = url.indexOf("?");
  return new URLSearchParams(i >= 0 ? url.slice(i + 1) : "");
}

/** Match `/api/user/posts/:id` style patterns. */
export function matchPath(
  pattern: string,
  path: string
): Record<string, string> | null {
  const pParts = pattern.split("/").filter(Boolean);
  const uParts = path.split("/").filter(Boolean);
  if (pParts.length !== uParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < pParts.length; i++) {
    if (pParts[i].startsWith(":")) {
      params[pParts[i].slice(1)] = uParts[i];
    } else if (pParts[i] !== uParts[i]) {
      return null;
    }
  }
  return params;
}

export function paginate<T>(
  items: T[],
  page: number,
  limit: number
): { items: T[]; total: number; totalPages: number; page: number; limit: number } {
  const p = Math.max(1, page);
  const l = Math.max(1, limit);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / l));
  const start = (p - 1) * l;
  return {
    items: items.slice(start, start + l),
    total,
    totalPages,
    page: p,
    limit: l,
  };
}

export function cursorPaginate<T>(
  items: T[],
  limit: number,
  _cursor?: string
): {
  items: T[];
  hasMore: boolean;
  nextCursor?: string;
  totalCount: number;
} {
  const l = Math.min(Math.max(limit, 1), 50);
  return {
    items: items.slice(0, l),
    hasMore: items.length > l,
    nextCursor: items.length > l ? "demo-cursor-2" : undefined,
    totalCount: items.length,
  };
}

export function successData<T>(data: T) {
  return { success: true, data };
}

/** Paginated list shape used by quest and similar user APIs. */
export function paginatedListResponse<T>(
  items: T[],
  page: number,
  limit: number,
  listKey: "quests" | "items" | "participants" = "quests"
) {
  const p = paginate(items, page, limit);
  return successData({
    [listKey]: p.items,
    pagination: {
      page: p.page,
      limit: p.limit,
      total: p.total,
      pages: p.totalPages,
    },
  });
}

export function successMessage(message: string) {
  return { success: true, message };
}
