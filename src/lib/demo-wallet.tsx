"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  connectWalletProvider,
  type WalletConnectionResult,
} from "@/lib/wallet-connectors";
import type { WalletChainType, WalletProviderId } from "@/types/wallet";

type DemoWalletContextValue = {
  address: string | undefined;
  chainType: WalletChainType | null;
  provider: WalletProviderId | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: (provider?: WalletProviderId) => Promise<WalletConnectionResult>;
  setSession: (address: string, chainType?: WalletChainType) => void;
  disconnect: () => void;
};

const DemoWalletContext = createContext<DemoWalletContextValue | null>(null);

export function DemoWalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [chainType, setChainType] = useState<WalletChainType | null>(null);
  const [provider, setProvider] = useState<WalletProviderId | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const applyConnection = useCallback((result: WalletConnectionResult) => {
    setAddress(result.address);
    setChainType(result.chainType);
    setProvider(result.provider);
    return result;
  }, []);

  const connect = useCallback(
    async (walletProvider: WalletProviderId = "injected") => {
      setIsConnecting(true);
      try {
        const result = await connectWalletProvider(walletProvider);
        return applyConnection(result);
      } finally {
        setIsConnecting(false);
      }
    },
    [applyConnection]
  );

  const setSession = useCallback(
    (addr: string, chain: WalletChainType = "evm") => {
      setAddress(addr);
      setChainType(chain);
      setProvider("injected");
    },
    []
  );

  const disconnect = useCallback(() => {
    setAddress(undefined);
    setChainType(null);
    setProvider(null);
  }, []);

  const value = useMemo(
    () => ({
      address,
      chainType,
      provider,
      isConnected: !!address,
      isConnecting,
      connect,
      setSession,
      disconnect,
    }),
    [address, chainType, provider, isConnecting, connect, setSession, disconnect]
  );

  return (
    <DemoWalletContext.Provider value={value}>
      {children}
    </DemoWalletContext.Provider>
  );
}

export function useDemoWallet() {
  const ctx = useContext(DemoWalletContext);
  if (!ctx) {
    throw new Error("useDemoWallet must be used within DemoWalletProvider");
  }
  return ctx;
}
