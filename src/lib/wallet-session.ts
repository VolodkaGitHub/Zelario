import type { AppDispatch } from "@/redux/store";
import { connectWallet, disconnectWallet } from "@/redux/slices/walletSlice";
import type { WalletChainType } from "@/types/wallet";

export type WalletSessionPayload = {
  address: string;
  chainType: WalletChainType;
};

/** Keep Redux wallet slice aligned with auth / demo wallet context. */
export function applyWalletSessionToStore(
  dispatch: AppDispatch,
  session: WalletSessionPayload | null
) {
  if (session) {
    dispatch(
      connectWallet({
        address: session.address,
        balance: "0.00",
      })
    );
  } else {
    dispatch(disconnectWallet());
  }
}

export function walletFromUser(user: {
  walletAddress?: string;
  walletChainType?: WalletChainType;
} | null): WalletSessionPayload | null {
  if (!user?.walletAddress) return null;
  return {
    address: user.walletAddress,
    chainType: user.walletChainType ?? "evm",
  };
}
