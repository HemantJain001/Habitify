import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/behaviors - Get behavior entries for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
    const date = searchParams.get('date')

    const whereClause: any = { userId: session.user.id }
    
    if (date) {
      const targetDate = new Date(date)
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0))
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999))
      
      whereClause.createdAt = {
        gte: startOfDay,
        lte: endOfDay
      }
    }

    const behaviorEntries = await prisma.behaviorEntry.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined
    })

    return NextResponse.json({ behaviorEntries })
  } catch (error) {
    console.error("Get behavior entries error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/behaviors - Create a new behavior entry
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { 
      title, 
      value
    } = await request.json()

    if (!title || !value) {
      return NextResponse.json(
        { error: "Title and value are required" },
        { status: 400 }
      )
    }

    const behaviorEntry = await prisma.behaviorEntry.create({
      data: {
        title,
        value,
        userId: session.user.id,
      }
    })

    return NextResponse.json({ behaviorEntry }, { status: 201 })
  } catch (error) {
    console.error("Create behavior entry error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
