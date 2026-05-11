import {
  demoAdmin,
  demoUser,
  demoUsers,
  demoCommunities,
  demoDashboardStats,
  demoCommunityRequests,
  demoAdminDexPayments,
  demoMarketCoins,
  demoPosts,
} from "../data/fixtures";
import { mockStore } from "../store";
import {
  ok,
  fail,
  pathOnly,
  queryOf,
  matchPath,
  paginate,
  successData,
  successMessage,
  type MockBody,
  type MockResult,
} from "../utils";

export function handleAdminApi(
  method: string,
  url: string,
  body?: MockBody
): MockResult | null {
  const path = pathOnly(url);
  const q = queryOf(url);
  const m = method.toUpperCase();

  if (!path.startsWith("/api/admin")) return null;

  // Auth
  if (m === "POST" && path === "/api/admin/login") {
    if (body?.email === "admin@zelario.demo" && body?.password === "admin123") {
      return ok({
        success: true,
        admin: demoAdmin,
        accessToken: "demo-admin-token",
        message: "Admin login successful",
      });
    }
    fail("Invalid admin credentials", 401);
  }

  if (m === "POST" && path === "/api/admin/refresh-token") {
    return ok({ success: true, accessToken: "demo-admin-token" });
  }

  if (m === "POST" && path === "/api/admin/logout") {
    return ok(successMessage("Logged out"));
  }

  if (m === "GET" && path === "/api/admin/profile") {
    return ok({ success: true, admin: demoAdmin, data: demoAdmin });
  }

  if (m === "POST" && path === "/api/admin/change-password") {
    return ok(successMessage("Password changed"));
  }

  if (m === "POST" && path === "/api/admin/forgot-password") {
    return ok(successMessage("Reset code sent"));
  }

  if (m === "POST" && path === "/api/admin/verify-forgot-password-otp") {
    return ok(successMessage("OTP verified"));
  }

  if (m === "POST" && path === "/api/admin/reset-password") {
    return ok(successMessage("Password reset"));
  }

  if (m === "GET" && path === "/api/admin/dashboard/stats") {
    return ok(successData(demoDashboardStats));
  }

  // Users
  if (path === "/api/admin/users" && m === "GET") {
    const page = Number(q.get("page") ?? 1);
    const limit = Number(q.get("limit") ?? 10);
    const search = (q.get("search") ?? "").toLowerCase();
    let users = demoUsers.map((u) => ({
      ...u,
      isBanned: false,
      isBlocked: false,
    }));
    if (search) {
      users = users.filter(
        (u) =>
          u.username.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search)
      );
    }
    const p = paginate(users, page, limit);
    return ok({
      success: true,
      data: p.items,
      users: p.items,
      total: p.total,
      totalPages: p.totalPages,
      page: p.page,
      limit: p.limit,
    });
  }

  const userById = matchPath("/api/admin/users/:id", path);
  if (userById && m === "GET" && !path.includes("referrals")) {
    const u = demoUsers.find((x) => x._id === userById.id) ?? mockStore.currentUser;
    return ok({ success: true, user: u, data: u });
  }

  if (userById && m === "PATCH" && !path.includes("/ban")) {
    return ok({ success: true, user: mockStore.currentUser });
  }

  const userBan = matchPath("/api/admin/users/:id/ban", path);
  if (userBan && m === "PATCH") {
    return ok({ success: true, user: { ...mockStore.currentUser, isBanned: body?.isBanned } });
  }

  const userReferrals = matchPath("/api/admin/users/:id/referrals", path);
  if (userReferrals && m === "GET") {
    return ok({ success: true, referrals: demoUsers.slice(1), total: 2 });
  }

  const userPoints = matchPath("/api/admin/users/:id/points-history", path);
  if (userPoints && m === "GET") {
    return ok({ success: true, data: [], history: [] });
  }

  const userCheckins = matchPath("/api/admin/users/:id/checkin-history", path);
  if (userCheckins && m === "GET") {
    return ok({ success: true, data: [] });
  }

  const userStats = matchPath("/api/admin/users/:id/stats", path);
  if (userStats && m === "GET") {
    return ok({
      success: true,
      data: { posts: 5, referrals: 2, points: 1250 },
    });
  }

  // Community requests
  if (path === "/api/admin/community-requests" && m === "GET") {
    return ok({
      success: true,
      data: demoCommunityRequests,
      total: demoCommunityRequests.length,
      page: 1,
      totalPages: 1,
    });
  }

  const reqById = matchPath("/api/admin/community-requests/:id", path);
  if (reqById && m === "GET") {
    const req = demoCommunityRequests.find((r) => r._id === reqById.id);
    return ok({ success: true, data: req ?? demoCommunityRequests[0] });
  }

  if (reqById && path.endsWith("/approve") && m === "PATCH") {
    return ok({ success: true, message: "Approved", request: demoCommunityRequests[0] });
  }

  if (reqById && path.endsWith("/reject") && m === "PATCH") {
    return ok({ success: true, message: "Rejected" });
  }

  // Community management
  if (path === "/api/admin/community-management/communities" && m === "GET") {
    return ok({
      success: true,
      data: demoCommunities,
      communities: demoCommunities,
      total: demoCommunities.length,
    });
  }

  const commMgmt = matchPath(
    "/api/admin/community-management/communities/:id",
    path
  );
  if (commMgmt && m === "GET" && !path.includes("members") && !path.includes("settings")) {
    const c = demoCommunities.find((x) => x._id === commMgmt.id);
    return ok({ success: true, community: c, data: c });
  }

  const commMembers = matchPath(
    "/api/admin/community-management/communities/:id/members",
    path
  );
  if (commMembers && m === "GET") {
    return ok({ success: true, data: [], members: [] });
  }

  // Wallets
  if (path === "/api/admin/wallets" && m === "GET") {
    return ok({
      success: true,
      data: [
        {
          address: "0xDemo0000000000000000000000000000000001",
          balance: "1.25",
          userId: demoUser._id,
        },
      ],
      wallets: [],
      total: 1,
      page: 1,
      totalPages: 1,
    });
  }

  if (path === "/api/admin/wallets/stats" && m === "GET") {
    return ok({ success: true, data: { totalWallets: 1, totalVolume: 12500 } });
  }

  const walletAddr = matchPath("/api/admin/wallets/:address", path);
  if (walletAddr && m === "GET") {
    return ok({
      success: true,
      data: { address: walletAddr.address, balance: "1.25 ETH" },
    });
  }

  // DEX admin
  if (path === "/api/admin/dex/payments" && m === "GET") {
    const page = Number(q.get("page") ?? 1);
    const limit = Number(q.get("limit") ?? 10);
    const p = paginate(demoAdminDexPayments, page, limit);
    return ok({
      success: true,
      data: p.items,
      payments: p.items,
      total: p.total,
      totalPages: p.totalPages,
      page: p.page,
    });
  }

  if (path === "/api/admin/dex/stats" && m === "GET") {
    return ok({
      success: true,
      data: { totalPayments: 2, pending: 1, completed: 1, volumeUSD: 150 },
    });
  }

  if (path === "/api/admin/dex/pending" && m === "GET") {
    return ok({
      success: true,
      data: demoAdminDexPayments.filter((p) => p.status === "pending"),
    });
  }

  if (
    path.includes("/dex/approve-payment") ||
    path.includes("/dex/reject-payment") ||
    path.includes("/dex/fulfill-payment")
  ) {
    return ok({ success: true, message: "Payment updated (demo)" });
  }

  // Market
  if (path === "/api/admin/market/coins" && m === "GET") {
    return ok({ success: true, coins: demoMarketCoins, data: demoMarketCoins });
  }

  const marketCoin = matchPath("/api/admin/market/coins/:address", path);
  if (marketCoin && m === "GET") {
    return ok({ success: true, coin: demoMarketCoins[0] });
  }

  // Community posts admin
  if (path === "/api/admin/community-posts" && m === "GET") {
    return ok({
      success: true,
      data: mockStore.posts,
      posts: mockStore.posts,
      total: mockStore.posts.length,
    });
  }

  const adminPost = matchPath("/api/admin/community-posts/:postId", path);
  if (adminPost && m === "GET") {
    const post = mockStore.posts.find((p) => p._id === adminPost.postId);
    return ok({ success: true, data: post });
  }

  // Points conversion admin
  if (path.startsWith("/api/admin/points-conversion")) {
    if (path.includes("/rate/current") && m === "GET") {
      return ok({ success: true, data: { rate: 100, claimFeeETH: "0.001" } });
    }
    if (m === "GET") {
      return ok({ success: true, data: [], total: 0 });
    }
    return ok({ success: true, message: "Updated (demo)" });
  }

  return null;
}
