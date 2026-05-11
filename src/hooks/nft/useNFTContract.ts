'use client';

import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWalletAccount } from '@/hooks/useWalletAccount';
import { getBrowserSigner } from '@/lib/ethers-wallet';
import { getStaticProvider } from '@/lib/web3-provider';
import { NFT_MARKETPLACE_ADDRESS, NFT_MARKETPLACE_ABI } from '@/lib/nft/contracts';
import { ListedToken, NFTWithMetadata, NFTMetadata, SaleDetails, MarketplaceStats } from '@/types/types-nft';

interface RawToken {
  tokenId: bigint;
  owner: string;
  seller: string;
  creator: string;
  price: bigint;
  currentlyListed: boolean;
  createdAt: bigint;
}

function getReadContract() {
  if (!NFT_MARKETPLACE_ADDRESS) {
    throw new Error('NFT marketplace contract address is not configured.');
  }
  return new ethers.Contract(NFT_MARKETPLACE_ADDRESS, NFT_MARKETPLACE_ABI, getStaticProvider());
}

async function getWriteContract() {
  const signer = await getBrowserSigner();
  return new ethers.Contract(NFT_MARKETPLACE_ADDRESS, NFT_MARKETPLACE_ABI, signer);
}

function mapRawToken(item: RawToken): ListedToken {
  return {
    tokenId: item.tokenId,
    owner: item.owner,
    seller: item.seller,
    creator: item.creator,
    price: item.price,
    currentlyListed: item.currentlyListed,
    createdAt: item.createdAt,
  };
}

