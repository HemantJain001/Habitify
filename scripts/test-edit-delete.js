// Test Power System Edit and Delete Functionality
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testEditDeleteFunctionality() {
  try {
    console.log('🧪 Testing Power System Edit and Delete Functionality')
    console.log('====================================================')
    
    // First, check current todos
    const today = new Date().toISOString().split('T')[0]
    const todaysTodos = await prisma.powerSystemTodo.findMany({
      where: {
        date: {
          gte: new Date(`${today}T00:00:00.000Z`),
          lt: new Date(`${today}T23:59:59.999Z`)
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    console.log(`\nFound ${todaysTodos.length} todos for today:`)
    todaysTodos.forEach((todo, index) => {
      console.log(`${index + 1}. ID: ${todo.id}, Title: "${todo.title}", Category: ${todo.category}`)
    })
    
    if (todaysTodos.length === 0) {
      console.log('\n❌ No todos found for today. Cannot test edit/delete functionality.')
      console.log('Please create some todos first using the UI.')
      return
    }
    
    // Test updating a todo title
    const todoToEdit = todaysTodos[0]
    console.log(`\n📝 Testing EDIT functionality on todo: "${todoToEdit.title}"`)
    
    const newTitle = `${todoToEdit.title} (EDITED at ${new Date().toLocaleTimeString()})`
    const updatedTodo = await prisma.powerSystemTodo.update({
      where: { id: todoToEdit.id },
      data: { 
        title: newTitle,
        updatedAt: new Date()
      }
    })
    
    console.log(`✅ Successfully updated todo title to: "${updatedTodo.title}"`)
    
    // Verify the update
    const verifyUpdate = await prisma.powerSystemTodo.findUnique({
      where: { id: todoToEdit.id }
    })
    
    if (verifyUpdate && verifyUpdate.title === newTitle) {
      console.log('✅ Edit verification: Title update confirmed in database')
    } else {
      console.log('❌ Edit verification: Title update failed')
    }
    
    // Test if we have more than one todo before testing delete
    if (todaysTodos.length > 1) {
      const todoToDelete = todaysTodos[1]
      console.log(`\n🗑️  Testing DELETE functionality on todo: "${todoToDelete.title}"`)
      
      await prisma.powerSystemTodo.delete({
        where: { id: todoToDelete.id }
      })
      
      console.log(`✅ Successfully deleted todo: "${todoToDelete.title}"`)
      
      // Verify the deletion
      const verifyDelete = await prisma.powerSystemTodo.findUnique({
        where: { id: todoToDelete.id }
      })
      
      if (!verifyDelete) {
        console.log('✅ Delete verification: Todo successfully removed from database')
      } else {
        console.log('❌ Delete verification: Todo still exists in database')
      }
    } else {
      console.log('\n⚠️  Skipping DELETE test - only one todo available (preserving for edit test)')
    }
    
    // Final count
    const finalTodos = await prisma.powerSystemTodo.findMany({
      where: {
        date: {
          gte: new Date(`${today}T00:00:00.000Z`),
          lt: new Date(`${today}T23:59:59.999Z`)
        }
      }
    })
    
    console.log(`\n📊 Final count: ${finalTodos.length} todos remaining for today`)
    
    console.log('\n✅ Database operations test completed successfully!')
    console.log('\nIf edit/delete still not working in UI, the issue is likely:')
    console.log('1. Authentication/session problems')
    console.log('2. Frontend state management issues')
    console.log('3. API request formatting issues')
    
  } catch (error) {
    console.error('❌ Error during test:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testEditDeleteFunctionality()
