"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { USER_ROUTES } from "@/routes"

/** Registration is wallet-based: same flow as login (auto-creates account). */
export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")

  useEffect(() => {
    const target = redirect
      ? `${USER_ROUTES.LOGIN}?redirect=${encodeURIComponent(redirect)}`
      : USER_ROUTES.LOGIN
    router.replace(target)
  }, [router, redirect])

  return null
}
