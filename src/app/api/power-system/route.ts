import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/power-system - Get all power system todos for the current user
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
    const category = searchParams.get('category') // "brain" | "muscle" | "money"
    const date = searchParams.get('date')

    const whereClause: any = { userId: session.user.id }
    
    if (category) {
      whereClause.category = category
    }

    if (date) {
      const targetDate = new Date(date)
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0))
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999))
      
      whereClause.date = {
        gte: startOfDay,
        lte: endOfDay
      }
    }

    const powerSystemTodos = await prisma.powerSystemTodo.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ powerSystemTodos })
  } catch (error) {
    console.error("Get power system todos error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/power-system - Create a new power system todo
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { title, category, date } = await request.json()

    if (!title || !category) {
      return NextResponse.json(
        { error: "Title and category are required" },
        { status: 400 }
      )
    }

    if (!["brain", "muscle", "money"].includes(category)) {
      return NextResponse.json(
        { error: "Category must be brain, muscle, or money" },
        { status: 400 }
      )
    }

    const powerSystemTodo = await prisma.powerSystemTodo.create({
      data: {
        title,
        category,
        date: date ? new Date(date) : new Date(),
        completed: false,
        userId: session.user.id,
      }
    })

    return NextResponse.json({ powerSystemTodo }, { status: 201 })
  } catch (error) {
    console.error("Create power system todo error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
