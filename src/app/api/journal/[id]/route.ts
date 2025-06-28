import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/journal/[id] - Get a specific journal entry
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

    const journalEntry = await prisma.journalEntry.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!journalEntry) {
      return NextResponse.json(
        { error: "Journal entry not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ journalEntry })
  } catch (error) {
    console.error("Get journal entry error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/journal/[id] - Update a journal entry
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
      notes, 
      mood
    } = await request.json()

    // Verify journal entry belongs to user
    const existingEntry = await prisma.journalEntry.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existingEntry) {
      return NextResponse.json(
        { error: "Journal entry not found" },
        { status: 404 }
      )
    }

    const updateData: any = {}
    if (notes !== undefined) updateData.notes = notes
    if (mood !== undefined) updateData.mood = mood

    const journalEntry = await prisma.journalEntry.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json({ journalEntry })
  } catch (error) {
    console.error("Update journal entry error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/journal/[id] - Delete a journal entry
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

    // Verify journal entry belongs to user
    const existingEntry = await prisma.journalEntry.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!existingEntry) {
      return NextResponse.json(
        { error: "Journal entry not found" },
        { status: 404 }
      )
    }

    await prisma.journalEntry.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Journal entry deleted successfully" })
  } catch (error) {
    console.error("Delete journal entry error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
