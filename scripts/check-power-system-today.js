const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkPowerSystemTodos() {
  try {
    // Get all power system todos
    const allTodos = await prisma.powerSystemTodo.findMany({
      orderBy: { date: 'asc' },
      select: { 
        id: true,
        title: true, 
        category: true,
        date: true, 
        completed: true 
      }
    })
    
    console.log(`Total power system todos in database: ${allTodos.length}`)
    
    // Get today's todos (June 29, 2025)
    const today = new Date('2025-06-29')
    const startOfDay = new Date(today)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(today)
    endOfDay.setHours(23, 59, 59, 999)
    
    const todayTodos = await prisma.powerSystemTodo.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      select: { 
        id: true,
        title: true, 
        category: true,
        date: true, 
        completed: true 
      },
      orderBy: { category: 'asc' }
    })
    
    console.log(`Power system todos for today (${today.toISOString().split('T')[0]}): ${todayTodos.length}`)
    
    if (todayTodos.length > 0) {
      console.log('\nToday\'s power system todos by category:')
      
      const categories = ['brain', 'muscle', 'money']
      categories.forEach(category => {
        const categoryTodos = todayTodos.filter(todo => todo.category === category)
        console.log(`\n${category.toUpperCase()} (${categoryTodos.length} todos):`)
        categoryTodos.forEach((todo, index) => {
          console.log(`  ${index + 1}. ${todo.title} (${todo.completed ? 'Completed' : 'Pending'})`)
        })
      })
    } else {
      console.log('\nNo power system todos found for today.')
      
      // Show recent todos
      const recentTodos = await prisma.powerSystemTodo.findMany({
        where: {
          date: {
            gte: new Date('2025-06-25')
          }
        },
        orderBy: { date: 'desc' },
        take: 9,
        select: { 
          title: true, 
          category: true,
          date: true, 
          completed: true 
        }
      })
      
      console.log('\nRecent power system todos (last few days):')
      recentTodos.forEach((todo, index) => {
        const date = todo.date.toISOString().split('T')[0]
        console.log(`${index + 1}. [${date}] [${todo.category}] ${todo.title} (${todo.completed ? 'Completed' : 'Pending'})`)
      })
    }
    
    // Show date range of all todos
    const firstTodo = allTodos[0]
    const lastTodo = allTodos[allTodos.length - 1]
    
    console.log(`\nFull date range: ${firstTodo?.date.toISOString().split('T')[0]} to ${lastTodo?.date.toISOString().split('T')[0]}`)
    
  } catch (error) {
    console.error('Error checking power system todos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkPowerSystemTodos()
