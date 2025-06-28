import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// PUT /api/power-system/[id] - Update a power system todo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const { title, category, completed, date } = await request.json()

    // Verify todo belongs to user
    const existingTodo = await prisma.powerSystemTodo.findFirst({
      where: {
        id: id,
        userId: session.user.id
      }
    })

    if (!existingTodo) {
      return NextResponse.json(
        { error: "Power system todo not found" },
        { status: 404 }
      )
    }

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (category !== undefined) updateData.category = category
    if (date !== undefined) updateData.date = new Date(date)
    if (completed !== undefined) updateData.completed = completed

    const powerSystemTodo = await prisma.powerSystemTodo.update({
      where: { id: id },
      data: updateData
    })

    return NextResponse.json({ powerSystemTodo })
  } catch (error) {
    console.error("Update power system todo error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/power-system/[id] - Delete a power system todo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params

    // Verify todo belongs to user
    const existingTodo = await prisma.powerSystemTodo.findFirst({
      where: {
        id: id,
        userId: session.user.id
      }
    })

    if (!existingTodo) {
      return NextResponse.json(
        { error: "Power system todo not found" },
        { status: 404 }
      )
    }

    await prisma.powerSystemTodo.delete({
      where: { id: id }
    })

    return NextResponse.json({ message: "Power system todo deleted successfully" })
  } catch (error) {
    console.error("Delete power system todo error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
