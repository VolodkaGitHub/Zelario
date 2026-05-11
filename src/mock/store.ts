import {
  demoPosts,
  demoComments,
  demoUser,
  demoDexPayments,
  demoNotifications,
  demoChainCasts,
} from "./data/fixtures";

export const mockStore = {
  currentUser: { ...demoUser },
  posts: [...demoPosts],
  comments: [...demoComments],
  dexPayments: [...demoDexPayments],
  notifications: [...demoNotifications],
  chainCasts: [...demoChainCasts],
  hiddenNftTokenIds: [] as string[],
  nftReports: [] as Array<{
    _id: string;
    tokenId: string;
    reason: string;
    detailedReason?: string;
    status: string;
    createdAt: number;
  }>,

  setCurrentUser(user: typeof demoUser) {
    mockStore.currentUser = user;
  },

  getHiddenTokenIds: () => [...mockStore.hiddenNftTokenIds],
  setTokenHidden(tokenId: string, hidden: boolean) {
    if (hidden && !mockStore.hiddenNftTokenIds.includes(tokenId)) {
      mockStore.hiddenNftTokenIds.push(tokenId);
    } else if (!hidden) {
      mockStore.hiddenNftTokenIds = mockStore.hiddenNftTokenIds.filter(
        (id) => id !== tokenId
      );
    }
  },
  getNftReports: () => [...mockStore.nftReports],
  addNftReport(report: Omit<(typeof mockStore.nftReports)[0], "_id">) {
    const entry = { ...report, _id: `report-${Date.now()}` };
    mockStore.nftReports = [entry, ...mockStore.nftReports];
    return entry;
  },
  resolveReport(id: string) {
    mockStore.nftReports = mockStore.nftReports.map((r) =>
      r._id === id ? { ...r, status: "solved" } : r
    );
  },
};
