import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log("Debug session endpoint - Full session:", JSON.stringify(session, null, 2))
    console.log("Debug session endpoint - Auth options:", JSON.stringify(authOptions, null, 2))
    
    return NextResponse.json({
      session,
      hasSession: !!session,
      hasUser: !!session?.user,
      hasUserId: !!session?.user?.id,
      userId: session?.user?.id,
      headers: Object.fromEntries(request.headers.entries())
    })
  } catch (error) {
    console.error("Debug session error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    )
  }
}
