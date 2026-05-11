"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  connectWallet as connectWalletAction,
  disconnectWallet,
  updateBalance,
} from "@/redux/slices/walletSlice";
import { useDemoWallet } from "@/lib/demo-wallet";
import { walletFromUser, applyWalletSessionToStore } from "@/lib/wallet-session";
import { getWalletBalance } from "@/services/walletApiService";
import { useWalletSession } from "@/hooks/use-wallet-session";
import { USER_ROUTES } from "@/routes";

/**
 * Wallet hook backed by the login session (WalletSessionSync).
 */
export const useWallet = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isConnected, address, balance, loading } = useAppSelector(
    (state) => state.wallet
  );
  const { isAuthenticated, user, displayAddress, connected } =
    useWalletSession();
  const demo = useDemoWallet();

  const handleConnect = useCallback(async () => {
    const session = walletFromUser(user);
    if (session) {
      demo.setSession(session.address, session.chainType);
      applyWalletSessionToStore(dispatch, session);
      return;
    }
    router.push(USER_ROUTES.LOGIN);
  }, [user, demo, dispatch, router]);

  const handleDisconnect = useCallback(() => {
    dispatch(disconnectWallet());
    demo.disconnect();
  }, [dispatch, demo]);

  const refreshBalance = useCallback(async () => {
    if (!displayAddress) return;
    try {
      const newBalance = await getWalletBalance(displayAddress);
      dispatch(updateBalance(newBalance));
    } catch (error) {
      console.error("Failed to refresh balance:", error);
    }
  }, [displayAddress, dispatch]);

  useEffect(() => {
    if (isAuthenticated && displayAddress && !isConnected) {
      const session = walletFromUser(user);
      if (session) {
        demo.setSession(session.address, session.chainType);
        applyWalletSessionToStore(dispatch, session);
      }
    }
  }, [
    isAuthenticated,
    displayAddress,
    isConnected,
    dispatch,
    demo,
    user?.walletAddress,
    user?.walletChainType,
    user,
  ]);

  return {
    isConnected: connected,
    address: displayAddress ?? address,
    balance,
    loading,
    connect: handleConnect,
    disconnect: handleDisconnect,
    refreshBalance,
  };
};
