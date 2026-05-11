import type { UserProfile } from "@/types/user/user.types";
import { DEMO_IMAGES } from "@/lib/demo-images";

const now = Date.now();
const iso = (offsetMs: number) => new Date(now - offsetMs).toISOString();

export const demoUser: UserProfile = {
  _id: "demo-user-1",
  username: "demotrader",
  name: "Demo Trader",
  email: "demo@zelario.demo",
  phone: "+1 555 0100",
  refferalCode: "DEMO2026",
  refferedBy: "",
  profilePic: DEMO_IMAGES.avatar,
  role: "user",
  totalPoints: 1250,
  isBlocked: false,
  isBanned: false,
  isEmailVerified: true,
  isGoogleUser: false,
  dailyCheckin: { lastCheckIn: iso(86400_000), streak: 3 },
  followersCount: 42,
  followingCount: 18,
  createdAt: iso(90 * 86400_000),
  updatedAt: iso(3600_000),
  walletAddress: "0xDemo0000000000000000000000000000000001",
  walletChainType: "evm" as const,
};

export const demoUsers = [
  demoUser,
  {
    ...demoUser,
    _id: "user-2",
    username: "alice_web3",
    name: "Alice Chen",
    email: "alice@demo.local",
    profilePic:
      DEMO_IMAGES.avatarAlt,
    totalPoints: 890,
    refferalCode: "ALICE99",
  },
  {
    ...demoUser,
    _id: "user-3",
    username: "bob_defi",
    name: "Bob DeFi",
    email: "bob@demo.local",
    profilePic:
      DEMO_IMAGES.avatarAlt2,
    totalPoints: 2100,
    refferalCode: "BOBDEFI",
  },
];

export const demoAdmin = {
  _id: "demo-admin-1",
  email: "admin@zelario.demo",
  name: "Demo Admin",
  role: "admin" as const,
};

export const demoCommunityAdmin = {
  _id: "demo-ca-1",
  email: "community@zelario.demo",
  username: "web3builders",
  name: "Web3 Builders Admin",
  communityName: "Web3 Builders",
  communityId: "comm-1",
};

const author = (u: (typeof demoUsers)[0]) => ({
  _id: u._id,
  username: u.username,
  name: u.name,
  profilePic: u.profilePic,
  isVerified: true,
});

export const demoPosts = [
  {
    _id: "post-1",
    author: author(demoUser),
    content:
      "Welcome to Zelario demo — trade, quests, and communities with mock data.",
    mediaUrls: [] as string[],
    mediaType: "none" as const,
    hashtags: ["zelario", "web3"],
    mentions: [],
    likesCount: 12,
    commentsCount: 2,
    sharesCount: 1,
    isLiked: false,
    isOwnPost: true,
    createdAt: iso(3600_000),
    updatedAt: iso(3600_000),
  },
  {
    _id: "post-2",
    author: author(demoUsers[1]),
    content: "Just completed a mock swap on the DEX. Gas-free in demo mode.",
    mediaUrls: [
      DEMO_IMAGES.banner,
    ],
    mediaType: "image" as const,
    hashtags: ["dex", "demo"],
    mentions: ["@demotrader"],
    likesCount: 28,
    commentsCount: 5,
    sharesCount: 3,
    isLiked: true,
    isOwnPost: false,
    createdAt: iso(86400_000),
    updatedAt: iso(86400_000),
  },
  {
    _id: "post-3",
    author: author(demoUsers[2]),
    content: "Join the Web3 Builders community quest this week.",
    mediaUrls: [],
    mediaType: "none" as const,
    hashtags: ["quest"],
    mentions: [],
    likesCount: 45,
    commentsCount: 8,
    sharesCount: 2,
    isLiked: false,
    isOwnPost: false,
    createdAt: iso(172800_000),
    updatedAt: iso(172800_000),
  },
];

