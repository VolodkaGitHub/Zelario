'use client';

import { createConfig, http } from 'wagmi';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, baseSepolia, bscTestnet } from 'wagmi/chains';
import { ReactNode } from 'react';
import { injected, metaMask } from 'wagmi/connectors';

const chains = [sepolia, baseSepolia, bscTestnet] as const;
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim();

const config = projectId
  ? getDefaultConfig({
      appName: 'Wallet App',
      projectId,
      chains: [...chains],
      ssr: true,
    })
  : createConfig({
      chains: [...chains],
      connectors: [injected(), metaMask()],
      transports: {
        [sepolia.id]: http(),
        [baseSepolia.id]: http(),
        [bscTestnet.id]: http(),
      },
      ssr: true,
    });

const queryClient = new QueryClient();

export function WagmiProviderFn({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}