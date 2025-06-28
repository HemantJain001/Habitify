import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface Task {
  id: string
  text: string
  completed: boolean
  identity: 'brain' | 'muscle' | 'money'
}

export interface PowerSystemTodo {
  id: string
  text: string
  description?: string
  identity: 'brain' | 'muscle' | 'money'
  category: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  lastCompletedDate?: Date
  completedDates: Date[]
}

export interface IdentityStats {
  today: number
  week: number
  month: number
  progress: number
}

export type ViewPeriod = 'daily' | 'weekly' | 'monthly'

export interface IdentityCategory {
  id: string
  name: string
  description: string
  identity: 'brain' | 'muscle' | 'money'
  todos: PowerSystemTodo[]
}

export interface UserStats {
  streak: number
  brain: IdentityStats
  muscle: IdentityStats
  money: IdentityStats
}

export const identityConfig = {
  brain: {
    label: 'Intelligent',
    icon: '🧠',
    color: 'from-purple-500 to-purple-700',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800',
    categories: [
      { id: 'learning', name: 'Learning & Study', description: 'Acquire new knowledge and skills' },
      { id: 'problem-solving', name: 'Problem Solving', description: 'Tackle challenges and think critically' },
      { id: 'creativity', name: 'Creativity & Innovation', description: 'Express ideas and create new things' }
    ]
  },
  muscle: {
    label: 'Muscular', 
    icon: '💪',
    color: 'from-green-500 to-green-700',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    categories: [
      { id: 'strength', name: 'Strength Training', description: 'Build physical strength and power' },
      { id: 'cardio', name: 'Cardiovascular Health', description: 'Improve heart health and endurance' },
      { id: 'wellness', name: 'Health & Wellness', description: 'Overall physical and mental wellbeing' }
    ]
  },
  money: {
    label: 'Rich',
    icon: '💰', 
    color: 'from-yellow-500 to-yellow-700',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    categories: [
      { id: 'income', name: 'Income Generation', description: 'Increase earning potential and income streams' },
      { id: 'investment', name: 'Investment & Savings', description: 'Grow wealth through smart investments' },
      { id: 'skills', name: 'Skill Development', description: 'Learn valuable skills that increase market value' }
    ]
  }
}

export const mockData: UserStats = {
  streak: 7,
  brain: {
    today: 23,
    week: 156,
    month: 620,
    progress: 65
  },
  muscle: {
    today: 20,
    week: 140,
    month: 580,
    progress: 70
  },
  money: {
    today: 5,
    week: 45,
    month: 180,
    progress: 25
  }
}

export const mockTasks: Task[] = [
  {
    id: '1',
    text: 'Complete data structures course',
    completed: false,
    identity: 'brain'
  },
  {
    id: '2', 
    text: 'Morning workout - 45 mins',
    completed: true,
    identity: 'muscle'
  },
  {
    id: '3',
    text: 'Review investment portfolio',
    completed: false,
    identity: 'money'
  },
  {
    id: '4',
    text: 'Read 20 pages of "Atomic Habits"',
    completed: false,
    identity: 'brain'
  },
  {
    id: '5',
    text: 'Update freelance client project',
    completed: false,
    identity: 'money'
  }
]

