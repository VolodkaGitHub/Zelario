'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { saveWallet } from '@/services/walletApiService';

function WalletSaver() {
  const { address } = useAccount();
  const lastSavedAddress = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (address && address !== lastSavedAddress.current) {
      lastSavedAddress.current = address;
      saveWallet(address).catch((err) => {
        if (!cancelled) {
          console.error('Wallet save error:', err);
        }
      });
    }

    return () => {
      cancelled = true;
    };
  }, [address]);

  return null;
}

/** Persists connected wallet address to the backend when the user connects. */
export function WalletSyncProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <WalletSaver />
      {children}
    </>
  );
}
