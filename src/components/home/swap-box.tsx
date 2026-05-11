"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowDown, Loader2, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useWalletConnectAction } from "@/hooks/use-wallet-connect-action"
import { useWalletSession } from "@/hooks/use-wallet-session"
import { useAppDispatch } from "@/redux/hooks"
import { openWallet } from "@/redux/slices/walletSlice"
import { USER_ROUTES } from "@/routes"
import Image from "next/image"

interface Coin {
  id: string
  name: string
  symbol: string
  image: string
  current_price?: number
}

// Fallback data
const fallbackCoins: Coin[] = [
  { id: "bitcoin", name: "Bitcoin", symbol: "btc", image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png", current_price: 65000 },
  { id: "ethereum", name: "Ethereum", symbol: "eth", image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png", current_price: 3500 },
]

const actionBtnClass =
  "w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-lg font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"

export default function SwapBox() {
  const dispatch = useAppDispatch()
  const { walletReady, requireWallet, connecting } = useWalletConnectAction()
  const { displayAddress } = useWalletSession()
  const [fromCoin, setFromCoin] = useState<Coin>(fallbackCoins[0])
  const [toCoin, setToCoin] = useState<Coin>(fallbackCoins[1])
  const [fromAmount, setFromAmount] = useState<string>("")
  const [toAmount, setToAmount] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const formatAddress = (addr: string) =>
    addr.length > 12 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr

  // Fetch only BTC and ETH to get real prices
  useEffect(() => {
    const controller = new AbortController()

    const fetchCoins = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          vs_currency: "usd",
          ids: "bitcoin,ethereum",
          order: "market_cap_desc",
          sparkline: "false",
        })
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?${params}`,
          { signal: controller.signal }
        )
        if (!response.ok) return
        const data = (await response.json()) as Coin[]
        if (Array.isArray(data)) {
          const btc = data.find((c) => c.id === "bitcoin")
          const eth = data.find((c) => c.id === "ethereum")

          if (btc && eth) {
            setFromCoin((prev) => (prev.id === "bitcoin" ? btc : eth))
            setToCoin((prev) => (prev.id === "bitcoin" ? eth : btc))
          }
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Failed to fetch coins:", error)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchCoins()

    return () => {
      controller.abort()
    }
  }, [])

  const updateEstimate = (val: string, type: "from" | "to", fCoin: Coin, tCoin: Coin) => {
    const fromPrice = fCoin.current_price || 0
    const toPrice = tCoin.current_price || 1

    if (!val || isNaN(parseFloat(val))) {
      if (type === 'from') setToAmount("")
      else setFromAmount("")
      return
    }

    const amount = parseFloat(val)

    if (type === "from") {
      const estimated = (amount * fromPrice / toPrice).toFixed(6)
      setToAmount(estimated)
    } else {
      const estimated = (amount * toPrice / fromPrice).toFixed(6)
      setFromAmount(estimated)
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>, type: "from" | "to") => {
    const value = e.target.value
    if (type === "from") {
      setFromAmount(value)
      updateEstimate(value, "from", fromCoin, toCoin)
    } else {
      setToAmount(value)
      updateEstimate(value, "to", fromCoin, toCoin)
    }
  }

  const handleMaxClick = (type: "from" | "to") => {
    if (type === "from") {
      const maxVal = "1.5432"
      setFromAmount(maxVal)
      updateEstimate(maxVal, "from", fromCoin, toCoin)
    }
  }

  const swapCoins = () => {
    const tempCoin = fromCoin
    setFromCoin(toCoin)
    setToCoin(tempCoin)

    // Swap amounts logically
    const tempAmount = fromAmount
    setFromAmount(toAmount)
    setToAmount(tempAmount)
  }

  return (
    <TooltipProvider>
      <Card className="w-full max-w-md mx-auto bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-center text-white">Swap Tokens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="from-amount" className="text-sm font-medium text-gray-400">
                You pay
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMaxClick("from")}
                className="text-xs h-auto px-2 py-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
              >
                Max
              </Button>
            </div>
            <div className="flex items-center bg-white/5 rounded-2xl border border-white/10 pr-2 hover:border-white/20 transition-colors">
              <Input
                id="from-amount"
                type="number"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => handleAmountChange(e, "from")}
                className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-2xl font-bold py-6 bg-transparent text-white placeholder:text-gray-600"
              />
              <div className="flex items-center gap-2 text-white bg-white/5 rounded-xl px-3 py-2 h-auto border border-white/5 mx-2">
                <Image
                  src={fromCoin.image || "/placeholder.svg"}
                  alt={fromCoin.name}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-semibold uppercase">{fromCoin.symbol}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center -my-2 relative z-10">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-black/50 border-white/10 text-white hover:bg-white/10 hover:border-white/30 h-10 w-10 backdrop-blur-md"
                  onClick={swapCoins}
                >
                  <ArrowDown className="h-5 w-5" />
                  <span className="sr-only">Swap coins</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-black/90 border-white/10 text-white">Swap Coins</TooltipContent>
            </Tooltip>
          </div>

          <div className="space-y-2">
            <label htmlFor="to-amount" className="text-sm font-medium text-gray-400">
              You receive
            </label>
            <div className="flex items-center bg-white/5 rounded-2xl border border-white/10 pr-2 hover:border-white/20 transition-colors">
              <Input
                id="to-amount"
                type="number"
                placeholder="0.0"
                value={toAmount}
                onChange={(e) => handleAmountChange(e, "to")}
                className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-2xl font-bold py-6 bg-transparent text-white placeholder:text-gray-600"
              />
              <div className="flex items-center gap-2 text-white bg-white/5 rounded-xl px-3 py-2 h-auto border border-white/5 mx-2">
                <Image
                  src={toCoin.image || "/placeholder.svg"}
                  alt={toCoin.name}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-semibold uppercase">{toCoin.symbol}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-sm text-gray-400 bg-white/5 p-4 rounded-xl border border-white/5">
            <div className="flex justify-between">
              <span>Slippage Tolerance</span>
              <span className="text-white">0.5%</span>
            </div>
            <div className="flex justify-between">
              <span>Minimum Received</span>
              <span className="text-white">
                {toAmount ? (Number.parseFloat(toAmount) * 0.995).toFixed(6) : "0.00"} {toCoin.symbol.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Gas</span>
              <span className="text-white">~$5.00</span>
            </div>
          </div>

          {walletReady && displayAddress ? (
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => dispatch(openWallet())}
                className="w-full h-11 border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl"
                title={displayAddress}
              >
                <Wallet className="w-4 h-4 mr-2" />
                {formatAddress(displayAddress)}
              </Button>
              <Button asChild className={actionBtnClass}>
                <Link href={USER_ROUTES.SWAP}>Swap Tokens</Link>
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              disabled={connecting}
              onClick={() => requireWallet()}
              className={actionBtnClass}
            >
              {connecting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Connecting…
                </>
              ) : (
                "Connect Wallet"
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