export const useNFTContract = () => {
  const { account } = useWalletAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string>('');
  const [error, setError] = useState<string>('');

  const ensureMarketplace = useCallback(() => {
    if (!NFT_MARKETPLACE_ADDRESS) {
      throw new Error('NFT marketplace contract address is not configured in the environment.');
    }
  }, []);

  const createToken = useCallback(async (tokenURI: string, price: string) => {
    if (!account) {
      throw new Error('Wallet not connected');
    }
    ensureMarketplace();

    try {
      setIsLoading(true);
      setError('');

      const priceInWei = ethers.parseEther(price);
      const read = getReadContract();
      const listPrice = await read.getListPrice();
      const contract = await getWriteContract();
      const tx = await contract.createToken(tokenURI, priceInWei, { value: listPrice });
      const receipt = await tx.wait();
      setTxHash(receipt.hash);
      return receipt;
    } catch (err) {
      const e = err as Error & { reason?: string };
      const message = e.reason || e.message || 'Failed to create token';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [account, ensureMarketplace]);

  const buyNFT = useCallback(async (tokenId: bigint, price: bigint) => {
    if (!account) {
      throw new Error('Wallet not connected');
    }
    ensureMarketplace();

    try {
      setIsLoading(true);
      setError('');
      const contract = await getWriteContract();
      const tx = await contract.executeSale(tokenId, { value: price });
      const receipt = await tx.wait();
      setTxHash(receipt.hash);
      return receipt;
    } catch (err) {
      const e = err as Error & { reason?: string };
      const message = e.reason || e.message || 'Failed to buy NFT';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [account, ensureMarketplace]);

  const relistNFT = useCallback(async (tokenId: bigint, price: string) => {
    if (!account) {
      throw new Error('Wallet not connected');
    }
    ensureMarketplace();

    try {
      setIsLoading(true);
      setError('');
      const priceInWei = ethers.parseEther(price);
      const read = getReadContract();
      const listPrice = await read.getListPrice();
      const contract = await getWriteContract();
      const tx = await contract.relistToken(tokenId, priceInWei, { value: listPrice });
      const receipt = await tx.wait();
      setTxHash(receipt.hash);
      return receipt;
    } catch (err) {
      const e = err as Error & { reason?: string };
      const message = e.reason || e.message || 'Failed to relist NFT';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [account, ensureMarketplace]);

  const cancelListing = useCallback(async (tokenId: bigint) => {
    if (!account) {
      throw new Error('Wallet not connected');
    }
    ensureMarketplace();

    try {
      setIsLoading(true);
      setError('');
      const contract = await getWriteContract();
      const tx = await contract.cancelListing(tokenId);
      const receipt = await tx.wait();
      setTxHash(receipt.hash);
      return receipt;
    } catch (err) {
      const e = err as Error & { reason?: string };
      const message = e.reason || e.message || 'Failed to cancel listing';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [account, ensureMarketplace]);

  const getAllNFTs = useCallback(async (): Promise<ListedToken[]> => {
    try {
      ensureMarketplace();
      const result = (await getReadContract().getAllNFTs()) as RawToken[];
      return result.map(mapRawToken);
    } catch (err) {
      console.error('Error fetching all NFTs:', err);
      return [];
    }
  }, [ensureMarketplace]);

  const getMyNFTs = useCallback(async (): Promise<ListedToken[]> => {
    if (!account) return [];
    try {
      ensureMarketplace();
      const result = (await getReadContract().getMyNFTs()) as RawToken[];
      return result.map(mapRawToken);
    } catch (err) {
      console.error('Error fetching my NFTs:', err);
      return [];
    }
  }, [account, ensureMarketplace]);

  const getListedTokenForId = useCallback(async (tokenId: bigint): Promise<ListedToken | null> => {
    try {
      ensureMarketplace();
      const item = (await getReadContract().getListedTokenForId(tokenId)) as RawToken;
      if (Number(item.tokenId) === 0) return null;
      return mapRawToken(item);
    } catch (err) {
      console.error(`Error fetching token ${tokenId}:`, err);
      return null;
    }
  }, [ensureMarketplace]);

  const getListPrice = useCallback(async (): Promise<string> => {
    try {
      ensureMarketplace();
      const listPrice = await getReadContract().getListPrice();
      return ethers.formatEther(listPrice);
    } catch (err) {
      console.error('Error fetching list price:', err);
      return '0.000001';
    }
  }, [ensureMarketplace]);

  const getMinPrice = useCallback(async (): Promise<string> => {
    try {
      ensureMarketplace();
      const minPrice = await getReadContract().getMinPrice();
      return ethers.formatEther(minPrice);
    } catch (err) {
      console.error('Error fetching min price:', err);
      return '0.000001';
    }
  }, [ensureMarketplace]);

  const getMarketplaceStats = useCallback(async (): Promise<MarketplaceStats> => {
    try {
      ensureMarketplace();
      const result = await getReadContract().getCompanyStats();
      const [totalTokens, totalSold, currentListings] = result as [bigint, bigint, bigint];
      return {
        totalTokens: Number(totalTokens),
        totalSold: Number(totalSold),
        currentListings: Number(currentListings),
      };
    } catch (err) {
      console.error('Error fetching marketplace stats:', err);
      return { totalTokens: 0, totalSold: 0, currentListings: 0 };
    }
  }, [ensureMarketplace]);

  const fetchNFTMetadata = useCallback(async (tokenId: bigint): Promise<NFTMetadata | null> => {
    try {
      ensureMarketplace();
      const tokenURI = await getReadContract().tokenURI(tokenId);
      if (!tokenURI) return null;
      const response = await fetch(tokenURI as string);
      if (!response.ok) throw new Error('Failed to fetch metadata');
      return (await response.json()) as NFTMetadata;
    } catch (err) {
      console.error(`Error fetching metadata for token ${tokenId}:`, err);
      return null;
    }
  }, [ensureMarketplace]);

  const enrichNFTsWithMetadata = useCallback(async (nfts: ListedToken[]): Promise<NFTWithMetadata[]> => {
    const enrichedNFTs = await Promise.allSettled(
      nfts.map(async (nft): Promise<NFTWithMetadata> => {
        const metadata = await fetchNFTMetadata(nft.tokenId);
        return {
          ...nft,
          metadata,
          imageUrl: metadata?.image || metadata?.img_url,
          formattedPrice: ethers.formatEther(nft.price),
        };
      })
    );

    return enrichedNFTs
      .filter((result): result is PromiseFulfilledResult<NFTWithMetadata> => result.status === 'fulfilled')
      .map((result) => result.value);
  }, [fetchNFTMetadata]);

  const calculateSaleDetails = (price: bigint): SaleDetails => {
    const companyFee = (price * 250n) / 10000n;
    const creatorRoyalty = (price * 100n) / 10000n;
    const sellerAmount = price - companyFee - creatorRoyalty;
    return { price, companyFee, creatorRoyalty, sellerAmount };
  };

  return {
    createToken,
    buyNFT,
    relistNFT,
    cancelListing,
    getAllNFTs,
    getMyNFTs,
    getListedTokenForId,
    getListPrice,
    getMinPrice,
    getMarketplaceStats,
    fetchNFTMetadata,
    enrichNFTsWithMetadata,
    calculateSaleDetails,
    isLoading,
    txHash,
    error,
    isConnected: !!account,
  };
};
