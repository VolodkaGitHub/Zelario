"use client";

import type React from "react";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { DemoWalletProvider } from "@/lib/demo-wallet";
import { WalletSessionSync } from "@/components/wallet/wallet-session-sync";
import WalletSidebar from "@/components/wallet-sidebar";
import { PersistLoading } from "@/components/ui/persist-loading";
import { setupAxiosInterceptors } from "@/lib/api-client";
import { setLoading } from "@/redux/slices/userAuthSlice";
import { store, persistor } from "@/redux/store";
import type { RootState } from "@/redux/store";
import { WagmiProvider } from "wagmi";

const GlobalChatListener = dynamic(
  () =>
    import("@/components/chat/GlobalChatListener").then(
      (m) => m.GlobalChatListener
    ),
  { ssr: false }
);

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.userAuth.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.userAuth.isAuthenticated
  );
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      dispatch(setLoading(false));
      isMounted.current = true;
    }
  }, [dispatch]);

  return (
    <>
      {isAuthenticated && user ? <GlobalChatListener /> : null}
      {children}
    </>
  );
}

function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setupAxiosInterceptors(store);
  }, []);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim();

  const tree = (
    <Provider store={store}>
      <PersistGate loading={<PersistLoading />} persistor={persistor}>
        <DemoWalletProvider>
          <WagmiProvider config={{}}>
            <WalletSessionSync />
            <AuthInitializer>{children}</AuthInitializer>
            <WalletSidebar />
          </WagmiProvider>
        </DemoWalletProvider>
      </PersistGate>
    </Provider>
  );

  if (googleClientId) {
    return (
      <GoogleOAuthProvider clientId={googleClientId}>{tree}</GoogleOAuthProvider>
    );
  }
  return tree;
}

/** Single client app shell — SPA rendering (no server session / cookies). */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <AppProviders>{children}</AppProviders>
      <SonnerToaster position="top-right" richColors />
    </ThemeProvider>
  );
}
