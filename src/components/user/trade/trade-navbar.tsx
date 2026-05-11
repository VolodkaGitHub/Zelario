'use client';
import { WalletConnectButton } from '@/components/wallet/wallet-connect-button';
import { useWalletAccount } from '@/hooks/useWalletAccount';
import { useEffect, useRef, useState } from 'react';
import { saveWallet } from '@/services/walletApiService';

export default function TradeNavbar() {
  const { account } = useWalletAccount();
  const [error, setError] = useState<string | null>(null);
  const lastSavedAddress = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Check if wallet is connected and address exists
    if (account && account.address && account.address !== lastSavedAddress.current) {
      setError(null); // Clear previous errors
      lastSavedAddress.current = account.address;
      saveWallet(account.address)
        .then(() => {
          if (!cancelled) {

          }
        })
        .catch((err) => {
          if (!cancelled) {
            setError('Failed to save wallet address. Please try again.');
            console.error('Wallet save error:', err);
          }
        });
    }
    return () => {
      cancelled = true;
    };
  }, [account?.address]); // Run effect when address changes

  return (
    <div className="fixed top-28 left-0 w-full bg-gray-900 bg-opacity-80 backdrop-blur-md shadow-md z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3">
        <h2 className="text-lg font-semibold text-gray-200">Trade</h2>
        <div>
          {error && (
            <div className="text-red-500 mb-2 text-sm">{error}</div>
          )}
          <WalletConnectButton />
        </div>
      </div>
    </div>
  );
}