export const demoComments = [
  {
    _id: "comment-1",
    post: "post-1",
    author: author(demoUsers[1]),
    content: "Great platform for demos!",
    likesCount: 3,
    repliesCount: 0,
    isLiked: false,
    isOwnComment: false,
    postedAsCommunity: false,
    createdAt: iso(1800_000),
    updatedAt: iso(1800_000),
    replies: [],
  },
  {
    _id: "comment-2",
    post: "post-1",
    author: author(demoUsers[2]),
    content: "Mock API works offline too.",
    likesCount: 1,
    repliesCount: 0,
    isLiked: true,
    isOwnComment: false,
    postedAsCommunity: false,
    createdAt: iso(900_000),
    updatedAt: iso(900_000),
    replies: [],
  },
];

export const demoCommunities = [
  {
    _id: "comm-1",
    communityName: "Web3 Builders",
    username: "web3builders",
    description: "Build, ship, and learn together. Demo community with full mock APIs.",
    category: "Development",
    logo: DEMO_IMAGES.logo,
    banner:
      DEMO_IMAGES.banner,
    isVerified: true,
    memberCount: 1284,
    isMember: true,
    createdAt: iso(200 * 86400_000),
    rules: ["Be respectful", "No spam"],
    socialLinks: [{ platform: "twitter", url: "https://twitter.com" }],
    settings: {
      allowChainCast: true,
      allowGroupChat: true,
      allowPosts: true,
      allowQuests: true,
    },
    memberRole: "member",
    isAdmin: false,
  },
  {
    _id: "comm-2",
    communityName: "NFT Collectors",
    username: "nftcollectors",
    description: "Explore digital art and collectibles.",
    category: "NFT",
    logo: DEMO_IMAGES.logoAlt,
    banner:
      DEMO_IMAGES.bannerAlt,
    isVerified: false,
    memberCount: 892,
    isMember: false,
    createdAt: iso(150 * 86400_000),
    rules: [],
    socialLinks: [],
    settings: {
      allowChainCast: true,
      allowGroupChat: true,
      allowPosts: true,
      allowQuests: false,
    },
    isAdmin: false,
  },
];

export const demoMarketCoins = [
  {
    _id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 67250.12,
    price_change_percentage_24h: 1.24,
    market_cap: 1_320_000_000_000,
    contractAddress: "0x0000000000000000000000000000000000000001",
    isListed: true,
  },
  {
    _id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3420.55,
    price_change_percentage_24h: -0.42,
    market_cap: 410_000_000_000,
    contractAddress: "0x0000000000000000000000000000000000000002",
    isListed: true,
  },
  {
    _id: "cvx",
    name: "Zelario",
    symbol: "CVX",
    image:
      DEMO_IMAGES.logo,
    current_price: 2.45,
    price_change_percentage_24h: 5.8,
    market_cap: 24_500_000,
    contractAddress: "0x0000000000000000000000000000000000000003",
    isListed: true,
  },
];

