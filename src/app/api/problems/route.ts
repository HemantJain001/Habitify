import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/problems - Get problem solving entries for the current user
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
    const category = searchParams.get('category')

    const whereClause: any = { userId: session.user.id }
    
    if (category) {
      whereClause.problemCategory = category
    }

    const problemEntries = await prisma.problemSolvingEntry.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined
    })

    return NextResponse.json({ problemEntries })
  } catch (error) {
    console.error("Get problem entries error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/problems - Create a new problem solving entry
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
      problemBehavior, 
      triggerPattern, 
      isDaily,
      preventiveStrategy,
      wrongPathReaction,
      longTermConsequence,
      preferredBehavior,
      positiveOutcome,
      problemCategory,
      emotionalImpact,
      copingStrategy,
      controlSource,
      actionablePower,
      longTermSolution,
      isPinned
    } = await request.json()

    if (!problemBehavior || !triggerPattern) {
      return NextResponse.json(
        { error: "Problem behavior and trigger pattern are required" },
        { status: 400 }
      )
    }

    const problemEntry = await prisma.problemSolvingEntry.create({
      data: {
        problemBehavior,
        triggerPattern,
        isDaily: isDaily || false,
        preventiveStrategy,
        wrongPathReaction: wrongPathReaction || "",
        longTermConsequence: longTermConsequence || "",
        preferredBehavior: preferredBehavior || "",
        positiveOutcome: positiveOutcome || "",
        problemCategory: problemCategory || "general",
        emotionalImpact: emotionalImpact || 50,
        copingStrategy,
        controlSource: controlSource || "",
        actionablePower,
        longTermSolution,
        isPinned: isPinned || false,
        userId: session.user.id,
      }
    })

    // Update user stats
    await prisma.userStats.update({
      where: { userId: session.user.id },
      data: {
        totalProblemsAnalyzed: {
          increment: 1
        }
      }
    })

    return NextResponse.json({ problemEntry }, { status: 201 })
  } catch (error) {
    console.error("Create problem entry error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