export const mockPowerSystemTodos: PowerSystemTodo[] = [
  // Brain - Learning & Study
  {
    id: 'brain-learning-1',
    text: 'Complete React Advanced Patterns Course',
    description: 'Master advanced React patterns including render props, compound components, and custom hooks',
    identity: 'brain',
    category: 'learning',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    completedDates: [new Date('2024-01-15'), new Date('2024-01-16')]
  },
  {
    id: 'brain-learning-2',
    text: 'Read "Clean Code" by Robert Martin',
    description: 'Study best practices for writing maintainable and clean code',
    identity: 'brain',
    category: 'learning',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    completedDates: []
  },
  // Brain - Problem Solving
  {
    id: 'brain-problem-1',
    text: 'Solve 50 LeetCode Medium Problems',
    description: 'Improve algorithmic thinking and problem-solving skills',
    identity: 'brain',
    category: 'problem-solving',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    completedDates: [new Date('2024-01-14')]
  },
  // Brain - Creativity
  {
    id: 'brain-creativity-1',
    text: 'Build a Personal AI Assistant',
    description: 'Create an innovative AI-powered productivity tool',
    identity: 'brain',
    category: 'creativity',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    completedDates: []
  },
  // Muscle - Strength Training
  {
    id: 'muscle-strength-1',
    text: 'Deadlift 2x Body Weight',
    description: 'Progressive strength training to achieve 2x bodyweight deadlift',
    identity: 'muscle',
    category: 'strength',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    completedDates: [new Date('2024-01-15'), new Date('2024-01-17')]
  },
  // Muscle - Cardio
  {
    id: 'muscle-cardio-1',
    text: 'Run a Half Marathon',
    description: 'Build endurance to complete a 21K run',
    identity: 'muscle',
    category: 'cardio',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    completedDates: [new Date('2024-01-16')]
  },
  // Muscle - Wellness
  {
    id: 'muscle-wellness-1',
    text: 'Maintain 8-Hour Sleep Schedule',
    description: 'Consistent sleep schedule for optimal recovery and health',
    identity: 'muscle',
    category: 'wellness',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    completedDates: [new Date('2024-01-14'), new Date('2024-01-15'), new Date('2024-01-16'), new Date('2024-01-17')]
  },
  // Money - Income Generation
  {
    id: 'money-income-1',
    text: 'Launch Freelance Development Business',
    description: 'Start generating income through web development services',
    identity: 'money',
    category: 'income',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    completedDates: []
  },
  // Money - Investment
  {
    id: 'money-investment-1',
    text: 'Build Emergency Fund (6 months expenses)',
    description: 'Save enough to cover 6 months of living expenses',
    identity: 'money',
    category: 'investment',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    completedDates: [new Date('2024-01-15')]
  },
  // Money - Skills
  {
    id: 'money-skills-1',
    text: 'Master Full-Stack Development',
    description: 'Become proficient in both frontend and backend technologies',
    identity: 'money',
    category: 'skills',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    completedDates: [new Date('2024-01-16'), new Date('2024-01-17')]
  }
]

export interface JournalEntry {
  id: string
  date: Date
  mood: number
  reflection: string
  dailyWins: string[]
  challenges: string[]
  notes: string
  createdAt: Date
  updatedAt: Date
}

export interface NotificationSetting {
  id: string
  todoId: string
  time: string // HH:mm format
  enabled: boolean
  message?: string
}

export interface ProblemSolvingEntry {
  id: string
  title: string
  date: Date
  
  // Pattern Analysis
  wrongThing: string
  trigger: string
  isDaily: boolean
  avoidTrigger: string
  onceStarted: string
  longTermImpact: string
  
  // Solution Development
  shouldDoInstead: string
  benefits: string
  
  // Problem Nature & Emotional Impact
  problemNature: string
  emotionalImpact: number // percentage 0-100
  hasStrategy: boolean
  strategy: string
  
  // Power & Control
  hasPower: boolean
  powerToChange: string
  longTermSolution: string
  
  createdAt: Date
  updatedAt: Date
}

