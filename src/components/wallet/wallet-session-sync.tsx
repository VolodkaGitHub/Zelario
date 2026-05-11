"use client";

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useAppDispatch } from "@/redux/hooks";
import { setUserWallet } from "@/redux/slices/userAuthSlice";
import { useDemoWallet } from "@/lib/demo-wallet";
import {
  applyWalletSessionToStore,
  walletFromUser,
} from "@/lib/wallet-session";
import { saveWallet } from "@/services/walletApiService";

/**
 * When the user signs in with a wallet on /user/login, mirror that session
 * across demo-wallet (wagmi shim), Redux wallet slice, and backend save.
 */
export function WalletSessionSync() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.userAuth
  );
  const persistedWalletAddress = useSelector(
    (state: RootState) => state.wallet.address
  );
  const { setSession, disconnect } = useDemoWallet();
  const lastSynced = useRef<string | null>(null);
  const lastSaved = useRef<string | null>(null);

  useEffect(() => {
    if (
      isAuthenticated &&
      user &&
      !user.walletAddress &&
      persistedWalletAddress
    ) {
      dispatch(
        setUserWallet({
          walletAddress: persistedWalletAddress,
          walletChainType: "evm",
        })
      );
    }
  }, [isAuthenticated, user, user?.walletAddress, persistedWalletAddress, dispatch]);

  useEffect(() => {
    const session = isAuthenticated ? walletFromUser(user) : null;

    if (session) {
      const key = `${session.address}:${session.chainType}`;
      if (lastSynced.current !== key) {
        lastSynced.current = key;
        setSession(session.address, session.chainType);
        applyWalletSessionToStore(dispatch, session);
      }

      if (
        session.chainType === "evm" &&
        lastSaved.current !== session.address
      ) {
        lastSaved.current = session.address;
        saveWallet(session.address).catch(() => {});
      }
    } else {
      lastSynced.current = null;
      lastSaved.current = null;
      disconnect();
      applyWalletSessionToStore(dispatch, null);
    }
  }, [
    isAuthenticated,
    user?.walletAddress,
    user?.walletChainType,
    setSession,
    disconnect,
    dispatch,
  ]);

  return null;
}
