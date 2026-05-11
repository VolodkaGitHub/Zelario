import {
  DEMO_USER_EMAIL,
  DEMO_USER_PASSWORD,
  DEMO_WALLET_ADDRESS,
} from "@/lib/demo-mode";
import { DEMO_IMAGES } from "@/lib/demo-images";
import {
  demoUser,
  demoUsers,
  demoPosts,
  demoComments,
  demoCommunities,
  demoMarketCoins,
  demoQuests,
  demoNotifications,
  demoConversations,
  demoChatMessages,
  demoDexPayments,
  demoChainCasts,
  demoCommunityMembers,
  demoReferralStats,
  demoPointsHistory,
  demoPointsConversionRate,
} from "../data/fixtures";
import { mockStore } from "../store";
import {
  ok,
  fail,
  pathOnly,
  queryOf,
  matchPath,
  paginate,
  cursorPaginate,
  successData,
  paginatedListResponse,
  successMessage,
  type MockBody,
  type MockResult,
} from "../utils";

export function handleUserApi(
  method: string,
  url: string,
  body?: MockBody
): MockResult | null {
  const path = pathOnly(url);
  const q = queryOf(url);
  const m = method.toUpperCase();

  // —— Auth ——
  if (m === "POST" && path === "/api/user/login") {
    const email = String(body?.email ?? "");
    const password = String(body?.password ?? "");
    if (email === DEMO_USER_EMAIL && password === DEMO_USER_PASSWORD) {
      return ok({
        success: true,
        user: mockStore.currentUser,
        accessToken: "demo-access-token",
        message: "Login successful",
      });
    }
    fail("Invalid email or password", 401);
  }

  if (m === "POST" && path === "/api/user/wallet-login") {
    const address = String(body?.address ?? "").trim();
    const chainType = String(body?.chainType ?? "evm");
    if (!address) fail("Wallet address is required", 400);

    if (address.toLowerCase() === DEMO_WALLET_ADDRESS.toLowerCase()) {
      fail(
        "Demo wallet sign-in is disabled. Connect MetaMask, Rabby, or Phantom.",
        403
      );
    }

    const idSlug =
      chainType === "solana"
        ? address.replace(/[^a-zA-Z0-9]/g, "")
        : address.toLowerCase().replace(/[^a-z0-9]/g, "");

    const short =
      address.length > 12
        ? `${address.slice(0, 6)}…${address.slice(-4)}`
        : address;
    const user = {
      ...demoUser,
      _id: `wallet-${idSlug.slice(0, 24)}`,
      username:
        chainType === "solana"
          ? `sol_${address.slice(0, 8)}`
          : `0x${address.replace(/^0x/i, "").slice(0, 8)}`,
      name: `Wallet ${short}`,
      email: `${address.slice(0, 42)}@wallet.zelario`,
      profilePic: demoUser.profilePic,
      walletAddress: address,
      walletChainType: chainType as "evm" | "solana",
    };
    mockStore.setCurrentUser(user);

    return ok({
      success: true,
      user,
      accessToken: "demo-access-token",
      message:
        chainType === "solana"
          ? "Signed in with Solana wallet"
          : "Signed in with wallet",
    });
  }

  if (m === "POST" && path === "/api/user/google-login") {
    return ok({
      success: true,
      user: mockStore.currentUser,
      accessToken: "demo-access-token",
      message: "Google login (demo)",
    });
  }

  if (m === "POST" && path === "/api/user/register") {
    return ok(successMessage("OTP sent to email (demo: use 123456)"));
  }

  if (m === "POST" && path === "/api/user/verify-otp") {
    return ok({
      success: true,
      user: mockStore.currentUser,
      accessToken: "demo-access-token",
      message: "Account verified",
    });
  }

  if (m === "POST" && path === "/api/user/check-username") {
    const username = String(body?.username ?? "");
    return ok({ success: true, available: username !== "taken", message: "" });
  }

  if (m === "GET" && path === "/api/user/generate-username") {
    return ok({
      success: true,
      username: `trader${Math.floor(Math.random() * 9000) + 1000}`,
    });
  }

  if (m === "POST" && path === "/api/user/request-otp") {
    return ok(successMessage("OTP sent (demo: 123456)"));
  }

  if (m === "POST" && path === "/api/user/forgot-password") {
    return ok(successMessage("Reset code sent (demo: 123456)"));
  }

  if (m === "POST" && path === "/api/user/verify-forgot-password-otp") {
    return ok(successMessage("OTP verified"));
  }

  if (m === "POST" && path === "/api/user/reset-password") {
    return ok(successMessage("Password reset successful"));
  }

  if (m === "POST" && path === "/api/user/logout") {
    return ok(successMessage("Logged out"));
  }

  if (m === "POST" && path === "/api/user/refresh-token") {
    return ok({ success: true, accessToken: "demo-access-token" });
  }

  if (m === "POST" && path === "/api/user/resend-otp") {
    return ok(successMessage("OTP resent"));
  }

  // —— Profile ——
  if (m === "GET" && path === "/api/user/get-profile") {
    return ok(successData(mockStore.currentUser));
  }

  if (m === "PUT" && path === "/api/user/profile") {
    Object.assign(mockStore.currentUser, body);
    return ok(successData(mockStore.currentUser));
  }

  if (m === "POST" && path === "/api/user/upload-profile-image") {
    const pic =
      String(body?.profilePic ?? "") || DEMO_IMAGES.avatar;
    mockStore.currentUser.profilePic = pic;
    return ok({ success: true, data: { profilePic: pic }, profilePic: pic });
  }

  if (m === "POST" && path === "/api/user/change-password") {
    return ok(successMessage("Password changed"));
  }

  if (m === "GET" && path === "/api/user/stats") {
    return ok(
      successData({
        totalPoints: mockStore.currentUser.totalPoints,
        followers: mockStore.currentUser.followersCount,
        following: mockStore.currentUser.followingCount,
        postsCount: mockStore.posts.filter(
          (p) => p.author._id === mockStore.currentUser._id
        ).length,
      })
    );
  }

  if (m === "GET" && path === "/api/user/notification-settings") {
    return ok(
      successData({
        emailNotifications: true,
        pushNotifications: true,
        marketingEmails: false,
      })
    );
  }

  if (
    (m === "PUT" || m === "PATCH") &&
    path === "/api/user/notification-settings"
  ) {
    return ok(successData(body));
  }

  if (m === "POST" && path === "/api/user/complete-onboarding") {
    return ok({ success: true });
  }

  if (m === "GET" && path === "/api/user/wallet-address") {
    return ok(successData({ address: DEMO_WALLET_ADDRESS }));
  }

  // —— Points & referrals ——
  if (m === "GET" && path === "/api/user/referrals/stats") {
    return ok(successData(demoReferralStats));
  }

  if (m === "GET" && path === "/api/user/referrals/history") {
    const page = Number(q.get("page") ?? 1);
    const limit = Number(q.get("limit") ?? 10);
    const items = demoUsers.slice(1).map((u) => ({
      _id: u._id,
      username: u.username,
      name: u.name,
      joinedAt: u.createdAt,
      pointsEarned: 50,
    }));
    const p = paginate(items, page, limit);
    return ok(
      successData({
        referrals: p.items,
        total: p.total,
        page: p.page,
        totalPages: p.totalPages,
      })
    );
  }

  if (m === "GET" && path === "/api/user/points/checkin-status") {
    return ok(
      successData({
        hasCheckedInToday: false,
        currentStreak: mockStore.currentUser.dailyCheckin.streak,
        nextCheckInAvailable: null,
      })
    );
  }

  if (m === "GET" && path === "/api/user/points/checkin-calendar") {
    return ok(
      successData({
        checkedInDays: [1, 2, 3, 5, 6],
        currentMonth: new Date().getMonth() + 1,
        currentYear: new Date().getFullYear(),
      })
    );
  }

  if (m === "GET" && path === "/api/user/points/history") {
    return ok(successData({ history: demoPointsHistory }));
  }

  if (m === "POST" && path === "/api/user/points/daily-checkin") {
    return ok(
      successData({
        success: true,
        pointsAwarded: 10,
        streakCount: mockStore.currentUser.dailyCheckin.streak + 1,
        message: "Daily check-in complete",
      })
    );
  }

  // —— Posts ——
  if (m === "POST" && path === "/api/user/posts/create") {
    const post = {
      _id: `post-${Date.now()}`,
      author: {
        _id: mockStore.currentUser._id,
        username: mockStore.currentUser.username,
        name: mockStore.currentUser.name,
        profilePic: mockStore.currentUser.profilePic,
        isVerified: true,
      },
      content: String(body?.content ?? ""),
      mediaUrls: (body?.mediaUrls as string[]) ?? [],
      mediaType: (body?.mediaType as "none") ?? "none",
      hashtags: [],
      mentions: [],
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      isOwnPost: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockStore.posts.unshift(post);
    return ok(successData(post));
  }

  const postById = matchPath("/api/user/posts/:id", path);
  if (postById) {
    const post = mockStore.posts.find((p) => p._id === postById.id);
    if (m === "GET") {
      if (!post) fail("Post not found", 404);
      const comments = demoComments.filter((c) => c.post === post._id);
      return ok(
        successData({
          post,
          comments,
          hasMoreComments: false,
          totalCommentsCount: comments.length,
        })
      );
    }
    if (m === "PUT") {
      if (!post) fail("Post not found", 404);
      if (body?.content) post.content = String(body.content);
      return ok(successData(post));
    }
    if (m === "DELETE") {
      mockStore.posts = mockStore.posts.filter((p) => p._id !== postById.id);
      return ok(successData({ success: true, message: "Deleted" }));
    }
  }

  const postLike = matchPath("/api/user/posts/:id/like", path);
  if (postLike && m === "POST") {
    const post = mockStore.posts.find((p) => p._id === postLike.id);
    if (post) {
      post.isLiked = !post.isLiked;
      post.likesCount += post.isLiked ? 1 : -1;
    }
    return ok(successData({ isLiked: post?.isLiked ?? true, likesCount: post?.likesCount ?? 1 }));
  }

  const postComments = matchPath("/api/user/posts/:id/comments", path);
  if (postComments && m === "GET") {
    const comments = demoComments.filter((c) => c.post === postComments.id);
    const limit = Number(q.get("limit") ?? 10);
    const page = cursorPaginate(comments, limit, q.get("cursor") ?? undefined);
    return ok(
      successData({
        comments: page.items,
        hasMore: page.hasMore,
        nextCursor: page.nextCursor,
        totalCount: page.totalCount,
      })
    );
  }

  if (m === "POST" && path === "/api/user/posts/comments/create") {
    const comment = {
      _id: `comment-${Date.now()}`,
      post: String(body?.postId ?? ""),
      author: {
        _id: mockStore.currentUser._id,
        username: mockStore.currentUser.username,
        name: mockStore.currentUser.name,
        profilePic: mockStore.currentUser.profilePic,
        isVerified: true,
      },
      content: String(body?.content ?? ""),
      likesCount: 0,
      repliesCount: 0,
      isLiked: false,
      isOwnComment: true,
      postedAsCommunity: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      replies: [],
    };
    mockStore.comments.push(comment);
    return ok(successData(comment));
  }

  const postsList = (route: string) => {
    if (path !== route || m !== "GET") return null;
    const limit = Number(q.get("limit") ?? 10);
    const page = cursorPaginate(mockStore.posts, limit, q.get("cursor") ?? undefined);
    return ok(
      successData({
        posts: page.items,
        hasMore: page.hasMore,
        nextCursor: page.nextCursor,
        totalCount: page.totalCount,
      })
    );
  };

  const feed = postsList("/api/user/posts/feed/all");
  if (feed) return feed;
  const trending = postsList("/api/user/posts/trending/all");
  if (trending) return trending;
  const search = postsList("/api/user/posts/search/all");
  if (search) return search;

  const userPosts = matchPath("/api/user/posts/user/:userId/all", path);
  if (userPosts && m === "GET") {
    const limit = Number(q.get("limit") ?? 10);
    const filtered = mockStore.posts.filter((p) => p.author._id === userPosts.userId);
    const page = cursorPaginate(filtered, limit);
    return ok(
      successData({
        posts: page.items,
        hasMore: page.hasMore,
        nextCursor: page.nextCursor,
        totalCount: page.totalCount,
      })
    );
  }

  if (m === "POST" && path === "/api/user/posts/upload-media") {
    return ok(
      successData({
        url: DEMO_IMAGES.banner,
        mediaType: "image",
      })
    );
  }

  if (m === "POST" && path === "/api/user/posts/share") {
    return ok(successData({ shareCount: 1 }));
  }

  if (m === "GET" && path === "/api/user/posts/stats/analytics") {
    return ok(
      successData({
        totalPosts: mockStore.posts.length,
        totalLikes: 85,
        totalComments: 15,
        engagementRate: 4.2,
      })
    );
  }

  if (m === "GET" && path === "/api/user/posts/hashtags/popular") {
    return ok(successData({ hashtags: ["web3", "dex", "zelario", "nft"] }));
  }

  if (m === "GET" && path === "/api/user/community/search-users") {
    return ok({
      success: true,
      users: demoUsers.map((u) => ({
        _id: u._id,
        username: u.username,
        name: u.name,
        profilePic: u.profilePic,
        isVerified: true,
      })),
    });
  }

  // —— Community profile & follow ——
  if (m === "GET" && path === "/api/user/community/profile") {
    return ok(
      successData({
        _id: mockStore.currentUser._id,
        username: mockStore.currentUser.username,
        name: mockStore.currentUser.name,
        profilePic: mockStore.currentUser.profilePic,
        bio: "Demo user on Zelario",
        followersCount: mockStore.currentUser.followersCount,
        followingCount: mockStore.currentUser.followingCount,
        isOwnProfile: true,
      })
    );
  }

  const profileByUser = matchPath(
    "/api/user/community/profile/username/:username",
    path
  );
  if (profileByUser && m === "GET") {
    const u =
      demoUsers.find((x) => x.username === profileByUser.username) ?? demoUser;
    return ok(
      successData({
        _id: u._id,
        username: u.username,
        name: u.name,
        profilePic: u.profilePic,
        bio: "Demo profile",
        followersCount: u.followersCount,
        followingCount: u.followingCount,
        isFollowing: false,
        isOwnProfile: u._id === mockStore.currentUser._id,
      })
    );
  }

  if (m === "POST" && path === "/api/user/community/follow") {
    return ok(successData({ isFollowing: true }));
  }

  if (m === "POST" && path === "/api/user/community/unfollow") {
    return ok(successData({ isFollowing: false }));
  }

  if (m === "GET" && path === "/api/user/community/followers") {
    return ok(
      successData({
        followers: demoUsers.slice(1).map((u) => ({
          _id: u._id,
          username: u.username,
          name: u.name,
          profilePic: u.profilePic,
        })),
        total: demoUsers.length - 1,
      })
    );
  }

  if (m === "GET" && path === "/api/user/community/following") {
    return ok(successData({ following: [], total: 0 }));
  }

  const followStatus = matchPath("/api/user/community/follow-status/:username", path);
  if (followStatus && m === "GET") {
    return ok(successData({ isFollowing: false }));
  }

  if (m === "POST" && path === "/api/user/community/upload-banner-image") {
    return ok(
      successData({
        bannerImage: DEMO_IMAGES.banner,
      })
    );
  }

  // —— Chat ——
  if (m === "GET" && path === "/api/user/chat/conversations") {
    return ok(
      successData({
        conversations: demoConversations,
        hasMore: false,
        totalCount: demoConversations.length,
      })
    );
  }

  if (m === "POST" && path === "/api/user/chat/send") {
    return ok(
      successData({
        _id: `msg-${Date.now()}`,
        content: String(body?.content ?? ""),
        createdAt: new Date().toISOString(),
      })
    );
  }

  const convMessages = matchPath(
    "/api/user/chat/conversations/:conversationId/messages",
    path
  );
  if (convMessages && m === "GET") {
    return ok(successData({ messages: demoChatMessages }));
  }

  if (m === "GET" && path === "/api/user/chat/livekit-token") {
    return ok(
      successData({
        token: "demo-livekit-token",
        roomName: "demo-room",
        serverUrl: "wss://demo.livekit.io",
      })
    );
  }

  // —— Communities ——
  if (m === "GET" && path === "/api/user/communities/search") {
    const limit = Number(q.get("limit") ?? 20);
    const page = cursorPaginate(demoCommunities, limit);
    return ok(
      successData({
        communities: page.items,
        users: demoUsers.slice(1).map((u) => ({
          _id: u._id,
          username: u.username,
          name: u.name,
          profilePic: u.profilePic,
          bio: "",
          isVerified: true,
          followersCount: u.followersCount,
        })),
        hasMore: page.hasMore,
        nextCursor: page.nextCursor,
        totalCount: page.totalCount,
        searchType: q.get("type") ?? "all",
      })
    );
  }

  if (m === "GET" && path === "/api/user/communities/popular") {
    const limit = Number(q.get("limit") ?? 20);
    const page = cursorPaginate(demoCommunities, limit);
    return ok(
      successData({
        communities: page.items,
        hasMore: page.hasMore,
        nextCursor: page.nextCursor,
        totalCount: page.totalCount,
      })
    );
  }

  const commByUsername = matchPath("/api/user/communities/username/:username", path);
  if (commByUsername && m === "GET") {
    const c = demoCommunities.find((x) => x.username === commByUsername.username);
    if (!c) fail("Community not found", 404);
    return ok(successData(c));
  }

  const commById = matchPath("/api/user/communities/:communityId", path);
  if (
    commById &&
    m === "GET" &&
    !path.includes("username") &&
    !path.includes("members") &&
    !path.includes("member-status")
  ) {
    const c = demoCommunities.find((x) => x._id === commById.communityId);
    if (!c) fail("Community not found", 404);
    return ok(successData(c));
  }

  if (m === "POST" && path === "/api/user/communities/join") {
    return ok(successData({ isMember: true, message: "Joined community" }));
  }

  if (m === "POST" && path === "/api/user/communities/leave") {
    return ok(successData({ isMember: false, message: "Left community" }));
  }

  const commMembers = matchPath("/api/user/communities/:username/members", path);
  if (commMembers && m === "GET") {
    return ok(
      successData({
        members: demoCommunityMembers,
        total: demoCommunityMembers.length,
      })
    );
  }

  const memberStatus = matchPath(
    "/api/user/communities/:username/member-status",
    path
  );
  if (memberStatus && m === "GET") {
    return ok(successData({ isMember: true, role: "member" }));
  }

  if (m === "GET" && path === "/api/user/my-communities") {
    return ok(
      successData({
        communities: [demoCommunities[0]],
        hasMore: false,
        totalCount: 1,
      })
    );
  }

  if (m === "GET" && path === "/api/user/my-communities/stats") {
    return ok(
      successData({
        totalCommunities: 1,
        totalUnread: 2,
        activeToday: 1,
      })
    );
  }

  if (m === "GET" && path === "/api/user/my-communities/activity") {
    return ok(
      successData({
        activities: [
          {
            communityId: "comm-1",
            communityName: "Web3 Builders",
            unreadPosts: 2,
            lastActivity: new Date().toISOString(),
          },
        ],
        totalUnreadPosts: 2,
        mostActiveToday: "Web3 Builders",
      })
    );
  }

  // —— Market ——
  if (path === "/api/user/market/coins/public" && m === "GET") {
    return ok({ success: true, coins: demoMarketCoins });
  }

  if (path === "/api/user/market/coins" && m === "GET") {
    return ok({ success: true, coins: demoMarketCoins });
  }

  // —— DEX ——
  if (path === "/api/user/dex/eth-price" && m === "GET") {
    return ok({
      success: true,
      data: { price: 3420.55, currency: "USD" },
    });
  }

  if (path === "/api/user/dex/calculate-estimate" && m === "POST") {
    const amount = Number(body?.amount ?? body?.amountInCurrency ?? 1000);
    const estimatedEth = amount / 3420.55;
    const platformFee = amount * 0.02;
    return ok({
      success: true,
      data: {
        estimatedEth,
        platformFee,
        actualEthToReceive: estimatedEth * 0.98,
        fee: platformFee,
        ethPrice: 3420.55,
      },
    });
  }

  if (path === "/api/user/dex/create-order" && m === "POST") {
    const order = {
      _id: `order-${Date.now()}`,
      razorpayOrderId: `order_demo_${Date.now()}`,
      amount: body?.amountInCurrency,
      currency: body?.currency ?? "USD",
      estimatedEth: body?.estimatedEth,
      status: "created",
    };
    return ok({ success: true, ...order, data: order });
  }

  if (path === "/api/user/dex/verify-payment" && m === "POST") {
    return ok({ success: true, message: "Payment verified (demo)" });
  }

  if (path === "/api/user/dex/swap/record" && m === "POST") {
    return ok({ success: true, message: "Swap recorded (demo)" });
  }

  const swapStatus = matchPath("/api/user/dex/swap/:txHash/status", path);
  if (swapStatus && m === "PUT") {
    return ok({ success: true, status: body?.status ?? "confirmed" });
  }

  if (path.startsWith("/api/user/dex/swap/history") && m === "GET") {
    return ok({ success: true, data: [] });
  }

  if (path.startsWith("/api/user/dex/payments") && m === "GET") {
    const page = Number(q.get("page") ?? 1);
    const limit = Number(q.get("limit") ?? 10);
    const p = paginate(mockStore.dexPayments, page, limit);
    return ok({
      success: true,
      data: {
        payments: p.items,
        total: p.total,
        totalPages: p.totalPages,
        page: p.page,
        limit: p.limit,
      },
      payments: p.items,
      totalPages: p.totalPages,
      page: p.page,
    });
  }

  if (path.startsWith("/api/user/dex/")) {
    return ok({ success: true, data: [] });
  }

  // —— Quests ——
  const demoMyQuests = demoQuests.map((quest, i) => ({
    _id: `my-quest-${quest._id}`,
    questId: quest._id,
    quest,
    status: "in_progress",
    joinedAt: new Date().toISOString(),
    totalTasksCompleted: i === 0 ? 1 : 0,
    isWinner: false,
    rewardClaimed: false,
    progress: i === 0 ? 50 : 0,
  }));

  if (path === "/api/user/quests/top" && m === "GET") {
    const limit = Number(q.get("limit") ?? 10);
    return ok(successData(demoQuests.slice(0, limit)));
  }

  if (path === "/api/user/quests/my" && m === "GET") {
    const page = Number(q.get("page") ?? 1);
    const limit = Number(q.get("limit") ?? 12);
    let items = demoMyQuests;
    const search = q.get("search");
    if (search) {
      const s = search.toLowerCase();
      items = items.filter(
        (mq) =>
          mq.quest.title.toLowerCase().includes(s) ||
          mq.quest.description.toLowerCase().includes(s)
      );
    }
    return ok(paginatedListResponse(items, page, limit));
  }

  if (path === "/api/user/quests" && m === "GET") {
    const page = Number(q.get("page") ?? 1);
    const limit = Number(q.get("limit") ?? 12);
    let items = [...demoQuests];
    const status = q.get("status");
    if (status) items = items.filter((x) => x.status === status);
    const search = q.get("search");
    if (search) {
      const s = search.toLowerCase();
      items = items.filter(
        (x) =>
          x.title.toLowerCase().includes(s) ||
          x.description.toLowerCase().includes(s)
      );
    }
    return ok(paginatedListResponse(items, page, limit));
  }

  const questById = matchPath("/api/user/quests/:questId", path);
  if (questById && m === "GET") {
    const quest = demoQuests.find((x) => x._id === questById.questId);
    if (!quest) fail("Quest not found", 404);
    return ok(successData(quest));
  }

  if (m === "POST" && path === "/api/user/quests/join") {
    return ok(successData({ joined: true, message: "Joined quest" }));
  }

  const questParticipation = matchPath(
    "/api/user/quests/:questId/participation-status",
    path
  );
  if (questParticipation && m === "GET") {
    return ok(successData({ hasJoined: true, status: "active" }));
  }

  const questTasks = matchPath("/api/user/quests/:questId/tasks", path);
  if (questTasks && m === "GET") {
    const quest = demoQuests.find((x) => x._id === questTasks.questId);
    return ok(successData(quest?.tasks ?? []));
  }

  if (m === "POST" && path === "/api/user/quests/submit-task") {
    return ok(successData({ submitted: true }));
  }

  // —— Wallet ——
  if (path === "/api/user/wallet/connect" && m === "POST") {
    return ok(
      successData({
        address: body?.address ?? DEMO_WALLET_ADDRESS,
        connected: true,
      })
    );
  }

  if (path === "/api/user/wallet/balance" && m === "GET") {
    return ok(successData({ balance: "1.25", symbol: "ETH" }));
  }

  if (path === "/api/user/wallet/disconnect" && m === "POST") {
    return ok(successMessage("Wallet disconnected"));
  }

  // —— Notifications ——
  if (path === "/api/user/notifications" && m === "GET") {
    return ok(
      successData({
        notifications: mockStore.notifications,
        total: mockStore.notifications.length,
        page: Number(q.get("page") ?? 1),
        totalPages: 1,
      })
    );
  }

  const notifRead = matchPath("/api/user/notifications/:notificationId/read", path);
  if (notifRead && (m === "PUT" || m === "PATCH")) {
    return ok(successMessage("Marked as read"));
  }

  if (path === "/api/user/notifications/mark-all-read" && m === "PATCH") {
    return ok(successMessage("All marked as read"));
  }

  // —— Points conversion ——
  if (path === "/api/user/points-conversion/rate" && m === "GET") {
    return ok(successData(demoPointsConversionRate));
  }

  if (path === "/api/user/points-conversion/history" && m === "GET") {
    return ok(successData([]));
  }

  if (path.startsWith("/api/user/points-conversion") && m === "POST") {
    return ok(successData({ conversionId: `conv-${Date.now()}`, status: "pending" }));
  }

  // —— ChainCast ——
  const communityCasts = matchPath("/api/user/community/:communityId/chaincasts", path);
  if (communityCasts && m === "GET") {
    return ok(successData(mockStore.chainCasts));
  }

  const castById = matchPath("/api/user/chaincast/:chainCastId", path);
  if (castById && m === "GET" && !path.includes("can-join")) {
    const cast = mockStore.chainCasts.find((c) => c._id === castById.chainCastId);
    return ok(successData(cast ?? mockStore.chainCasts[0]));
  }

  const canJoin = matchPath("/api/user/chaincast/:chainCastId/can-join", path);
  if (canJoin && m === "GET") {
    return ok(successData({ canJoin: true }));
  }

  if (path === "/api/user/chaincast/join" && m === "POST") {
    return ok(successData({ token: "demo-livekit-token", joined: true }));
  }

  // —— Community channel / group chat ——
  const channelMsgs = matchPath(
    "/api/user/community/:username/channel/messages",
    path
  );
  if (channelMsgs && m === "GET") {
    return ok(
      successData({
        messages: [
          {
            _id: "ch-msg-1",
            content: "Welcome to #general (demo)",
            author: demoCommunityMembers[0].user,
            createdAt: new Date().toISOString(),
          },
        ],
        hasMore: false,
        totalCount: 1,
      })
    );
  }

  if (path.startsWith("/api/user/community/") && path.includes("group-chat")) {
    if (m === "GET") {
      return ok(successData({ messages: [], hasMore: false }));
    }
    if (m === "POST") {
      return ok(successData({ _id: `gmsg-${Date.now()}`, content: body?.content }));
    }
  }

  // —— AI trading (under /api/user) ——
  if (path.startsWith("/api/user/ai-trading") || path.startsWith("/api/ai-trading")) {
    return handleAiTrading(m, path, body);
  }

  return null;
}

function handleAiTrading(m: string, path: string, body?: MockBody): MockResult {
  if (path.includes("/chat/message") && m === "POST") {
    return ok({
      success: true,
      reply:
        "Demo AI: Based on mock data, ETH looks range-bound. This is not financial advice.",
      sessionId: body?.sessionId ?? "demo-session",
    });
  }
  if (path.includes("/tokens") && m === "GET") {
    return ok({ success: true, tokens: demoMarketCoins });
  }
  if (path.includes("/prices") && m === "GET") {
    return ok({
      success: true,
      prices: demoMarketCoins.map((c) => ({
        symbol: c.symbol,
        price: c.current_price,
      })),
    });
  }
  if (path.includes("/swap/estimate") && m === "GET") {
    return ok({ success: true, estimatedOutput: 0.98, fee: 0.02 });
  }
  if (path.includes("/trade/analyze") && m === "POST") {
    return ok({
      success: true,
      analysis: "Demo analysis: moderate risk, mock liquidity.",
    });
  }
  if (path.includes("/trade/execute") && m === "POST") {
    return ok({ success: true, txHash: `0xdemo${Date.now()}` });
  }
  if (path.includes("/chat/history") && m === "GET") {
    return ok({ success: true, messages: [] });
  }
  return ok({ success: true, data: [] });
}
