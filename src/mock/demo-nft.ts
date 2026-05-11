import { demoListedNFTs } from "./data/nfts";

export function getDemoRawTokens() {
  return demoListedNFTs.map((n) => ({
    tokenId: n.tokenId,
    owner: n.owner,
    seller: n.seller,
    creator: n.creator,
    price: n.price,
    currentlyListed: n.currentlyListed,
    createdAt: n.createdAt,
  }));
}

export function getDemoMetadataUri(tokenId: bigint): string {
  const item = demoListedNFTs.find((n) => n.tokenId === tokenId);
  if (!item?.metadata) return "";
  return `data:application/json,${encodeURIComponent(JSON.stringify(item.metadata))}`;
}
