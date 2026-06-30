"use client"

import { type ReactNode } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export const CARD_CONFIG: Record<"yellow" | "green" | "gray", { border: string; text: string }> = {
  yellow: { border: "bg-yellow-500/10 border-yellow-500/30", text: "text-yellow-400" },
  green:  { border: "bg-green-500/10 border-green-500/30",  text: "text-green-400" },
  gray:   { border: "bg-gray-800 border-gray-700",           text: "text-gray-300" },
}

const DISMISS_CLASS = "border-gray-700 text-gray-300 hover:bg-gray-800"

export function SpinnerPane({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10">
      <Loader2 className="w-7 h-7 animate-spin text-purple-400" />
      {label && <p className="text-gray-400 text-sm">{label}</p>}
    </div>
  )
}

export function RewardCard({
  color,
  icon,
  amount,
  label,
}: {
  color: "yellow" | "green" | "gray"
  icon: ReactNode
  amount?: string
  label: string
}) {
  const { border, text } = CARD_CONFIG[color]
  return (
    <div className={`border rounded-xl p-5 w-full text-center ${border}`}>
      <div className="mx-auto mb-2 w-fit">{icon}</div>
      {amount && <p className={`text-2xl font-bold ${text}`}>{amount}</p>}
      <p className={`text-sm mt-1 ${amount ? "text-gray-400" : `${text} font-semibold`}`}>
        {label}
      </p>
    </div>
  )
}

export function DismissButton({ onClick, label = "Close" }: { onClick: () => void; label?: string }) {
  return (
    <Button variant="outline" className={DISMISS_CLASS} onClick={onClick}>
      {label}
    </Button>
  )
}
