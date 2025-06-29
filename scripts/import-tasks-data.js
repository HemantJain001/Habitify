const fs = require('fs')
const path = require('path')
const csv = require('csv-parser')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Calculate date 60 days ago from today (June 29, 2025)
const today = new Date('2025-06-29T00:00:00.000Z')
const startDate = new Date('2025-05-01T00:00:00.000Z') // Explicit start date

console.log(`Updating dates from ${startDate.toISOString().split('T')[0]} to ${today.toISOString().split('T')[0]}`)

async function importTasksData() {
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
    
    const csvFilePath = path.join(__dirname, '../dummy_data/daily_tasks_60_days.csv')
    const tasks = []
    
    // Read and parse CSV
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
          // Parse the original date
          const originalDate = new Date(row.date + 'T00:00:00.000Z')
          const originalStartDate = new Date('2024-11-01T00:00:00.000Z')
          const originalEndDate = new Date('2024-11-30T00:00:00.000Z')
          
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
          
          const createdAtDate = new Date(newDate)
          createdAtDate.setUTCHours(randomHour, randomMinute, 0, 0)
          
          // For completed tasks, set completedAt to a random time later in the same day
          let completedAtDate = null
          if (row.completed === 'true') {
            completedAtDate = new Date(createdAtDate)
            // Add 1-8 hours after creation for completion time
            const hoursToAdd = Math.floor(Math.random() * 8) + 1
            completedAtDate.setUTCHours(completedAtDate.getUTCHours() + hoursToAdd)
            
            // Make sure we don't go past the end of the day
            if (completedAtDate.getUTCHours() > 23) {
              completedAtDate.setUTCHours(23, 59, 0, 0)
            }
          }
          
          // Create task object matching the Prisma schema
          tasks.push({
            title: row.task_title,
            completed: row.completed === 'true',
            userId: userId,
            createdAt: createdAtDate,
            updatedAt: completedAtDate || createdAtDate,
            completedAt: completedAtDate
          })
        })
        .on('end', resolve)
        .on('error', reject)
    })
    
    console.log(`Parsed ${tasks.length} tasks`)
    
    // Clear existing tasks for this user (optional - remove if you want to keep existing data)
    console.log('Clearing existing tasks for this user...')
    await prisma.task.deleteMany({
      where: { userId: userId }
    })
    
    // Import tasks in batches
    const batchSize = 50
    for (let i = 0; i < tasks.length; i += batchSize) {
      const batch = tasks.slice(i, i + batchSize)
      await prisma.task.createMany({
        data: batch,
        skipDuplicates: true
      })
      console.log(`Imported batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(tasks.length / batchSize)}`)
    }
    
    console.log(`Successfully imported ${tasks.length} tasks!`)
    
    // Show some statistics
    const totalTasks = await prisma.task.count({ where: { userId: userId } })
    const completedTasks = await prisma.task.count({ where: { userId: userId, completed: true } })
    const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0
    
    console.log(`\nStatistics for user ${users[0].email}:`)
    console.log(`Total tasks: ${totalTasks}`)
    console.log(`Completed tasks: ${completedTasks}`)
    console.log(`Completion rate: ${completionRate}%`)
    
  } catch (error) {
    console.error('Error importing tasks data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the import
importTasksData()
