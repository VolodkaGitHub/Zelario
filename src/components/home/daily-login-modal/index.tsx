"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Gift } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { addPoints } from "@/redux/slices/userProfileSlice"
import { rewardsApiService } from "@/services/rewardsApiService"
import type { DailyLoginStatus } from "@/types/rewards/rewards.types"
import { SpinnerPane } from "./primitives"
import { UnauthPanel, ErrorPanel, ClaimablePanel, SuccessPanel, AlreadyClaimedPanel } from "./phase-panels"

interface Props {
  open: boolean
  onClose: () => void
}

type Phase = "idle" | "loading" | "ready" | "claiming" | "success" | "error"

export default function DailyLoginModal({ open, onClose }: Props) {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector((s) => s.userAuth.isAuthenticated)
  const token = useAppSelector((s) => s.userAuth.token)

  const [phase, setPhase] = useState<Phase>("idle")
  const [status, setStatus] = useState<DailyLoginStatus | null>(null)
  const [claimedAmount, setClaimedAmount] = useState(0)
  const [errorMsg, setErrorMsg] = useState("")

  const retryGenRef = useRef(0)

  const fetchStatus = useCallback(async () => {
    if (!token) return
    const gen = ++retryGenRef.current
    setPhase("loading")
    const res = await rewardsApiService.getDailyLoginStatus(token)
    if (retryGenRef.current !== gen) return
    if (res.success && res.data) {
      setStatus(res.data)
      setPhase("ready")
    } else {
      setErrorMsg(res.message ?? "Failed to load reward status")
      setPhase("error")
    }
  }, [token])

  useEffect(() => {
    if (open && isAuthenticated && token) {
      fetchStatus()
      return () => { retryGenRef.current++ }
    } else if (!open) {
      retryGenRef.current++
      setPhase("idle")
      setStatus(null)
      setClaimedAmount(0)
      setErrorMsg("")
    }
  }, [open, isAuthenticated, token, fetchStatus])

  const handleClaim = useCallback(async () => {
    if (!token) return
    setPhase("claiming")
    const res = await rewardsApiService.claimDailyLoginBonus(token)
    if (res.success && res.data) {
      const claimed = res.data
      dispatch(addPoints(claimed.rewardAmount))
      setClaimedAmount(claimed.rewardAmount)
      setStatus((prev) =>
        prev ? { ...prev, eligible: false, lastClaimDate: claimed.claimDate } : prev
      )
      setPhase("success")
    } else {
      setErrorMsg(res.message ?? "Failed to claim reward")
      setPhase("error")
    }
  }, [token, dispatch])

  function renderContent() {
    if (!isAuthenticated || !token) return <UnauthPanel onClose={onClose} />

    switch (phase) {
      case "idle":
      case "loading":
        return <SpinnerPane />
      case "claiming":
        return <SpinnerPane label="Claiming your reward…" />
      case "error":
        return <ErrorPanel message={errorMsg} onRetry={fetchStatus} />
      case "success":
        return <SuccessPanel rewardAmount={claimedAmount} onClose={onClose} />
      case "ready": {
        if (!status) return <SpinnerPane />
        return status.eligible
          ? <ClaimablePanel status={status} onClaim={handleClaim} />
          : <AlreadyClaimedPanel status={status} onClose={onClose} />
      }
      default:
        return <SpinnerPane />
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => !v && onClose()}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-purple-500/20 p-2 rounded-full">
              <Gift className="w-5 h-5 text-purple-400" />
            </div>
            <DialogTitle className="text-white text-lg">Daily Login Bonus</DialogTitle>
          </div>
          <DialogDescription className="text-gray-400">
            Earn ZEL points every day just for logging in.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  )
}
