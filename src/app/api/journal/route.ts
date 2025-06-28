import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/journal - Get journal entries for the current user
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
    const date = searchParams.get('date')
    const limit = searchParams.get('limit')

    const whereClause: any = { userId: session.user.id }
    
    if (date) {
      const targetDate = new Date(date)
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0))
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999))
      
      whereClause.date = {
        gte: startOfDay,
        lte: endOfDay
      }
    }

    const journalEntries = await prisma.journalEntry.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      take: limit ? parseInt(limit) : undefined
    })

    return NextResponse.json({ journalEntries })
  } catch (error) {
    console.error("Get journal entries error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/journal - Create a new journal entry
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
      date, 
      notes, 
      mood
    } = await request.json()

    if (!date) {
      return NextResponse.json(
        { error: "Date is required" },
        { status: 400 }
      )
    }

    // Check if journal entry already exists for this date
    const existingEntry = await prisma.journalEntry.findFirst({
      where: {
        userId: session.user.id,
        date: {
          gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
          lt: new Date(new Date(date).setHours(23, 59, 59, 999))
        }
      }
    })

    if (existingEntry) {
      return NextResponse.json(
        { error: "Journal entry already exists for this date" },
        { status: 409 }
      )
    }

    const journalEntry = await prisma.journalEntry.create({
      data: {
        date: new Date(date),
        notes: notes || "",
        mood: mood || 5,
        userId: session.user.id,
      }
    })

    return NextResponse.json({ journalEntry }, { status: 201 })
  } catch (error) {
    console.error("Create journal entry error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
