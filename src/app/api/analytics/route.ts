import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || 'daily'
    const days = timeRange === 'weekly' ? 56 : 14 // 8 weeks or 14 days

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000)

    // Fetch tasks data
    const tasks = await prisma.task.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Fetch power system todos
    const powerSystemTodos = await prisma.powerSystemTodo.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { date: 'desc' }
    })

    // Generate analytics data
    const analytics = generateAnalytics(tasks, powerSystemTodos, timeRange, days)

    return NextResponse.json({
      success: true,
      data: analytics
    })

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

function generateAnalytics(tasks: any[], powerSystemTodos: any[], timeRange: string, days: number) {
  const endDate = new Date()
  const analytics: any = {
    timeRange,
    dailyStats: [],
    weeklyStats: [],
    totalStats: {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.completed).length,
      completionRate: 0,
      currentStreak: 0,
      totalPowerSystem: powerSystemTodos.length
    },
    powerSystemBreakdown: []
  }

  // Calculate completion rate
  if (analytics.totalStats.totalTasks > 0) {
    analytics.totalStats.completionRate = Math.round(
      (analytics.totalStats.completedTasks / analytics.totalStats.totalTasks) * 100
    )
  }

  if (timeRange === 'daily') {
    // Generate daily stats for last 14 days
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(endDate.getTime() - i * 24 * 60 * 60 * 1000)
      const dateString = date.toISOString().split('T')[0]
      
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt).toISOString().split('T')[0]
        return taskDate === dateString
      })
      
      const dayPowerSystem = powerSystemTodos.filter(todo => {
        const todoDate = new Date(todo.date).toISOString().split('T')[0]
        return todoDate === dateString
      })

      const completedTasks = dayTasks.filter(task => task.completed).length
      const totalTasks = dayTasks.length
      
      const brainTodos = dayPowerSystem.filter(t => t.category === 'brain').length
      const muscleTodos = dayPowerSystem.filter(t => t.category === 'muscle').length
      const moneyTodos = dayPowerSystem.filter(t => t.category === 'money').length

      analytics.dailyStats.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        tasksCompleted: completedTasks,
        tasksTotal: totalTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        brainTodos,
        muscleTodos,
        moneyTodos,
        powerSystemTotal: brainTodos + muscleTodos + moneyTodos
      })
    }
  } else {
    // Generate weekly stats for last 8 weeks
    const weeksToGenerate = 8
    for (let i = weeksToGenerate - 1; i >= 0; i--) {
      const weekEnd = new Date(endDate.getTime() - i * 7 * 24 * 60 * 60 * 1000)
      const weekStart = new Date(weekEnd.getTime() - 6 * 24 * 60 * 60 * 1000)
      
      const weekTasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt)
        return taskDate >= weekStart && taskDate <= weekEnd
      })
      
      const weekPowerSystem = powerSystemTodos.filter(todo => {
        const todoDate = new Date(todo.date)
        return todoDate >= weekStart && todoDate <= weekEnd
      })

      const completedTasks = weekTasks.filter(task => task.completed).length
      const totalTasks = weekTasks.length

      analytics.weeklyStats.push({
        week: `Week ${weeksToGenerate - i}`,
        totalTasks,
        completedTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        powerSystemCompleted: weekPowerSystem.filter(t => t.completed).length,
        streak: calculateWeekStreak(weekTasks)
      })
    }
  }

  // Generate power system breakdown
  const totalBrain = powerSystemTodos.filter(t => t.category === 'brain').length
  const totalMuscle = powerSystemTodos.filter(t => t.category === 'muscle').length
  const totalMoney = powerSystemTodos.filter(t => t.category === 'money').length
  const totalPowerSystem = totalBrain + totalMuscle + totalMoney

  if (totalPowerSystem > 0) {
    analytics.powerSystemBreakdown = [
      {
        name: 'Brain',
        value: Math.round((totalBrain / totalPowerSystem) * 100),
        color: '#3b82f6'
      },
      {
        name: 'Muscle',
        value: Math.round((totalMuscle / totalPowerSystem) * 100),
        color: '#ef4444'
      },
      {
        name: 'Money',
        value: Math.round((totalMoney / totalPowerSystem) * 100),
        color: '#10b981'
      }
    ]
  } else {
    analytics.powerSystemBreakdown = [
      { name: 'Brain', value: 33, color: '#3b82f6' },
      { name: 'Muscle', value: 33, color: '#ef4444' },
      { name: 'Money', value: 34, color: '#10b981' }
    ]
  }

  // Calculate current streak
  analytics.totalStats.currentStreak = calculateCurrentStreak(tasks)

  return analytics
}

function calculateWeekStreak(weekTasks: any[]): number {
  // Simple streak calculation for the week
  const uniqueDays = new Set()
  weekTasks.forEach(task => {
    if (task.completed) {
      const day = new Date(task.completedAt || task.createdAt).toDateString()
      uniqueDays.add(day)
    }
  })
  return uniqueDays.size
}

function calculateCurrentStreak(tasks: any[]): number {
  // Calculate current streak of days with completed tasks
  const completedTasks = tasks.filter(task => task.completed && task.completedAt)
  if (completedTasks.length === 0) return 0

  const dates = new Set()
  completedTasks.forEach(task => {
    const date = new Date(task.completedAt).toDateString()
    dates.add(date)
  })

  const sortedDates = Array.from(dates).sort((a: any, b: any) => new Date(b).getTime() - new Date(a).getTime())
  
  let streak = 0
  const today = new Date().toDateString()
  let currentDate = new Date()

  for (let i = 0; i < 30; i++) { // Check last 30 days max
    const checkDate = currentDate.toDateString()
    if (dates.has(checkDate)) {
      streak++
      currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000)
    } else {
      break
    }
  }

  return streak
}
