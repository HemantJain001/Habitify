const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkTaskDistribution() {
  try {
    // Get all tasks
    const allTasks = await prisma.task.findMany({
      orderBy: { createdAt: 'asc' },
      select: { 
        id: true,
        title: true, 
        createdAt: true, 
        completed: true 
      }
    })
    
    console.log(`Total tasks in database: ${allTasks.length}`)
    
    // Get today's tasks (June 29, 2025)
    const today = new Date('2025-06-29')
    const startOfDay = new Date(today)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(today)
    endOfDay.setHours(23, 59, 59, 999)
    
    const todayTasks = await prisma.task.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      select: { 
        id: true,
        title: true, 
        createdAt: true, 
        completed: true 
      }
    })
    
    console.log(`Tasks for today (${today.toISOString().split('T')[0]}): ${todayTasks.length}`)
    
    if (todayTasks.length > 0) {
      console.log('\nToday\'s tasks:')
      todayTasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task.title} (${task.completed ? 'Completed' : 'Pending'})`)
      })
    } else {
      console.log('\nNo tasks found for today.')
      
      // Show last few days with tasks
      const recentTasks = await prisma.task.findMany({
        where: {
          createdAt: {
            gte: new Date('2025-06-25')
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { 
          title: true, 
          createdAt: true, 
          completed: true 
        }
      })
      
      console.log('\nRecent tasks (last few days):')
      recentTasks.forEach((task, index) => {
        const date = task.createdAt.toISOString().split('T')[0]
        console.log(`${index + 1}. [${date}] ${task.title} (${task.completed ? 'Completed' : 'Pending'})`)
      })
    }
    
    // Show date range of all tasks
    const firstTask = allTasks[0]
    const lastTask = allTasks[allTasks.length - 1]
    
    console.log(`\nFull date range: ${firstTask?.createdAt.toISOString().split('T')[0]} to ${lastTask?.createdAt.toISOString().split('T')[0]}`)
    
  } catch (error) {
    console.error('Error checking task distribution:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkTaskDistribution()
