// Check problem solving entries in the database
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkProblems() {
  try {
    console.log('🔍 Checking Problem Solving Entries in Database')
    console.log('===============================================')
    
    // Get all problem solving entries
    const problems = await prisma.problemSolvingEntry.findMany({
      include: {
        user: {
          select: {
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    console.log(`📊 Total Problem Entries: ${problems.length}`)
    
    if (problems.length === 0) {
      console.log('❌ No problem solving entries found')
      return
    }
    
    // Group by category
    const categories = {}
    const pinnedProblems = []
    const dailyProblems = []
    
    problems.forEach(problem => {
      categories[problem.problemCategory] = (categories[problem.problemCategory] || 0) + 1
      if (problem.isPinned) pinnedProblems.push(problem)
      if (problem.isDaily) dailyProblems.push(problem)
    })
    
    console.log('\n📋 Problems by Category:')
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} problems`)
    })
    
    console.log(`\n📌 Pinned Problems: ${pinnedProblems.length}`)
    pinnedProblems.forEach((problem, index) => {
      console.log(`   ${index + 1}. ${problem.problemBehavior}`)
    })
    
    console.log(`\n📅 Daily Problems: ${dailyProblems.length}`)
    dailyProblems.forEach((problem, index) => {
      console.log(`   ${index + 1}. ${problem.problemBehavior}`)
    })
    
    console.log('\n🎯 Sample Problem Details:')
    const sampleProblem = problems[0]
    console.log(`Problem: ${sampleProblem.problemBehavior}`)
    console.log(`Category: ${sampleProblem.problemCategory}`)
    console.log(`Emotional Impact: ${sampleProblem.emotionalImpact}/100`)
    console.log(`Is Pinned: ${sampleProblem.isPinned}`)
    console.log(`Is Daily: ${sampleProblem.isDaily}`)
    console.log(`User: ${sampleProblem.user.email}`)
    console.log(`Created: ${sampleProblem.createdAt.toLocaleDateString()}`)
    
    console.log('\n✅ Problem solving entries verification complete!')
    
  } catch (error) {
    console.error('❌ Error checking problems:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProblems()
