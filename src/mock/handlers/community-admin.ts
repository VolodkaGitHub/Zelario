import { DEMO_IMAGES } from "@/lib/demo-images";
import {
  demoCommunityAdmin,
  demoCommunities,
  demoPosts,
  demoQuests,
  demoCommunityMembers,
  demoChainCasts,
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

export function handleCommunityAdminApi(
  method: string,
  url: string,
  body?: MockBody
): MockResult | null {
  const path = pathOnly(url);
  const q = queryOf(url);
  const m = method.toUpperCase();

  if (!path.startsWith("/api/community-admin")) return null;

  // Public onboarding
  if (path === "/api/community-admin/check-email" && m === "GET") {
    return ok({ success: true, exists: false, available: true });
  }

  if (path === "/api/community-admin/check-username" && m === "GET") {
    return ok({ success: true, available: true });
  }

  if (m === "POST" && path === "/api/community-admin/apply") {
    return ok({
      success: true,
      requestId: `req-${Date.now()}`,
      message: "Application submitted",
    });
  }

  if (m === "POST" && path === "/api/community-admin/login") {
    if (
      body?.email === "community@zelario.demo" &&
      body?.password === "community123"
    ) {
      return ok({
        success: true,
        communityAdmin: demoCommunityAdmin,
        accessToken: "demo-ca-token",
        message: "Login successful",
      });
    }
    fail("Invalid credentials", 401);
  }

  if (m === "POST" && path === "/api/community-admin/refresh-token") {
    return ok({ success: true, accessToken: "demo-ca-token" });
  }

  if (m === "POST" && path === "/api/community-admin/logout") {
    return ok(successMessage("Logged out"));
  }

  if (
    m === "POST" &&
    (path.includes("forgot-password") ||
      path.includes("verify-otp") ||
      path.includes("set-password") ||
      path.includes("reset-password") ||
      path.includes("resend-otp") ||
      path === "/api/community-admin/reapply")
  ) {
    return ok(successMessage("OK (demo)"));
  }

  // Profile
  if (m === "GET" && path === "/api/community-admin/profile") {
    return ok(successData({ ...demoCommunityAdmin, ...demoCommunities[0] }));
  }

  if (m === "PUT" && path === "/api/community-admin/profile") {
    return ok(successData({ ...demoCommunityAdmin, ...body }));
  }

  if (
    path.includes("/profile/upload-picture") ||
    path.includes("/profile/upload-banner")
  ) {
    return ok(
      successData({
        url: DEMO_IMAGES.banner,
      })
    );
  }

  if (m === "GET" && path === "/api/community-admin/community-stats") {
    return ok(
      successData({
        memberCount: 1284,
        postCount: 342,
        engagementRate: 78,
        activeMembers: 420,
      })
    );
  }

  if (m === "GET" && path === "/api/community-admin/community") {
    return ok(successData(demoCommunities[0]));
  }

  if (m === "PUT" && path === "/api/community-admin/community") {
    return ok(successData({ ...demoCommunities[0], ...body }));
  }

  if (m === "GET" && path === "/api/community-admin/community/members") {
    return ok(successData({ members: demoCommunityMembers, total: demoCommunityMembers.length }));
  }

  // Dashboard
  if (
    path === "/api/community-admin/dashboard" ||
    path === "/api/community-admin/dashboard/overview" ||
    path === "/api/community-admin/dashboard/stats"
  ) {
    return ok(
      successData({
        members: 1284,
        posts: 342,
        engagement: 78,
        growth: 12,
        recentActivity: [],
      })
    );
  }

  if (m === "GET" && path === "/api/community-admin/engagement-stats") {
    return ok(
      successData({
        likes: 1200,
        comments: 340,
        shares: 89,
        views: 15000,
      })
    );
  }

  // Feed & posts
  if (m === "GET" && path === "/api/community-admin/feed") {
    const page = Number(q.get("page") ?? 1);
    const limit = Number(q.get("limit") ?? 10);
    const p = paginate(mockStore.posts, page, limit);
    return ok({
      success: true,
      data: { posts: p.items, total: p.total, page: p.page },
      posts: p.items,
    });
  }

  if (m === "GET" && path === "/api/community-admin/posts") {
    return ok({ success: true, data: mockStore.posts, posts: mockStore.posts });
  }

  if (m === "POST" && path === "/api/community-admin/posts/create") {
    const post = {
      ...mockStore.posts[0],
      _id: `capost-${Date.now()}`,
      content: String(body?.content ?? ""),
    };
    mockStore.posts.unshift(post);
    return ok(successData(post));
  }

  const caPost = matchPath("/api/community-admin/posts/:postId", path);
  if (caPost && m === "GET") {
    const post = mockStore.posts.find((p) => p._id === caPost.postId);
    return ok(successData(post));
  }

  if (path.includes("/feed/posts/") && path.includes("/like") && m === "POST") {
    return ok(successData({ isLiked: true }));
  }

  if (path.includes("/feed/comments") && m === "POST") {
    return ok(successData({ _id: `comment-${Date.now()}` }));
  }

  if (m === "GET" && path === "/api/community-admin/feed/members") {
    return ok(successData(demoCommunityMembers));
  }

  // Members
  if (m === "GET" && path === "/api/community-admin/members") {
    const page = Number(q.get("page") ?? 1);
    const limit = Number(q.get("limit") ?? 20);
    const p = paginate(demoCommunityMembers, page, limit);
    return ok({
      success: true,
      data: p.items,
      members: p.items,
      total: p.total,
      totalPages: p.totalPages,
    });
  }

  const memberById = matchPath("/api/community-admin/members/:memberId", path);
  if (memberById && m === "GET" && !path.includes("activity")) {
    const member = demoCommunityMembers.find((x) => x._id === memberById.memberId);
    return ok({ success: true, data: member, member });
  }

  if (path === "/api/community-admin/members/role" && m === "PUT") {
    return ok({ success: true, member: demoCommunityMembers[0] });
  }

  if (path === "/api/community-admin/members/ban" && m === "POST") {
    return ok(successMessage("Member banned (demo)"));
  }

  if (path.includes("/members/") && path.includes("/unban") && m === "POST") {
    return ok(successMessage("Member unbanned (demo)"));
  }

  if (path.includes("/members/bulk-update") && m === "POST") {
    return ok(successMessage("Members updated"));
  }

  // Channel chat
  if (path.includes("/community/channel/send") && m === "POST") {
    return ok(
      successData({
        _id: `ch-${Date.now()}`,
        content: body?.content,
        createdAt: new Date().toISOString(),
      })
    );
  }

  if (path.includes("/community/channel/messages") && m === "GET") {
    return ok(
      successData({
        messages: [
          {
            _id: "ca-ch-1",
            content: "Welcome to the community channel (demo)",
            createdAt: new Date().toISOString(),
            pinned: false,
          },
        ],
      })
    );
  }

  if (path.includes("/channel/upload-media") && m === "POST") {
    return ok(successData({ url: DEMO_IMAGES.banner }));
  }

  // Group chat
  if (path.includes("/group-chat/messages") && m === "GET") {
    return ok(successData({ messages: [] }));
  }

  // ChainCast
  if (path === "/api/community-admin/chaincast" && m === "GET") {
    return ok(successData(mockStore.chainCasts));
  }

  if (m === "POST" && path === "/api/community-admin/chaincast/create") {
    const cast = {
      _id: `cast-${Date.now()}`,
      title: String(body?.title ?? "Demo Cast"),
      status: "scheduled",
      communityId: "comm-1",
    };
    mockStore.chainCasts.push(cast as (typeof mockStore.chainCasts)[0]);
    return ok(successData(cast));
  }

  const caCast = matchPath("/api/community-admin/chaincast/:chainCastId", path);
  if (caCast && m === "GET" && !path.includes("participants")) {
    return ok(successData(mockStore.chainCasts[0]));
  }

  if (caCast && path.endsWith("/start") && m === "POST") {
    return ok(successData({ status: "live" }));
  }

  if (caCast && path.endsWith("/end") && m === "POST") {
    return ok(successData({ status: "ended" }));
  }

  if (path === "/api/community-admin/chaincast/analytics" && m === "GET") {
    return ok(
      successData({
        totalViews: 1200,
        peakParticipants: 45,
        avgDuration: 3600,
      })
    );
  }

  // Subscription
  if (path.startsWith("/api/community-admin/subscription")) {
    if (m === "GET") {
      return ok(
        successData({
          plan: "premium",
          status: "active",
          expiresAt: new Date(Date.now() + 30 * 86400_000).toISOString(),
        })
      );
    }
    if (path.includes("create-order") && m === "POST") {
      return ok({
        success: true,
        orderId: `sub_order_${Date.now()}`,
        amount: 12,
        currency: "USD",
      });
    }
    if (path.includes("verify-payment") && m === "POST") {
      return ok({ success: true, message: "Subscription active" });
    }
    if (path.includes("chaincast-access") && m === "GET") {
      return ok(successData({ hasAccess: true }));
    }
    if (path.includes("time-remaining") && m === "GET") {
      return ok(successData({ days: 28, hours: 12 }));
    }
    return ok(successMessage("Subscription updated (demo)"));
  }

  // Quests
  if (path === "/api/community-admin/quests" && m === "GET") {
    return ok(successData(demoQuests));
  }

  if (path === "/api/community-admin/quests/stats" && m === "GET") {
    return ok(
      successData({
        activeQuests: 2,
        totalParticipants: 323,
        completionRate: 67,
      })
    );
  }

  if (m === "POST" && path === "/api/community-admin/quests/create") {
    const quest = {
      ...demoQuests[0],
      _id: `quest-${Date.now()}`,
      title: String(body?.title ?? "New Quest"),
    };
    return ok(successData(quest));
  }

  const caQuest = matchPath("/api/community-admin/quests/:questId", path);
  if (caQuest && m === "GET" && !path.includes("participants") && !path.includes("leaderboard")) {
    const quest = demoQuests.find((q) => q._id === caQuest.questId);
    return ok(successData(quest ?? demoQuests[0]));
  }

  if (caQuest && path.endsWith("/start") && m === "POST") {
    return ok(successData({ status: "active" }));
  }

  if (caQuest && path.endsWith("/end") && m === "POST") {
    return ok(successData({ status: "ended" }));
  }

  if (caQuest && path.includes("/leaderboard") && m === "GET") {
    return ok(
      successData({
        leaderboard: demoCommunityMembers.map((m, i) => ({
          rank: i + 1,
          user: m.user,
          points: 100 - i * 10,
        })),
      })
    );
  }

  if (path.includes("/quests/generate-ai") || path.includes("/quests/ai-chat")) {
    return ok({
      success: true,
      message: "Demo AI quest suggestion generated.",
      data: demoQuests[0],
    });
  }

  if (path.includes("/select-winners") || path.includes("/distribute-rewards")) {
    return ok(successMessage("Quest action completed (demo)"));
  }

  return null;
}
