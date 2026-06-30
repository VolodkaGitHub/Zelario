import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const auth = req.headers.get("Authorization")
  const token = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : ""
  
  const isValid = token.length >= 10 && /^[A-Za-z0-9\-_.]+$/.test(token)
  if (!isValid) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    )
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/api/rewards/:path*"],
}