// Mock problem solving entries
export const mockProblemSolvingEntries: ProblemSolvingEntry[] = [
  {
    id: 'problem-1',
    title: 'Procrastination on Important Tasks',
    date: new Date('2024-01-15'),
    wrongThing: 'Scrolling social media instead of working on priority tasks',
    trigger: 'Feeling overwhelmed by the size of the task',
    isDaily: true,
    avoidTrigger: 'Break tasks into smaller, manageable chunks and set specific deadlines',
    onceStarted: 'Set a timer for 5 minutes to just get started, then continue if in flow',
    longTermImpact: 'Decreased productivity, missed opportunities, increased stress and guilt',
    shouldDoInstead: 'Use the Pomodoro Technique and tackle one small part at a time',
    benefits: 'Higher productivity, reduced stress, better quality work, sense of accomplishment',
    problemNature: 'Emotional/Behavioral',
    emotionalImpact: 70,
    hasStrategy: true,
    strategy: 'Deep breathing, breaking tasks down, using accountability partners',
    hasPower: true,
    powerToChange: 'Change my environment, use blocking apps, create better routines',
    longTermSolution: 'Build consistent habits and better task management systems',
    createdAt: new Date('2024-01-15T10:00:00'),
    updatedAt: new Date('2024-01-15T10:00:00')
  },
  {
    id: 'problem-2',
    title: 'Overthinking Before Sleep',
    date: new Date('2024-01-12'),
    wrongThing: 'Lying in bed for hours replaying conversations and worrying about tomorrow',
    trigger: 'Silence and darkness making my mind race with anxious thoughts',
    isDaily: true,
    avoidTrigger: 'Establish a wind-down routine with meditation or journaling before bed',
    onceStarted: 'Use progressive muscle relaxation or focused breathing exercises',
    longTermImpact: 'Poor sleep quality, fatigue, decreased cognitive performance, increased anxiety',
    shouldDoInstead: 'Practice mindfulness meditation and keep a journal by my bedside',
    benefits: 'Better sleep quality, improved mood, increased energy and focus during the day',
    problemNature: 'Emotional/Behavioral',
    emotionalImpact: 60,
    hasStrategy: true,
    strategy: 'Meditation app, gratitude journaling, limiting screen time before bed',
    hasPower: true,
    powerToChange: 'My bedtime routine, environment setup, thought patterns through practice',
    longTermSolution: 'Consistent meditation practice and cognitive behavioral techniques for anxiety',
    createdAt: new Date('2024-01-12T09:30:00'),
    updatedAt: new Date('2024-01-12T09:30:00')
  },
  {
    id: 'problem-3',
    title: 'Imposter Syndrome at Work',
    date: new Date('2024-01-10'),
    wrongThing: 'Doubting my abilities and avoiding challenging projects or speaking up in meetings',
    trigger: 'Being around highly skilled colleagues or receiving complex assignments',
    isDaily: false,
    avoidTrigger: 'Keep a record of my achievements and positive feedback to review regularly',
    onceStarted: 'Remind myself that everyone is learning and making mistakes is normal',
    longTermImpact: 'Limited career growth, missed opportunities, chronic stress and self-doubt',
    shouldDoInstead: 'Ask questions openly, volunteer for challenging tasks, seek feedback actively',
    benefits: 'Accelerated learning, stronger relationships with colleagues, career advancement',
    problemNature: 'Career/Professional',
    emotionalImpact: 50,
    hasStrategy: true,
    strategy: 'Keeping an achievement journal, seeking mentorship, reframing negative self-talk',
    hasPower: true,
    powerToChange: 'My mindset, how I interpret situations, the actions I take in response',
    longTermSolution: 'Build confidence through skill development and celebrate small wins consistently',
    createdAt: new Date('2024-01-10T14:15:00'),
    updatedAt: new Date('2024-01-10T14:15:00')
  },
  {
    id: 'problem-4',
    title: 'Emotional Eating During Stress',
    date: new Date('2024-01-08'),
    wrongThing: 'Eating junk food when feeling stressed, anxious, or bored',
    trigger: 'High stress situations, deadlines, or feeling overwhelmed',
    isDaily: false,
    avoidTrigger: 'Identify stress early and use alternative coping mechanisms',
    onceStarted: 'Drink water, go for a walk, or call a friend instead of reaching for food',
    longTermImpact: 'Weight gain, poor energy levels, guilt and shame, health issues',
    shouldDoInstead: 'Practice stress management techniques like exercise, meditation, or hobbies',
    benefits: 'Better physical health, stable energy levels, improved self-esteem',
    problemNature: 'Health/Wellness',
    emotionalImpact: 80,
    hasStrategy: true,
    strategy: 'Meal prep, stress management techniques, finding non-food rewards',
    hasPower: true,
    powerToChange: 'My response to stress, food choices, environment and habits',
    longTermSolution: 'Develop a comprehensive stress management plan and build healthy eating habits',
    createdAt: new Date('2024-01-08T16:45:00'),
    updatedAt: new Date('2024-01-08T16:45:00')
  },
  {
    id: 'problem-5',
    title: 'Comparing Myself to Others on Social Media',
    date: new Date('2024-01-05'),
    wrongThing: 'Scrolling through social media and feeling inadequate compared to others\' highlight reels',
    trigger: 'Seeing others\' success posts, vacation photos, or achievement announcements',
    isDaily: true,
    avoidTrigger: 'Limit social media usage and curate feeds to include more educational content',
    onceStarted: 'Remind myself that social media shows curated highlights, not full reality',
    longTermImpact: 'Decreased self-esteem, anxiety, lost focus on personal goals and growth',
    shouldDoInstead: 'Focus on my own progress, practice gratitude, engage in real-world activities',
    benefits: 'Improved self-worth, better focus on personal goals, more authentic relationships',
    problemNature: 'Emotional/Behavioral',
    emotionalImpact: 65,
    hasStrategy: true,
    strategy: 'Digital detox periods, gratitude practice, focusing on personal growth metrics',
    hasPower: true,
    powerToChange: 'My social media habits, mindset, and how I measure success',
    longTermSolution: 'Develop a healthier relationship with social media and focus on intrinsic motivation',
    createdAt: new Date('2024-01-05T11:20:00'),
    updatedAt: new Date('2024-01-05T11:20:00')
  }
]

