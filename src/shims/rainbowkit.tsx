"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { openWallet } from "@/redux/slices/walletSlice";
import { useWalletSession } from "@/hooks/use-wallet-session";
import { USER_ROUTES } from "@/routes";

function formatAddress(addr: string) {
  return addr.length > 12 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;
}

export function RainbowKitProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

type CustomRenderProps = {
  account?: {
    address: string;
    displayName: string;
    displayBalance?: string;
  };
  chain?: {
    id: number;
    name: string;
    unsupported?: boolean;
    hasIcon?: boolean;
    iconUrl?: string;
    iconBackground?: string;
  };
  openConnectModal: () => void;
  openAccountModal: () => void;
  openChainModal: () => void;
  mounted: boolean;
};

function useConnectRenderProps(): CustomRenderProps {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { connected, displayAddress, isEvm } = useWalletSession();

  const goLogin = () => router.push(USER_ROUTES.LOGIN);

  if (!connected || !displayAddress) {
    return {
      openConnectModal: goLogin,
      openAccountModal: goLogin,
      openChainModal: goLogin,
      mounted: true,
    };
  }

  return {
    account: {
      address: displayAddress,
      displayName: formatAddress(displayAddress),
    },
    chain: isEvm
      ? {
          id: 11155111,
          name: "Ethereum",
          unsupported: false,
          hasIcon: false,
        }
      : {
          id: 0,
          name: "Solana",
          unsupported: false,
          hasIcon: false,
        },
    openConnectModal: goLogin,
    openAccountModal: () => dispatch(openWallet()),
    openChainModal: () => {},
    mounted: true,
  };
}

/** Shows wallet status from login session; opens wallet panel when connected. */
export function ConnectButton() {
  const { connected, displayAddress } = useWalletSession();
  const dispatch = useAppDispatch();

  if (connected && displayAddress) {
    return (
      <button
        type="button"
        onClick={() => dispatch(openWallet())}
        className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-gray-200 hover:bg-white/10"
        title={displayAddress}
      >
        {formatAddress(displayAddress)}
      </button>
    );
  }

  return (
    <Link
      href={USER_ROUTES.LOGIN}
      className="inline-flex items-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
    >
      Sign in with wallet
    </Link>
  );
}

function ConnectButtonCustom({
  children,
}: {
  children: (props: CustomRenderProps) => ReactNode;
}) {
  const props = useConnectRenderProps();
  const { connected, displayAddress } = useWalletSession();
  const account = connected && displayAddress ? props.account : undefined;
  const chain = connected && displayAddress ? props.chain : undefined;

  return (
    <>
      {children({
        ...props,
        account,
        chain,
      })}
    </>
  );
}

ConnectButton.Custom = ConnectButtonCustom;

export function darkTheme(_opts?: Record<string, unknown>) {
  return {};
}

export function getDefaultConfig(config: unknown) {
  return config;
}
