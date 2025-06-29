const fs = require('fs')
const path = require('path')
const csv = require('csv-parser')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Calculate date 60 days ago from today (June 29, 2025)
const today = new Date('2025-06-29T00:00:00.000Z')
const startDate = new Date('2025-05-01T00:00:00.000Z') // Explicit start date

console.log(`Updating dates from ${startDate.toISOString().split('T')[0]} to ${today.toISOString().split('T')[0]}`)

async function importPowerSystemData() {
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
    
    const csvFilePath = path.join(__dirname, '../dummy_data/power_system_60_days.csv')
    const powerSystemTodos = []
    
    // Read and parse CSV
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
          // Parse the original date
          const originalDate = new Date(row.date + 'T00:00:00.000Z')
          const originalStartDate = new Date('2024-11-01T00:00:00.000Z')
          
          // Calculate how many days from the start of the original data (30 days total)
          const daysDiff = Math.floor((originalDate - originalStartDate) / (1000 * 60 * 60 * 24))
          
          // Map the 30-day original range to our 60-day target range (May 1 - June 29)
          // We'll stretch the data across 60 days by mapping each original day to 2 target days
          const targetDayOffset = daysDiff * 2 // Double the spacing
          
          // Create new date based on our start date (May 1, 2025)
          const newDate = new Date(startDate)
          newDate.setUTCDate(startDate.getUTCDate() + targetDayOffset)
          
          // Add some randomness to the time within the day for more realistic timestamps
          const randomHour = Math.floor(Math.random() * 16) + 6 // Between 6 AM and 10 PM
          const randomMinute = Math.floor(Math.random() * 60)
          
          const dateWithTime = new Date(newDate)
          dateWithTime.setUTCHours(randomHour, randomMinute, 0, 0)
          
          // Create power system todo object matching the Prisma schema
          powerSystemTodos.push({
            title: row.todo_title,
            category: row.power_system_category, // "brain", "muscle", or "money"
            completed: row.completed === 'true',
            date: dateWithTime,
            userId: userId,
            createdAt: dateWithTime,
            updatedAt: dateWithTime
          })
        })
        .on('end', resolve)
        .on('error', reject)
    })
    
    console.log(`Parsed ${powerSystemTodos.length} power system todos`)
    
    // Clear existing power system todos for this user (optional - remove if you want to keep existing data)
    console.log('Clearing existing power system todos for this user...')
    await prisma.powerSystemTodo.deleteMany({
      where: { userId: userId }
    })
    
    // Import power system todos in batches
    const batchSize = 50
    for (let i = 0; i < powerSystemTodos.length; i += batchSize) {
      const batch = powerSystemTodos.slice(i, i + batchSize)
      await prisma.powerSystemTodo.createMany({
        data: batch,
        skipDuplicates: true
      })
      console.log(`Imported batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(powerSystemTodos.length / batchSize)}`)
    }
    
    console.log(`Successfully imported ${powerSystemTodos.length} power system todos!`)
    
    // Show some statistics
    const totalTodos = await prisma.powerSystemTodo.count({ where: { userId: userId } })
    const completedTodos = await prisma.powerSystemTodo.count({ where: { userId: userId, completed: true } })
    const completionRate = totalTodos > 0 ? ((completedTodos / totalTodos) * 100).toFixed(1) : 0
    
    // Stats by category
    const brainTodos = await prisma.powerSystemTodo.count({ where: { userId: userId, category: 'brain' } })
    const muscleTodos = await prisma.powerSystemTodo.count({ where: { userId: userId, category: 'muscle' } })
    const moneyTodos = await prisma.powerSystemTodo.count({ where: { userId: userId, category: 'money' } })
    
    const brainCompleted = await prisma.powerSystemTodo.count({ where: { userId: userId, category: 'brain', completed: true } })
    const muscleCompleted = await prisma.powerSystemTodo.count({ where: { userId: userId, category: 'muscle', completed: true } })
    const moneyCompleted = await prisma.powerSystemTodo.count({ where: { userId: userId, category: 'money', completed: true } })
    
    console.log(`\nStatistics for user ${users[0].email}:`)
    console.log(`Total power system todos: ${totalTodos}`)
    console.log(`Completed todos: ${completedTodos}`)
    console.log(`Overall completion rate: ${completionRate}%`)
    console.log('')
    console.log(`Brain todos: ${brainTodos} (${brainCompleted} completed - ${brainTodos > 0 ? ((brainCompleted / brainTodos) * 100).toFixed(1) : 0}%)`)
    console.log(`Muscle todos: ${muscleTodos} (${muscleCompleted} completed - ${muscleTodos > 0 ? ((muscleCompleted / muscleTodos) * 100).toFixed(1) : 0}%)`)
    console.log(`Money todos: ${moneyTodos} (${moneyCompleted} completed - ${moneyTodos > 0 ? ((moneyCompleted / moneyTodos) * 100).toFixed(1) : 0}%)`)
    
  } catch (error) {
    console.error('Error importing power system data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the import
importPowerSystemData()
