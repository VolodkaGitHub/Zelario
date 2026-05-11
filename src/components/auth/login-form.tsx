"use client"

import type React from "react"
import { useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { Loader2, Wallet, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { login as reduxLogin, setLoading } from "@/redux/slices/userAuthSlice"
import type { RootState } from "@/redux/store"
import { walletLogin } from "@/services/authApiService"
import { applyWalletSessionToStore } from "@/lib/wallet-session"
import {
  connectWalletProvider,
  getDetectedWallets,
  walletInstallUrl,
} from "@/lib/wallet-connectors"
import { COMMON_ROUTES } from "@/routes"
import type { WalletProviderId } from "@/types/wallet"

const WALLET_OPTIONS: {
  id: WalletProviderId
  label: string
  description: string
}[] = [
  { id: "metamask", label: "MetaMask", description: "Popular Ethereum wallet" },
  { id: "rabby", label: "Rabby", description: "Multi-chain DeFi wallet" },
  { id: "injected", label: "Browser Wallet", description: "Any injected Web3 wallet" },
  { id: "phantom", label: "Phantom", description: "Solana & multi-chain" },
]

function providerIcon(id: WalletProviderId) {
  const base = "w-5 h-5 rounded";
  switch (id) {
    case "metamask":
      return (
        <span className={`${base} bg-orange-500/20 text-orange-400 flex items-center justify-center text-[10px] font-bold`}>
          MM
        </span>
      );
    case "rabby":
      return (
        <span className={`${base} bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold`}>
          R
        </span>
      );
    case "phantom":
      return (
        <span className={`${base} bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px] font-bold`}>
          PH
        </span>
      );
    default:
      return <Wallet className="w-5 h-5 text-gray-300" />;
  }
}

export function LoginForm() {
  const [detected, setDetected] = useState<WalletProviderId[]>([])
  const [connectingId, setConnectingId] = useState<WalletProviderId | null>(null)
  const { toast } = useToast()
  const { loading } = useSelector((state: RootState) => state.userAuth)
  const dispatch = useDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect") || COMMON_ROUTES.HOME

  useEffect(() => {
    setDetected(getDetectedWallets())
  }, [])

  const visibleOptions = WALLET_OPTIONS.filter((opt) => {
    if (opt.id === "injected") {
      return (
        detected.includes("injected") &&
        !detected.includes("metamask") &&
        !detected.includes("rabby")
      )
    }
    return detected.includes(opt.id)
  })

  const installOptions = WALLET_OPTIONS.filter(
    (opt) => opt.id !== "injected" && !detected.includes(opt.id)
  )

  const handleWalletConnect = useCallback(
    async (providerId: WalletProviderId) => {
      setConnectingId(providerId)
      dispatch(setLoading(true))

      try {
        const connection = await connectWalletProvider(providerId)
        const result = await walletLogin({
          address: connection.address,
          chainType: connection.chainType,
          provider: connection.provider,
          message: connection.message,
          signature: connection.signature,
        })

        if (!result.success || !result.user) {
          throw new Error(result.error || "Wallet authentication failed")
        }

        dispatch(
          reduxLogin({
            user: {
              ...result.user,
              walletAddress: connection.address,
              walletChainType: connection.chainType,
            },
            token: result.token,
          })
        )
        applyWalletSessionToStore(dispatch, {
          address: connection.address,
          chainType: connection.chainType,
        })

        toast({
          title: "Wallet connected",
          description: "You're signed in to Zelario.",
          className: "bg-gradient-to-r from-green-500 to-teal-500 text-white border-none",
        })

        router.push(redirectUrl)
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Could not connect wallet"
        toast({
          title: "Connection failed",
          description: message,
          variant: "destructive",
        })
      } finally {
        setConnectingId(null)
        dispatch(setLoading(false))
      }
    },
    [dispatch, redirectUrl, router, toast]
  )

  const busy = loading || connectingId !== null

  return (
    <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/50">
      <div className="space-y-1 mb-6 text-center lg:text-left">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Connect your wallet
        </h2>
        <p className="text-xs text-gray-400">
          Sign in with MetaMask, Rabby, Phantom, or another Web3 wallet. New
          accounts are created automatically from your wallet address.
        </p>
      </div>

      <div className="space-y-3">
        {visibleOptions.length > 0 ? (
          visibleOptions.map((opt) => (
            <Button
              key={opt.id}
              type="button"
              disabled={busy}
              onClick={() => handleWalletConnect(opt.id)}
              className="w-full h-12 justify-start gap-3 bg-black/30 border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 text-white rounded-xl"
              variant="outline"
            >
              {connectingId === opt.id ? (
                <Loader2 className="h-5 w-5 animate-spin shrink-0" />
              ) : (
                providerIcon(opt.id)
              )}
              <span className="flex flex-col items-start text-left">
                <span className="font-semibold text-sm">{opt.label}</span>
                <span className="text-[10px] text-gray-500 font-normal">
                  {opt.description}
                </span>
              </span>
            </Button>
          ))
        ) : (
          <p className="text-sm text-gray-400 text-center py-2">
            No wallet extension detected. Install MetaMask, Rabby, or Phantom below.
          </p>
        )}

        {installOptions.length > 0 && (
          <div className="pt-2 border-t border-white/10">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 text-center">
              Install a wallet
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {installOptions.map((opt) => (
                <a
                  key={opt.id}
                  href={walletInstallUrl(opt.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded-lg border border-white/10 hover:border-cyan-500/30"
                >
                  {opt.label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-[11px] text-gray-500 leading-relaxed">
        By connecting, you agree to sign a one-time message to verify wallet
        ownership. Email and password sign-in are no longer required.
      </p>
    </div>
  )
}