export const demoQuests = [
  {
    _id: "quest-1",
    communityId: "comm-1",
    title: "First Demo Trade",
    description: "Complete a mock swap in the trade section.",
    bannerImage:
      DEMO_IMAGES.banner,
    startDate: iso(7 * 86400_000),
    endDate: iso(-7 * 86400_000),
    selectionMethod: "fcfs",
    participantLimit: 500,
    rewardPool: {
      amount: 100,
      currency: "POINTS",
      rewardType: "points",
    },
    status: "active",
    totalParticipants: 234,
    totalSubmissions: 412,
    winnersSelected: false,
    isAIGenerated: false,
    createdAt: iso(30 * 86400_000),
    updatedAt: iso(86400_000),
    community: {
      communityName: demoCommunities[0].communityName,
      logo: demoCommunities[0].logo,
      username: demoCommunities[0].username,
    },
    isParticipating: false,
    canJoin: true,
    joinMessage: "Join this quest to start earning rewards!",
    timeRemaining: { days: 7, hours: 0, minutes: 0, hasEnded: false },
    tasks: [
      {
        _id: "task-1",
        questId: "quest-1",
        title: "Connect demo wallet",
        description: "Link your demo wallet from the profile page.",
        taskType: "wallet_connect",
        isRequired: true,
        order: 1,
        privilegePoints: 25,
        config: {},
        completedBy: 180,
        isCompleted: false,
        canSubmit: true,
      },
      {
        _id: "task-2",
        questId: "quest-1",
        title: "Visit DEX page",
        description: "Open the trade section and review a swap quote.",
        taskType: "custom",
        isRequired: true,
        order: 2,
        privilegePoints: 75,
        config: { customInstructions: "Visit the DEX page and view a swap quote." },
        completedBy: 120,
        isCompleted: false,
        canSubmit: true,
      },
    ],
  },
  {
    _id: "quest-2",
    communityId: "comm-1",
    title: "Community Explorer",
    description: "Join a community and post once.",
    bannerImage:
      DEMO_IMAGES.bannerAlt,
    startDate: iso(14 * 86400_000),
    endDate: iso(-14 * 86400_000),
    selectionMethod: "leaderboard",
    participantLimit: 200,
    rewardPool: {
      amount: 50,
      currency: "CVX",
      rewardType: "token",
    },
    status: "active",
    totalParticipants: 89,
    totalSubmissions: 156,
    winnersSelected: false,
    isAIGenerated: false,
    createdAt: iso(45 * 86400_000),
    updatedAt: iso(2 * 86400_000),
    community: {
      communityName: demoCommunities[0].communityName,
      logo: demoCommunities[0].logo,
      username: demoCommunities[0].username,
    },
    isParticipating: false,
    canJoin: true,
    joinMessage: "Join this quest to start earning rewards!",
    timeRemaining: { days: 14, hours: 0, minutes: 0, hasEnded: false },
    tasks: [
      {
        _id: "task-3",
        questId: "quest-2",
        title: "Join Web3 Builders",
        description: "Become a member of the Web3 Builders community.",
        taskType: "join_community",
        isRequired: true,
        order: 1,
        privilegePoints: 25,
        config: { communityName: "Web3 Builders" },
        completedBy: 72,
        isCompleted: false,
        canSubmit: true,
      },
      {
        _id: "task-4",
        questId: "quest-2",
        title: "Create your first post",
        description: "Share an intro post in the community feed.",
        taskType: "custom",
        isRequired: true,
        order: 2,
        privilegePoints: 25,
        config: { customInstructions: "Post once in the community feed." },
        completedBy: 45,
        isCompleted: false,
        canSubmit: true,
      },
    ],
  },
];

export const demoNotifications = [
  {
    _id: "notif-1",
    type: "like",
    title: "New like",
    message: "Alice liked your post",
    isRead: false,
    createdAt: iso(600_000),
    data: { postId: "post-1" },
  },
  {
    _id: "notif-2",
    type: "quest",
    title: "Quest reminder",
    message: "First Demo Trade ends soon",
    isRead: false,
    createdAt: iso(7200_000),
    data: { questId: "quest-1" },
  },
];

export const demoConversations = [
  {
    _id: "conv-1",
    participants: [
      {
        _id: demoUser._id,
        username: demoUser.username,
        name: demoUser.name,
        profilePic: demoUser.profilePic,
        isVerified: true,
        isOnline: true,
      },
      {
        _id: demoUsers[1]._id,
        username: demoUsers[1].username,
        name: demoUsers[1].name,
        profilePic: demoUsers[1].profilePic,
        isVerified: true,
        isOnline: false,
      },
    ],
    lastMessage: {
      _id: "msg-1",
      conversationId: "conv-1",
      sender: {
        _id: demoUsers[1]._id,
        username: demoUsers[1].username,
        name: demoUsers[1].name,
        profilePic: demoUsers[1].profilePic,
        isVerified: true,
      },
      content: "Hey, try the demo DEX!",
      messageType: "text" as const,
      readBy: [],
      isDeleted: false,
      createdAt: iso(300_000),
      updatedAt: iso(300_000),
      isOwnMessage: false,
    },
    lastActivity: iso(300_000),
    unreadCount: 1,
    createdAt: iso(86400_000),
    updatedAt: iso(300_000),
  },
];

