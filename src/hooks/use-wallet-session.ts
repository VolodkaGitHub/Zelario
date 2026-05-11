"use client";

import { useAppSelector } from "@/redux/hooks";
import { useDemoWallet } from "@/lib/demo-wallet";

/** Single source of truth: wallet from login + demo-wallet / wagmi shim. */
export function useWalletSession() {
  const { isAuthenticated, user } = useAppSelector((state) => state.userAuth);
  const { address: demoAddress, isConnected: demoConnected, chainType } =
    useDemoWallet();

  const displayAddress = user?.walletAddress ?? demoAddress ?? null;
  const walletChainType = user?.walletChainType ?? chainType ?? "evm";
  const connected = isAuthenticated && !!displayAddress;
  const isEvm =
    walletChainType === "evm" ||
    (!!displayAddress && displayAddress.startsWith("0x"));

  return {
    isAuthenticated,
    user,
    displayAddress,
    walletChainType,
    connected,
    isEvm,
    demoConnected,
  };
}
