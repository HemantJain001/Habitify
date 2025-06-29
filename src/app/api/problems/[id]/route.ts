import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/problems/[id] - Get a specific problem solving entry
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const problemEntry = await prisma.problemSolvingEntry.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!problemEntry) {
      return NextResponse.json(
        { error: "Problem entry not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ problemEntry })
  } catch (error) {
    console.error("Get problem entry error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/problems/[id] - Update a problem solving entry
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // First check if the problem entry exists and belongs to the user
    const existingEntry = await prisma.problemSolvingEntry.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existingEntry) {
      return NextResponse.json(
        { error: "Problem entry not found" },
        { status: 404 }
      )
    }

    const problemEntry = await prisma.problemSolvingEntry.update({
      where: { id: params.id },
      data: {
        problemBehavior: problemBehavior || existingEntry.problemBehavior,
        triggerPattern: triggerPattern || existingEntry.triggerPattern,
        isDaily: isDaily !== undefined ? isDaily : existingEntry.isDaily,
        preventiveStrategy,
        wrongPathReaction: wrongPathReaction || existingEntry.wrongPathReaction,
        longTermConsequence: longTermConsequence || existingEntry.longTermConsequence,
        preferredBehavior: preferredBehavior || existingEntry.preferredBehavior,
        positiveOutcome: positiveOutcome || existingEntry.positiveOutcome,
        problemCategory: problemCategory || existingEntry.problemCategory,
        emotionalImpact: emotionalImpact !== undefined ? emotionalImpact : existingEntry.emotionalImpact,
        copingStrategy,
        controlSource: controlSource || existingEntry.controlSource,
        actionablePower,
        longTermSolution,
        isPinned: isPinned !== undefined ? isPinned : existingEntry.isPinned,
      }
    })

    return NextResponse.json({ problemEntry })
  } catch (error) {
    console.error("Update problem entry error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/problems/[id] - Delete a problem solving entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // First check if the problem entry exists and belongs to the user
    const existingEntry = await prisma.problemSolvingEntry.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existingEntry) {
      return NextResponse.json(
        { error: "Problem entry not found" },
        { status: 404 }
      )
    }

    await prisma.problemSolvingEntry.delete({
      where: { id: params.id }
    })

    // Update user stats
    await prisma.userStats.update({
      where: { userId: session.user.id },
      data: {
        totalProblemsAnalyzed: {
          decrement: 1
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete problem entry error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
