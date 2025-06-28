import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user stats from database
    let userStats = await prisma.userStats.findUnique({
      where: { userId: session.user.id }
    })

    // Create user stats if they don't exist
    if (!userStats) {
      userStats = await prisma.userStats.create({
        data: {
          userId: session.user.id,
          currentStreak: 0,
          longestStreak: 0,
          completionRate: 0.0,
          totalTasksCompleted: 0,
          totalProblemsAnalyzed: 0,
        }
      })
    }

    // Get user's completed tasks by category for today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
        completed: true,
        updatedAt: {
          gte: today
        }
      }
    })

    // Count completed tasks by identity (assuming tasks have an identity field)
    const brainTasks = tasks.filter(task => task.title?.includes('learn') || task.title?.includes('study')).length
    const muscleTasks = tasks.filter(task => task.title?.includes('exercise') || task.title?.includes('workout')).length
    const moneyTasks = tasks.filter(task => task.title?.includes('work') || task.title?.includes('business')).length

    // Transform database stats to frontend format
    const transformedStats = {
      streak: userStats.currentStreak,
      brain: {
        today: brainTasks,
        week: Math.floor(userStats.totalTasksCompleted * 0.3), // Mock calculation
        month: Math.floor(userStats.totalTasksCompleted * 0.6),
        progress: Math.min(100, userStats.completionRate * 100)
      },
      muscle: {
        today: muscleTasks,
        week: Math.floor(userStats.totalTasksCompleted * 0.3),
        month: Math.floor(userStats.totalTasksCompleted * 0.6),
        progress: Math.min(100, userStats.completionRate * 100)
      },
      money: {
        today: moneyTasks,
        week: Math.floor(userStats.totalTasksCompleted * 0.4),
        month: Math.floor(userStats.totalTasksCompleted * 0.7),
        progress: Math.min(100, userStats.completionRate * 100)
      }
    }

    return NextResponse.json(transformedStats)
  } catch (error) {
    console.error("Get user stats error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