export const demoChatMessages = [
  {
    _id: "msg-1",
    conversationId: "conv-1",
    sender: author(demoUsers[1]),
    content: "Hey, try the demo DEX!",
    createdAt: iso(300_000),
    isRead: false,
    isOwn: false,
  },
  {
    _id: "msg-2",
    conversationId: "conv-1",
    sender: author(demoUser),
    content: "Will do, thanks!",
    createdAt: iso(120_000),
    isRead: true,
    isOwn: true,
  },
];

export const demoDexPayments = [
  {
    _id: "pay-1",
    userId: demoUser._id,
    status: "fulfilled" as const,
    amountInCurrency: 50,
    currency: "USD",
    estimatedEth: 0.015,
    actualEthToSend: 0.0147,
    platformFee: 0.0003,
    totalFeePercentage: 2,
    ethPriceAtTime: 3420,
    walletAddress: "0xDemo0000000000000000000000000000000001",
    razorpayOrderId: "order_demo_1",
    razorpayPaymentId: "pay_demo_1",
    transactionHash: "0xdemo_tx_1",
    createdAt: iso(86400_000),
    updatedAt: iso(86400_000),
  },
  {
    _id: "pay-2",
    userId: demoUser._id,
    status: "pending" as const,
    amountInCurrency: 100,
    currency: "USD",
    estimatedEth: 0.03,
    actualEthToSend: 0,
    platformFee: 0,
    totalFeePercentage: 2,
    ethPriceAtTime: 3420,
    walletAddress: "0xDemo0000000000000000000000000000000001",
    razorpayOrderId: "order_demo_2",
    createdAt: iso(3600_000),
    updatedAt: iso(3600_000),
  },
];

export const demoChainCasts = [
  {
    _id: "cast-1",
    title: "Weekly Web3 AMA",
    description: "Ask anything about DeFi and NFTs",
    status: "scheduled",
    communityId: "comm-1",
    scheduledAt: iso(-86400_000),
    participantCount: 0,
    hostId: demoCommunityAdmin._id,
  },
];

export const demoCommunityMembers = demoUsers.map((u, i) => ({
  _id: `member-${u._id}`,
  user: {
    _id: u._id,
    username: u.username,
    name: u.name,
    profilePic: u.profilePic,
    isVerified: true,
  },
  role: i === 0 ? "owner" : "member",
  joinedAt: iso((i + 1) * 86400_000),
  isActive: true,
  totalPosts: i + 1,
  totalLikes: (i + 1) * 10,
  totalComments: i * 3,
}));

export const demoDashboardStats = {
  totalUsers: 12450,
  activeUsers: 3201,
  totalCommunities: 86,
  pendingRequests: 4,
  totalVolume: 1_250_000,
  revenue: 42_500,
  newUsersToday: 42,
  activeCommunities: 28,
};

export const demoReferralStats = {
  totalReferrals: 5,
  totalPointsEarned: 250,
  referralCode: demoUser.refferalCode,
  referralLink: `https://zelario.demo/ref/${demoUser.refferalCode}`,
};

export const demoPointsHistory = [
  {
    _id: "ph-1",
    points: 10,
    type: "daily_checkin",
    description: "Daily check-in",
    createdAt: iso(86400_000),
  },
  {
    _id: "ph-2",
    points: 100,
    type: "quest",
    description: "Quest reward",
    createdAt: iso(172800_000),
  },
];

export const demoCommunityRequests = [
  {
    _id: "req-1",
    communityName: "DeFi Labs",
    username: "defilabs",
    email: "lead@defilabs.demo",
    status: "pending",
    createdAt: iso(43200_000),
  },
];

export const demoAdminDexPayments = demoDexPayments.map((p) => ({
  ...p,
  user: { _id: demoUser._id, name: demoUser.name, email: demoUser.email },
}));

export const demoPointsConversionRate = {
  pointsPerCVC: 100,
  claimFeeETH: "0.001",
  minPoints: 100,
  maxPoints: 10000,
};
