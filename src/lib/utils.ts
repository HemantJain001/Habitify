import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface Task {
  id: string
  text: string
  completed: boolean
  xp: number
  identity: 'brain' | 'muscle' | 'money'
}

export interface PowerSystemTodo {
  id: string
  text: string
  description?: string
  xp: number
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
  totalXP: number
  maxXP: number
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
  totalXP: 48,
  maxXP: 100,
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
    xp: 15,
    identity: 'brain'
  },
  {
    id: '2', 
    text: 'Morning workout - 45 mins',
    completed: true,
    xp: 20,
    identity: 'muscle'
  },
  {
    id: '3',
    text: 'Review investment portfolio',
    completed: false,
    xp: 12,
    identity: 'money'
  },
  {
    id: '4',
    text: 'Read 20 pages of "Atomic Habits"',
    completed: false,
    xp: 8,
    identity: 'brain'
  },
  {
    id: '5',
    text: 'Update freelance client project',
    completed: false,
    xp: 25,
    identity: 'money'
  }
]

export const mockPowerSystemTodos: PowerSystemTodo[] = [
  // Brain - Learning & Study
  {
    id: 'brain-learning-1',
    text: 'Complete React Advanced Patterns Course',
    description: 'Master advanced React patterns including render props, compound components, and custom hooks',
    xp: 50,
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
    xp: 40,
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
    xp: 75,
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
    xp: 100,
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
    xp: 80,
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
    xp: 60,
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
    xp: 30,
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
    xp: 120,
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
    xp: 90,
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
    xp: 100,
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
  gratitude: string[]
  tomorrowGoals: string[]
  powerSystemStats: {
    brain: { completed: number; total: number }
    muscle: { completed: number; total: number }
    money: { completed: number; total: number }
  }
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

// Mock journal entries
export const mockJournalEntries: JournalEntry[] = [
  {
    id: 'journal-1',
    date: new Date('2024-01-20'),
    mood: 4,
    reflection: 'Had a productive day focusing on learning new technologies. Felt good about the progress made on my side projects.',
    dailyWins: ['Completed React course module', 'Fixed a challenging bug', 'Had a great workout'],
    challenges: ['Time management with multiple projects', 'Staying focused during meetings'],
    gratitude: ['Supportive team members', 'Learning opportunities', 'Good health'],
    tomorrowGoals: ['Start new project', 'Review investment portfolio', 'Morning meditation'],
    powerSystemStats: {
      brain: { completed: 2, total: 3 },
      muscle: { completed: 1, total: 2 },
      money: { completed: 1, total: 2 }
    },
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
    gratitude: ['Comfortable home', 'Access to resources', 'Family support'],
    tomorrowGoals: ['Wake up early', 'Focus on priority tasks', 'Read for 30 minutes'],
    powerSystemStats: {
      brain: { completed: 1, total: 3 },
      muscle: { completed: 2, total: 2 },
      money: { completed: 0, total: 2 }
    },
    createdAt: new Date('2024-01-19T21:30:00'),
    updatedAt: new Date('2024-01-19T21:30:00')
  }
]

// Mock notification settings
export const mockNotificationSettings: NotificationSetting[] = [
  {
    id: 'notif-1',
    todoId: 'brain-learning-1',
    time: '09:00',
    enabled: true,
    message: 'Time to start your learning session!'
  },
  {
    id: 'notif-2',
    todoId: 'muscle-strength-1',
    time: '18:00',
    enabled: true,
    message: 'Workout time! Let\'s build that strength!'
  },
  {
    id: 'notif-3',
    todoId: 'money-income-1',
    time: '10:00',
    enabled: false,
    message: 'Focus on business development tasks'
  }
]
