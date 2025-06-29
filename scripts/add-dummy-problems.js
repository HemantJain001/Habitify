// Add dummy problem solving entries to the database
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const dummyProblems = [
  {
    problemBehavior: "Procrastinating on important work tasks",
    triggerPattern: "When I have large, complex projects with unclear deadlines",
    isDaily: true,
    preventiveStrategy: "Break large tasks into smaller 25-minute focused work sessions using Pomodoro technique",
    wrongPathReaction: "Scrolling social media, watching YouTube videos, or cleaning to avoid the task",
    longTermConsequence: "Increased stress, missed deadlines, lower quality work, damaged professional reputation",
    preferredBehavior: "Start with the most challenging part of the task immediately after my morning routine",
    positiveOutcome: "Feeling accomplished, meeting deadlines early, producing higher quality work, reduced anxiety",
    problemCategory: "productivity",
    emotionalImpact: 75,
    copingStrategy: "Use the 2-minute rule: if something takes less than 2 minutes, do it immediately",
    controlSource: "Internal - I have control over my schedule and work approach",
    actionablePower: "Set specific times for focused work and eliminate distractions during those times",
    longTermSolution: "Develop a consistent morning routine that includes tackling the most important task first",
    isPinned: true
  },
  {
    problemBehavior: "Overthinking and anxiety about future outcomes",
    triggerPattern: "When facing uncertain situations or making important decisions",
    isDaily: false,
    preventiveStrategy: "Practice mindfulness meditation for 10 minutes each morning",
    wrongPathReaction: "Endless research, seeking reassurance from others, avoiding making decisions",
    longTermConsequence: "Paralysis by analysis, missed opportunities, increased anxiety and stress",
    preferredBehavior: "Set a specific time limit for research and decision-making, then commit to action",
    positiveOutcome: "Faster decision-making, reduced anxiety, more opportunities seized, increased confidence",
    problemCategory: "anxiety",
    emotionalImpact: 85,
    copingStrategy: "Use the 10-10-10 rule: Will this matter in 10 minutes, 10 months, and 10 years?",
    controlSource: "Mixed - Some factors are within my control, others are not",
    actionablePower: "Focus only on what I can control and take concrete steps toward my goals",
    longTermSolution: "Build tolerance for uncertainty through gradual exposure to uncomfortable decisions",
    isPinned: false
  },
  {
    problemBehavior: "Impulse spending on unnecessary items",
    triggerPattern: "When feeling stressed, bored, or seeing targeted advertisements online",
    isDaily: false,
    preventiveStrategy: "Implement a 24-hour waiting period for non-essential purchases over $25",
    wrongPathReaction: "Justifying purchases as 'rewards' or 'investments' when they're really impulse buys",
    longTermConsequence: "Accumulating debt, cluttered living space, guilt and regret, reduced financial security",
    preferredBehavior: "When tempted to buy, add items to a wishlist and review monthly instead of purchasing immediately",
    positiveOutcome: "Increased savings, less clutter, more intentional purchases, reduced financial stress",
    problemCategory: "financial",
    emotionalImpact: 60,
    copingStrategy: "Calculate how many hours of work the item costs and if it's worth that time investment",
    controlSource: "Internal - I have full control over my spending decisions",
    actionablePower: "Set up automatic savings transfers and track spending weekly",
    longTermSolution: "Create a comprehensive budget with clear categories for discretionary spending",
    isPinned: false
  },
  {
    problemBehavior: "Skipping workouts and physical exercise",
    triggerPattern: "When I'm busy with work or feel tired after long days",
    isDaily: true,
    preventiveStrategy: "Schedule workouts as non-negotiable appointments in my calendar",
    wrongPathReaction: "Making excuses about being too tired or too busy, promising to exercise 'tomorrow'",
    longTermConsequence: "Decreased energy levels, weight gain, increased health risks, lower mood and productivity",
    preferredBehavior: "Do at least 20 minutes of movement daily, even if it's just a walk around the block",
    positiveOutcome: "Increased energy, better mood, improved health markers, higher productivity throughout the day",
    problemCategory: "health",
    emotionalImpact: 70,
    copingStrategy: "Start with micro-workouts: 5 push-ups, 1-minute plank, or 5-minute walk",
    controlSource: "Internal - I control my schedule and priorities",
    actionablePower: "Prepare workout clothes the night before and exercise first thing in the morning",
    longTermSolution: "Find enjoyable forms of movement and build a consistent routine around them",
    isPinned: true
  },
  {
    problemBehavior: "Staying up late scrolling on phone instead of sleeping",
    triggerPattern: "After completing work or evening activities, feeling like I need 'me time'",
    isDaily: true,
    preventiveStrategy: "Set a phone curfew 1 hour before intended bedtime and use a physical alarm clock",
    wrongPathReaction: "Telling myself 'just 5 more minutes' repeatedly while scrolling social media or videos",
    longTermConsequence: "Poor sleep quality, fatigue the next day, reduced productivity, negative health impacts",
    preferredBehavior: "Read a physical book or practice gratitude journaling for 30 minutes before bed",
    positiveOutcome: "Better sleep quality, more energy the next day, improved mood and focus",
    problemCategory: "habits",
    emotionalImpact: 65,
    copingStrategy: "Create a charging station outside the bedroom and use blue light blocking glasses",
    controlSource: "Internal - I control my evening routine and device usage",
    actionablePower: "Establish a consistent bedtime routine that doesn't involve screens",
    longTermSolution: "Redesign evening environment to support rest and relaxation rather than stimulation",
    isPinned: false
  },
  {
    problemBehavior: "Avoiding difficult conversations with friends and family",
    triggerPattern: "When there's tension or conflict that needs to be addressed",
    isDaily: false,
    preventiveStrategy: "Practice having difficult conversations in low-stakes situations to build confidence",
    wrongPathReaction: "Hoping the issue will resolve itself, being passive-aggressive, or complaining to others",
    longTermConsequence: "Relationship deterioration, built-up resentment, unresolved conflicts affecting other areas",
    preferredBehavior: "Address issues directly but compassionately within 48 hours of noticing them",
    positiveOutcome: "Stronger relationships, reduced stress, increased mutual respect and understanding",
    problemCategory: "relationships",
    emotionalImpact: 80,
    copingStrategy: "Use 'I' statements and focus on specific behaviors rather than character judgments",
    controlSource: "Partial - I control my communication style but not others' responses",
    actionablePower: "Practice active listening and approach conversations with curiosity rather than judgment",
    longTermSolution: "Develop emotional intelligence and communication skills through practice and feedback",
    isPinned: false
  },
  {
    problemBehavior: "Comparing myself to others on social media",
    triggerPattern: "When scrolling through social platforms and seeing others' achievements or lifestyle posts",
    isDaily: true,
    preventiveStrategy: "Limit social media usage to 30 minutes daily and unfollow accounts that trigger comparison",
    wrongPathReaction: "Feeling inadequate about my own progress and achievements, self-criticism",
    longTermConsequence: "Decreased self-esteem, unrealistic expectations, reduced satisfaction with my own life",
    preferredBehavior: "Focus on my own progress by keeping a weekly wins journal",
    positiveOutcome: "Increased self-appreciation, realistic goal-setting, more authentic self-expression",
    problemCategory: "self-esteem",
    emotionalImpact: 70,
    copingStrategy: "Remember that social media shows highlight reels, not behind-the-scenes reality",
    controlSource: "Internal - I control my social media consumption and mental responses",
    actionablePower: "Curate my social media feeds to include inspiring but realistic content",
    longTermSolution: "Build self-worth based on internal values rather than external validation",
    isPinned: false
  },
  {
    problemBehavior: "Eating mindlessly while working or watching TV",
    triggerPattern: "When I'm focused on other activities and eating becomes automatic",
    isDaily: true,
    preventiveStrategy: "Designate specific eating times and places, avoiding eating at my desk",
    wrongPathReaction: "Eating entire bags of snacks without realizing, choosing convenience over nutrition",
    longTermConsequence: "Poor nutrition, weight gain, digestive issues, reduced energy levels",
    preferredBehavior: "Eat meals mindfully at the table without distractions, paying attention to hunger cues",
    positiveOutcome: "Better digestion, appropriate portion sizes, increased meal satisfaction, stable energy",
    problemCategory: "health",
    emotionalImpact: 55,
    copingStrategy: "Prepare healthy snacks in advance and keep them easily accessible",
    controlSource: "Internal - I control what, when, and how I eat",
    actionablePower: "Create eating rituals that promote mindfulness and gratitude",
    longTermSolution: "Develop a healthy relationship with food based on nourishment rather than distraction",
    isPinned: false
  }
]

