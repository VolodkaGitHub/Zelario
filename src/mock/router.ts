import { ok, type MockBody } from "./utils";

type Handler = (
  method: string,
  url: string,
  body?: MockBody
) => { data: unknown; status: number; statusText: string } | null;

let handlerCache: Handler[] | null = null;

async function loadHandlers(): Promise<Handler[]> {
  if (handlerCache) return handlerCache;
  const [user, admin, communityAdmin] = await Promise.all([
    import("./handlers/user"),
    import("./handlers/admin"),
    import("./handlers/community-admin"),
  ]);
  handlerCache = [
    user.handleUserApi,
    admin.handleAdminApi,
    communityAdmin.handleCommunityAdminApi,
  ];
  return handlerCache;
}

/**
 * Mock API router — mirrors backend routes with realistic response shapes.
 * Handlers are loaded on first request to keep dev compilations smaller per route.
 */
export async function handleMockRequest(
  method: string,
  url: string,
  body?: MockBody
): Promise<{ data: unknown; status: number; statusText: string }> {
  const handlers = await loadHandlers();

  for (const handler of handlers) {
    const result = handler(method, url, body);
    if (result) return result;
  }

  if (url.startsWith("/api/wallet")) {
    return ok({ success: true, message: "Wallet saved (demo)" });
  }

  const m = method.toUpperCase();
  if (m === "GET") {
    return ok({ success: true, data: {}, message: "Demo: no specific handler" });
  }
  return ok({ success: true, message: "Demo: action simulated" });
}
