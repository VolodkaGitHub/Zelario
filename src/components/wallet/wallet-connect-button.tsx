"use client";

import Link from "next/link";
import { Loader2, Wallet } from "lucide-react";
import { useAppDispatch } from "@/redux/hooks";
import { openWallet } from "@/redux/slices/walletSlice";
import { useWallet } from "@/hooks/use-wallet";
import { useWalletSession } from "@/hooks/use-wallet-session";
import { USER_ROUTES } from "@/routes";
import { Button } from "@/components/ui/button";

type WalletConnectButtonProps = {
  className?: string;
  variant?: "default" | "outline" | "ghost";
};

/** Wallet button synced with /user/login wallet session. */
export function WalletConnectButton({
  className = "",
  variant = "default",
}: WalletConnectButtonProps) {
  const dispatch = useAppDispatch();
  const { connected, displayAddress, isAuthenticated } = useWalletSession();
  const { loading, connect } = useWallet();

  const formatAddress = (addr: string) =>
    `${addr.slice(0, 6)}…${addr.slice(-4)}`;

  if (connected && displayAddress) {
    return (
      <Button
        type="button"
        variant={variant}
        onClick={() => dispatch(openWallet())}
        className={className}
        title={displayAddress}
      >
        <Wallet className="w-4 h-4 mr-2" />
        {formatAddress(displayAddress)}
      </Button>
    );
  }

  if (!isAuthenticated) {
    return (
      <Button variant={variant} className={className} asChild>
        <Link href={USER_ROUTES.LOGIN}>Sign in with wallet</Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={variant}
      disabled={loading}
      onClick={() => connect()}
      className={className}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Wallet className="w-4 h-4 mr-2" />
      )}
      Connect wallet
    </Button>
  );
}