async function addDummyProblems() {
  try {
    console.log('🧠 Adding Dummy Problem Solving Entries to Database')
    console.log('==================================================')
    
    // Get the user to associate problems with
    const user = await prisma.user.findFirst()
    if (!user) {
      console.log('❌ No user found. Please create a user first.')
      return
    }
    
    console.log(`✅ Found user: ${user.email} (ID: ${user.id})`)
    
    // Check if problems already exist
    const existingProblems = await prisma.problemSolvingEntry.findMany({
      where: { userId: user.id }
    })
    
    console.log(`📋 Found ${existingProblems.length} existing problem entries`)
    
    if (existingProblems.length > 0) {
      console.log('🔄 Clearing existing problem entries first...')
      await prisma.problemSolvingEntry.deleteMany({
        where: { userId: user.id }
      })
      console.log('✅ Cleared existing entries')
    }
    
    console.log(`📝 Creating ${dummyProblems.length} new problem solving entries...`)
    
    const createdProblems = []
    for (let i = 0; i < dummyProblems.length; i++) {
      const problemData = {
        ...dummyProblems[i],
        userId: user.id,
        createdAt: new Date(Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000)), // Random date within last 30 days
        updatedAt: new Date()
      }
      
      const problem = await prisma.problemSolvingEntry.create({
        data: problemData
      })
      
      createdProblems.push(problem)
      console.log(`   ${i + 1}. Created: "${problem.problemBehavior.substring(0, 50)}..."`)
    }
    
    console.log('✅ Successfully created all problem solving entries!')
    
    // Summary by category
    console.log('\n📊 Summary by Category:')
    const categories = {}
    createdProblems.forEach(problem => {
      categories[problem.problemCategory] = (categories[problem.problemCategory] || 0) + 1
    })
    
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} problems`)
    })
    
    // Pinned problems
    const pinnedProblems = createdProblems.filter(p => p.isPinned)
    console.log(`\n📌 Pinned Problems: ${pinnedProblems.length}`)
    pinnedProblems.forEach((problem, index) => {
      console.log(`   ${index + 1}. ${problem.problemBehavior}`)
    })
    
    console.log('\n🎯 Next Steps:')
    console.log('1. Navigate to the solved problems page in the app')
    console.log('2. View and interact with the problem solving entries')
    console.log('3. Test filtering by category and pinned status')
    console.log('4. Test editing and deleting problem entries')
    
  } catch (error) {
    console.error('❌ Error adding dummy problems:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addDummyProblems()
