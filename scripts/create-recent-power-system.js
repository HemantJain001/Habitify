const fs = require('fs')
const path = require('path')
const csv = require('csv-parser')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Calculate last 7 days ending today (June 29, 2025) for testing
const today = new Date('2025-06-29T00:00:00.000Z')
const startDate = new Date('2025-06-23T00:00:00.000Z') // Last 7 days for testing

console.log(`Creating power system todos for last 7 days: ${startDate.toISOString().split('T')[0]} to ${today.toISOString().split('T')[0]}`)

async function createRecentPowerSystemData() {
  try {
    // First, check if we have users in the database
    const users = await prisma.user.findMany()
    if (users.length === 0) {
      console.log('No users found in database. Please create a user first or sign in to the application.')
      return
    }
    
    // Use the first user's ID
    const userId = users[0].id
    console.log(`Using user ID: ${userId}`)
    
    // Clear existing power system todos
    console.log('Clearing existing power system todos...')
    await prisma.powerSystemTodo.deleteMany({
      where: { userId: userId }
    })
    
    // Create sample todos for each day in the last 7 days
    const todos = []
    
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate)
      currentDate.setUTCDate(startDate.getUTCDate() + i)
      
      // Create 3 todos per day (1 for each category)
      const dailyTodos = [
        {
          title: `Brain challenge for ${currentDate.toISOString().split('T')[0]}`,
          category: 'brain',
          completed: Math.random() > 0.3, // 70% completion rate
          date: currentDate,
          userId: userId,
          createdAt: currentDate,
          updatedAt: currentDate
        },
        {
          title: `Muscle activity for ${currentDate.toISOString().split('T')[0]}`,
          category: 'muscle', 
          completed: Math.random() > 0.3, // 70% completion rate
          date: currentDate,
          userId: userId,
          createdAt: currentDate,
          updatedAt: currentDate
        },
        {
          title: `Money goal for ${currentDate.toISOString().split('T')[0]}`,
          category: 'money',
          completed: Math.random() > 0.3, // 70% completion rate
          date: currentDate,
          userId: userId,
          createdAt: currentDate,
          updatedAt: currentDate
        }
      ]
      
      todos.push(...dailyTodos)
    }
    
    console.log(`Creating ${todos.length} power system todos...`)
    
    // Import todos
    await prisma.powerSystemTodo.createMany({
      data: todos,
      skipDuplicates: true
    })
    
    console.log(`Successfully created ${todos.length} power system todos!`)
    
    // Show statistics
    const totalTodos = await prisma.powerSystemTodo.count({ where: { userId: userId } })
    const completedTodos = await prisma.powerSystemTodo.count({ where: { userId: userId, completed: true } })
    const completionRate = totalTodos > 0 ? ((completedTodos / totalTodos) * 100).toFixed(1) : 0
    
    console.log(`\nStatistics for user ${users[0].email}:`)
    console.log(`Total power system todos: ${totalTodos}`)
    console.log(`Completed todos: ${completedTodos}`)
    console.log(`Overall completion rate: ${completionRate}%`)
    
    // Show today's todos specifically
    const todayStart = new Date(today)
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date(today)
    todayEnd.setHours(23, 59, 59, 999)
    
    const todayTodos = await prisma.powerSystemTodo.findMany({
      where: {
        userId: userId,
        date: {
          gte: todayStart,
          lte: todayEnd
        }
      },
      select: {
        title: true,
        category: true,
        completed: true
      }
    })
    
    console.log(`\nToday's todos (${today.toISOString().split('T')[0]}):`)
    todayTodos.forEach(todo => {
      console.log(`- [${todo.category}] ${todo.title} (${todo.completed ? 'Completed' : 'Pending'})`)
    })
    
  } catch (error) {
    console.error('Error creating power system data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the creation
createRecentPowerSystemData()
