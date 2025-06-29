// Check if there are any users in the database and create a test user if needed
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function setupTestUser() {
  try {
    console.log('👤 Checking for existing users...')
    
    const users = await prisma.user.findMany()
    console.log(`Found ${users.length} users in database`)
    
    if (users.length > 0) {
      console.log('Existing users:')
      users.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}, ID: ${user.id}`)
      })
      return users[0]
    }
    
    console.log('🔧 No users found, creating test user...')
    
    const testEmail = 'test@example.com'
    const testPassword = 'password123'
    const hashedPassword = await bcrypt.hash(testPassword, 12)
    
    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        name: 'Test User'
      }
    })
    
    console.log('✅ Test user created successfully!')
    console.log(`Email: ${testEmail}`)
    console.log(`Password: ${testPassword}`)
    console.log(`User ID: ${testUser.id}`)
    
    return testUser
    
  } catch (error) {
    console.error('❌ Error setting up test user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupTestUser()
