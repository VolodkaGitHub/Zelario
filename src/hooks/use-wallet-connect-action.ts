"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/hooks/use-wallet";
import { useWalletSession } from "@/hooks/use-wallet-session";
import { USER_ROUTES } from "@/routes";

/** Gate trade actions on login wallet session; connect or redirect when missing. */
export function useWalletConnectAction() {
  const router = useRouter();
  const { connected, isAuthenticated, displayAddress } = useWalletSession();
  const { connect, loading: connecting } = useWallet();

  const walletReady = connected && !!displayAddress;

  const requireWallet = useCallback(async (): Promise<boolean> => {
    if (walletReady) return true;
    if (!isAuthenticated) {
      router.push(USER_ROUTES.LOGIN);
      return false;
    }
    await connect();
    return false;
  }, [walletReady, isAuthenticated, connect, router]);

  return {
    walletReady,
    isAuthenticated,
    displayAddress,
    requireWallet,
    connecting,
  };
}
