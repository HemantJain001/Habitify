import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/tasks/[id] - Get a specific task
export async function GET(
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

    const task = await prisma.task.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error("Get task error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/tasks/[id] - Update a task
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

    const { title, completed } = await request.json()

    // Verify task belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!existingTask) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      )
    }

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (completed !== undefined) {
      updateData.completed = completed
      if (completed) {
        updateData.completedAt = new Date()
      } else {
        updateData.completedAt = null
      }
    }

    const task = await prisma.task.update({
      where: { id },
      data: updateData
    })

    // Update user stats if task was completed
    if (completed && !existingTask.completed) {
      await prisma.userStats.update({
        where: { userId: session.user.id },
        data: {
          totalTasksCompleted: {
            increment: 1
          }
        }
      })
    } else if (!completed && existingTask.completed) {
      // Task was uncompleted
      await prisma.userStats.update({
        where: { userId: session.user.id },
        data: {
          totalTasksCompleted: {
            decrement: 1
          }
        }
      })
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error("Update task error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/tasks/[id] - Delete a task
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

    // Verify task belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!existingTask) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      )
    }

    await prisma.task.delete({
      where: { id }
    })

    // Update user stats if completed task was deleted
    if (existingTask.completed) {
      await prisma.userStats.update({
        where: { userId: session.user.id },
        data: {
          totalTasksCompleted: {
            decrement: 1
          }
        }
      })
    }

    return NextResponse.json({ message: "Task deleted successfully" })
  } catch (error) {
    console.error("Delete task error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
