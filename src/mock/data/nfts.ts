import { DEMO_WALLET_ADDRESS } from "@/lib/demo-mode";
import { DEMO_IMAGES } from "@/lib/demo-images";
import { NFT_MARKETPLACE_ADDRESS } from "@/lib/nft/contracts";

const DEMO_CREATOR = "0xDemo0000000000000000000000000000000002";

export const demoListedNFTs = [
  {
    tokenId: 1n,
    owner: DEMO_CREATOR,
    seller: DEMO_CREATOR,
    creator: DEMO_CREATOR,
    price: 100000000000000000n,
    currentlyListed: true,
    createdAt: BigInt(Math.floor(Date.now() / 1000) - 86400),
    metadata: {
      name: "Zelario Genesis #1",
      description: "Demo NFT on mock marketplace.",
      image: DEMO_IMAGES.nft,
    },
  },
  {
    tokenId: 2n,
    owner: DEMO_WALLET_ADDRESS,
    seller: DEMO_WALLET_ADDRESS,
    creator: DEMO_CREATOR,
    price: 250000000000000000n,
    currentlyListed: true,
    createdAt: BigInt(Math.floor(Date.now() / 1000) - 43200),
    metadata: {
      name: "Neon Horizon #2",
      description: "Second demo listing.",
      image: DEMO_IMAGES.nftAlt,
    },
  },
  {
    tokenId: 3n,
    owner: DEMO_CREATOR,
    seller: DEMO_CREATOR,
    creator: DEMO_CREATOR,
    price: 50000000000000000n,
    currentlyListed: false,
    createdAt: BigInt(Math.floor(Date.now() / 1000) - 172800),
    metadata: {
      name: "Sold Artifact #3",
      description: "Previously sold demo item.",
      image: DEMO_IMAGES.nftAlt2,
    },
  },
];

export const DEMO_CONTRACT = NFT_MARKETPLACE_ADDRESS;
