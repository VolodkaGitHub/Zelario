/** Demo API refs — replaces live Convex function handles in demo mode. */

const ref = (path: string) => ({ _path: path });

export const api = {
  nft: {
    getHiddenTokenIds: ref("nft.getHiddenTokenIds"),
    setVisibility: ref("nft.setVisibility"),
  },
  nftReports: {
    createReport: ref("nftReports.createReport"),
    getReports: ref("nftReports.getReports"),
    resolveReport: ref("nftReports.resolveReport"),
  },
};
