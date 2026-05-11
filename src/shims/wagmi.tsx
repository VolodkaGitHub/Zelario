"use client";

import { useDemoWallet } from "@/lib/demo-wallet";
import { useWalletSession } from "@/hooks/use-wallet-session";

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useAccount() {
  const { address: demoAddress, isConnecting, chainType } = useDemoWallet();
  const { displayAddress, connected, isEvm } = useWalletSession();

  const raw = displayAddress ?? demoAddress;
  const evmAddress =
    raw && (raw.startsWith("0x") || isEvm) ? (raw as `0x${string}`) : undefined;

  return {
    address: evmAddress,
    isConnected: connected && !!evmAddress,
    isConnecting,
    isDisconnected: !connected || !evmAddress,
    status:
      connected && evmAddress
        ? ("connected" as const)
        : ("disconnected" as const),
    chain: { id: 11155111, name: "Sepolia (demo)" },
    chainType: chainType ?? "evm",
  };
}

export function useConnect() {
  const { connect, isConnecting } = useDemoWallet();
  return {
    connect: () => connect("injected"),
    connectors: [{ id: "injected", name: "Browser Wallet" }],
    isPending: isConnecting,
  };
}

export function useDisconnect() {
  const { disconnect } = useDemoWallet();
  return { disconnect: () => disconnect() };
}

export function useChainId() {
  return 11155111;
}

export function useSwitchChain() {
  return { switchChain: async () => {} };
}

export function useSendTransaction() {
  const { connect } = useDemoWallet();
  return {
    sendTransaction: async () => {
      connect();
      return { hash: "0xdemo" as `0x${string}` };
    },
    isPending: false,
  };
}

export function createConfig(config: unknown) {
  return config;
}

export function http() {
  return {};
}
