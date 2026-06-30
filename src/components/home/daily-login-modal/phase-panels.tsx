"use client"

import Link from "next/link"
import { Coins, CheckCircle, Clock, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DailyLoginStatus } from "@/types/rewards/rewards.types"
import { REWARD_AMOUNT } from "@/contants/rewards"
import { RewardCard, DismissButton } from "./primitives"

export function UnauthPanel({ onClose, rewardAmount = REWARD_AMOUNT }: { onClose: () => void; rewardAmount?: number }) {
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <div className="bg-gray-800 p-4 rounded-full">
        <LogIn className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-gray-300 text-sm">
        Sign in to claim your daily bonus of{" "}
        <span className="text-purple-400 font-semibold">{rewardAmount} ZEL points</span>.
      </p>
      <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
        <Link href="/user/login" onClick={onClose}>
          Sign in
        </Link>
      </Button>
    </div>
  )
}

export function ErrorPanel({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <p className="text-red-400 text-sm">{message}</p>
      <DismissButton onClick={onRetry} label="Retry" />
    </div>
  )
}

export function ClaimablePanel({ status, onClaim }: { status: DailyLoginStatus; onClaim: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5 py-4 text-center">
      <RewardCard
        color="yellow"
        icon={<Coins className="w-10 h-10 text-yellow-400" />}
        amount={`+${status.rewardAmount}`}
        label="ZEL Points"
      />
      <p className="text-gray-300 text-sm">Your daily bonus is ready to claim!</p>
      <Button
        onClick={onClaim}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-5"
      >
        Claim Bonus
      </Button>
    </div>
  )
}

export function SuccessPanel({ rewardAmount, onClose }: { rewardAmount: number; onClose: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      <RewardCard
        color="green"
        icon={<CheckCircle className="w-10 h-10 text-green-400" />}
        amount={`+${rewardAmount} ZEL`}
        label="Reward claimed successfully!"
      />
      <p className="text-gray-300 text-sm">Come back tomorrow for another bonus.</p>
      <DismissButton onClick={onClose} label="Done" />
    </div>
  )
}

function parseLocalDate(iso: string): Date | null {
  const parts = iso.split("-").map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) return null
  const [y, m, d] = parts
  return new Date(y, m - 1, d)
}

export function AlreadyClaimedPanel({ status, onClose }: { status: DailyLoginStatus; onClose: () => void }) {
  const parsed = status.lastClaimDate ? parseLocalDate(status.lastClaimDate) : null
  const formattedDate = parsed
    ? parsed.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      <RewardCard
        color="gray"
        icon={<Clock className="w-10 h-10 text-gray-500" />}
        label="Already claimed today"
      />
      {formattedDate && (
        <p className="text-gray-500 text-xs -mt-2">Last claim: {formattedDate}</p>
      )}
      <p className="text-gray-400 text-sm">
        Come back tomorrow for another{" "}
        <span className="text-purple-400 font-semibold">+{status.rewardAmount} ZEL</span> bonus.
      </p>
      <DismissButton onClick={onClose} />
    </div>
  )
}
