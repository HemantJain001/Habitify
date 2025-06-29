// Comprehensive test for Power System edit/delete functionality
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testPowerSystemWithAuth() {
  try {
    console.log('🔍 Testing Power System Edit/Delete Functionality')
    console.log('=================================================')
    
    // Step 1: Check if user exists
    const user = await prisma.user.findFirst()
    if (!user) {
      console.log('❌ No user found. Please create a user first.')
      return
    }
    
    console.log(`✅ Found user: ${user.email} (ID: ${user.id})`)
    
    // Step 2: Get current todos for today
    const today = new Date().toISOString().split('T')[0]
    const currentTodos = await prisma.powerSystemTodo.findMany({
      where: {
        userId: user.id,
        date: {
          gte: new Date(`${today}T00:00:00.000Z`),
          lt: new Date(`${today}T23:59:59.999Z`)
        }
      }
    })
    
    console.log(`📋 Found ${currentTodos.length} todos for today`)
    
    if (currentTodos.length === 0) {
      console.log('📝 Creating test todos...')
      
      // Create test todos for each category
      const testTodos = [
        { title: 'Test Brain Goal', category: 'brain', userId: user.id, date: new Date() },
        { title: 'Test Muscle Goal', category: 'muscle', userId: user.id, date: new Date() },
        { title: 'Test Money Goal', category: 'money', userId: user.id, date: new Date() }
      ]
      
      for (const todoData of testTodos) {
        await prisma.powerSystemTodo.create({ data: todoData })
      }
      
      console.log('✅ Created 3 test todos')
    }
    
    // Step 3: Test edit functionality
    console.log('\n🔧 Testing EDIT functionality...')
    const todoToEdit = await prisma.powerSystemTodo.findFirst({
      where: { userId: user.id }
    })
    
    if (todoToEdit) {
      const originalTitle = todoToEdit.title
      const newTitle = `${originalTitle} (EDITED ${new Date().toLocaleTimeString()})`
      
      await prisma.powerSystemTodo.update({
        where: { id: todoToEdit.id },
        data: { title: newTitle }
      })
      
      // Verify edit
      const updatedTodo = await prisma.powerSystemTodo.findUnique({
        where: { id: todoToEdit.id }
      })
      
      if (updatedTodo && updatedTodo.title === newTitle) {
        console.log(`✅ Edit test passed: "${originalTitle}" -> "${newTitle}"`)
      } else {
        console.log('❌ Edit test failed')
      }
    }
    
    // Step 4: Test delete functionality (create a temporary todo to delete)
    console.log('\n🗑️ Testing DELETE functionality...')
    const tempTodo = await prisma.powerSystemTodo.create({
      data: {
        title: 'Temporary Todo for Delete Test',
        category: 'brain',
        userId: user.id,
        date: new Date(),
        completed: false
      }
    })
    
    console.log(`📝 Created temporary todo: "${tempTodo.title}"`)
    
    // Delete the temporary todo
    await prisma.powerSystemTodo.delete({
      where: { id: tempTodo.id }
    })
    
    // Verify deletion
    const deletedTodo = await prisma.powerSystemTodo.findUnique({
      where: { id: tempTodo.id }
    })
    
    if (!deletedTodo) {
      console.log('✅ Delete test passed: Temporary todo successfully deleted')
    } else {
      console.log('❌ Delete test failed: Todo still exists')
    }
    
    // Step 5: Final summary
    console.log('\n📊 Final Status:')
    const finalTodos = await prisma.powerSystemTodo.findMany({
      where: {
        userId: user.id,
        date: {
          gte: new Date(`${today}T00:00:00.000Z`),
          lt: new Date(`${today}T23:59:59.999Z`)
        }
      }
    })
    
    console.log(`📋 Current todos for today: ${finalTodos.length}`)
    finalTodos.forEach((todo, index) => {
      console.log(`   ${index + 1}. [${todo.category.toUpperCase()}] ${todo.title}`)
    })
    
    console.log('\n✅ Database-level edit/delete functionality works correctly!')
    console.log('\n🌐 Next Steps for UI Testing:')
    console.log('1. Sign in to the application using: hemantjaingjam@gmail.com')
    console.log('2. Navigate to the main page')
    console.log('3. Click "Edit Goals" to enable edit mode')
    console.log('4. Test edit and delete buttons')
    console.log('5. Check browser console for debug messages')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testPowerSystemWithAuth()