export interface PersonalDataPoint {
  id: string
  title: string
  value: string
  date: Date
  createdAt: Date
  updatedAt: Date
}

// Mock personal data points
export const mockPersonalDataPoints: PersonalDataPoint[] = [
  {
    id: 'data-1',
    title: 'Core Identity',
    value: 'Lifelong learner who thrives on solving complex problems and building meaningful solutions.',
    date: new Date('2024-01-20'),
    createdAt: new Date('2024-01-20T10:00:00'),
    updatedAt: new Date('2024-01-20T10:00:00')
  },
  {
    id: 'data-2',
    title: 'Technical Skills',
    value: 'Full-stack development (React, Node.js, TypeScript), System design, Machine learning basics',
    date: new Date('2024-01-18'),
    createdAt: new Date('2024-01-18T14:30:00'),
    updatedAt: new Date('2024-01-18T14:30:00')
  },
  {
    id: 'data-3',
    title: 'Leadership Style',
    value: 'Direct but empathetic communicator, prefer clear actionable feedback, excel in collaborative environments',
    date: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15T09:15:00'),
    updatedAt: new Date('2024-01-15T09:15:00')
  },
  {
    id: 'data-4',
    title: '5-Year Vision',
    value: 'Leading a tech team while building products that positively impact millions of users',
    date: new Date('2024-01-12'),
    createdAt: new Date('2024-01-12T16:45:00'),
    updatedAt: new Date('2024-01-12T16:45:00')
  },
  {
    id: 'data-5',
    title: 'Problem Solving',
    value: 'Systematic approach to breaking down complex problems into manageable components',
    date: new Date('2024-01-10'),
    createdAt: new Date('2024-01-10T11:20:00'),
    updatedAt: new Date('2024-01-10T11:20:00')
  }
]

// Mock journal entries
export const mockJournalEntries: JournalEntry[] = [
  {
    id: 'journal-1',
    date: new Date('2024-01-20'),
    mood: 4,
    reflection: 'Had a productive day focusing on learning new technologies. Felt good about the progress made on my side projects.',
    dailyWins: ['Completed React course module', 'Fixed a challenging bug', 'Had a great workout'],
    challenges: ['Time management with multiple projects', 'Staying focused during meetings'],
    notes: 'Today was particularly good for deep work. I found that blocking out distractions really helped me focus on complex problems.',
    createdAt: new Date('2024-01-20T20:00:00'),
    updatedAt: new Date('2024-01-20T20:00:00')
  },
  {
    id: 'journal-2',
    date: new Date('2024-01-19'),
    mood: 3,
    reflection: 'Average day with some ups and downs. Need to work on consistency with my morning routine.',
    dailyWins: ['Completed workout', 'Had good client call'],
    challenges: ['Woke up late', 'Procrastinated on important tasks'],
    notes: 'Need to establish better boundaries between work and personal time. Also thinking about investing more time in learning new skills.',
    createdAt: new Date('2024-01-19T21:30:00'),
    updatedAt: new Date('2024-01-19T21:30:00')
  }
]
