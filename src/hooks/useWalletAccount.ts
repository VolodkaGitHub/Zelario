'use client';

import { useAccount } from 'wagmi';
import { useWalletSession } from '@/hooks/use-wallet-session';

/** Wallet address aligned with login session + demo/wagmi shim. */
export function useWalletAccount() {
  const { address, isConnecting } = useAccount();
  const { displayAddress, connected, isEvm } = useWalletSession();

  const resolved =
    address ??
    (displayAddress && (isEvm || displayAddress.startsWith('0x'))
      ? (displayAddress as `0x${string}`)
      : undefined);

  return {
    address: resolved,
    isConnected: connected && !!resolved,
    isConnecting,
    account: resolved ? { address: resolved } : undefined,
  };
}
