// API client utilities for AttackMode app

const API_BASE = '/api'

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  
  const config: RequestInit = {
    credentials: 'include', // Include cookies/session
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(url, config)
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }
  
  return response.json()
}

// Task API functions
export const taskApi = {
  // Get all tasks
  getTasks: () => apiRequest<{ tasks: Task[] }>('/tasks'),
  
  // Create new task
  createTask: (data: { title: string }) =>
    apiRequest<{ task: Task }>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Update task
  updateTask: (id: string, data: { title?: string; completed?: boolean }) =>
    apiRequest<{ task: Task }>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // Delete task
  deleteTask: (id: string) =>
    apiRequest<{ message: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    }),
}

// Power System API functions
export const powerSystemApi = {
  // Get power system todos
  getPowerSystemTodos: (params?: { category?: string; date?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.set('category', params.category)
    if (params?.date) searchParams.set('date', params.date)
    
    const query = searchParams.toString()
    return apiRequest<{ powerSystemTodos: PowerSystemTodo[] }>(
      `/power-system${query ? `?${query}` : ''}`
    )
  },
  
  // Create power system todo
  createPowerSystemTodo: (data: { title: string; category: string; date?: string }) =>
    apiRequest<{ powerSystemTodo: PowerSystemTodo }>('/power-system', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Update power system todo
  updatePowerSystemTodo: (id: string, data: { title?: string; category?: string; completed?: boolean; date?: string }) =>
    apiRequest<{ powerSystemTodo: PowerSystemTodo }>(`/power-system/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // Delete power system todo
  deletePowerSystemTodo: (id: string) =>
    apiRequest<{ message: string }>(`/power-system/${id}`, {
      method: 'DELETE',
    }),
}

// Journal API functions
export const journalApi = {
  // Get journal entries
  getJournalEntries: (params?: { date?: string; limit?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.date) searchParams.set('date', params.date)
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    
    const query = searchParams.toString()
    return apiRequest<{ journalEntries: JournalEntry[] }>(
      `/journal${query ? `?${query}` : ''}`
    )
  },
  
  // Create journal entry
  createJournalEntry: (data: { date: string; notes?: string; mood?: number }) =>
    apiRequest<{ journalEntry: JournalEntry }>('/journal', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Update journal entry
  updateJournalEntry: (id: string, data: { notes?: string; mood?: number }) =>
    apiRequest<{ journalEntry: JournalEntry }>(`/journal/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // Delete journal entry
  deleteJournalEntry: (id: string) =>
    apiRequest<{ message: string }>(`/journal/${id}`, {
      method: 'DELETE',
    }),
}

// User API functions
export const userApi = {
  // Get user profile
  getProfile: () => apiRequest<{ user: any; session: any }>('/user/profile'),
  
  // Get user stats
  getStats: () => apiRequest<UserStats>('/user/stats'),
}

// Problem solving API functions
export const problemApi = {
  // Get problems
  getProblems: (params?: { category?: string; limit?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.set('category', params.category)
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    
    const query = searchParams.toString()
    return apiRequest<{ problemEntries: ProblemSolvingEntry[] }>(
      `/problems${query ? `?${query}` : ''}`
    )
  },
  
  // Get a specific problem entry
  getProblem: (id: string) =>
    apiRequest<{ problemEntry: ProblemSolvingEntry }>(`/problems/${id}`),
  
  // Create problem entry
  createProblem: (data: {
    problemBehavior: string
    triggerPattern: string
    isDaily?: boolean
    preventiveStrategy?: string
    wrongPathReaction?: string
    longTermConsequence?: string
    preferredBehavior?: string
    positiveOutcome?: string
    problemCategory?: string
    emotionalImpact?: number
    copingStrategy?: string
    controlSource?: string
    actionablePower?: string
    longTermSolution?: string
    isPinned?: boolean
  }) =>
    apiRequest<{ problemEntry: ProblemSolvingEntry }>('/problems', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Update problem entry
  updateProblem: (id: string, data: {
    problemBehavior?: string
    triggerPattern?: string
    isDaily?: boolean
    preventiveStrategy?: string
    wrongPathReaction?: string
    longTermConsequence?: string
    preferredBehavior?: string
    positiveOutcome?: string
    problemCategory?: string
    emotionalImpact?: number
    copingStrategy?: string
    controlSource?: string
    actionablePower?: string
    longTermSolution?: string
    isPinned?: boolean
  }) =>
    apiRequest<{ problemEntry: ProblemSolvingEntry }>(`/problems/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // Delete problem entry
  deleteProblem: (id: string) =>
    apiRequest<{ success: boolean }>(`/problems/${id}`, {
      method: 'DELETE',
    }),
}

// Behavior API functions
export const behaviorApi = {
  // Get behaviors
  getBehaviors: (params?: { date?: string; limit?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.date) searchParams.set('date', params.date)
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    
    const query = searchParams.toString()
    return apiRequest<{ behaviorEntries: BehaviorEntry[] }>(
      `/behaviors${query ? `?${query}` : ''}`
    )
  },
  
  // Create behavior entry
  createBehavior: (data: { title: string; value: string }) =>
    apiRequest<{ behaviorEntry: BehaviorEntry }>('/behaviors', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// Types (should match your existing types in utils.ts)
export interface Task {
  id: string
  title: string
  completed: boolean
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface PowerSystemTodo {
  id: string
  title: string
  category: string
  completed: boolean
  date: Date
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface JournalEntry {
  id: string
  date: Date
  notes: string
  mood: number
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface ProblemSolvingEntry {
  id: string
  problemBehavior: string
  triggerPattern: string
  isDaily: boolean
  preventiveStrategy?: string
  wrongPathReaction: string
  longTermConsequence: string
  preferredBehavior: string
  positiveOutcome: string
  problemCategory: string
  emotionalImpact: number
  copingStrategy?: string
  controlSource: string
  actionablePower?: string
  longTermSolution?: string
  isPinned: boolean
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface BehaviorEntry {
  id: string
  title: string
  value: string
  createdAt: Date
  userId: string
}

export interface UserStats {
  streak: number
  brain: IdentityStats
  muscle: IdentityStats
  money: IdentityStats
}

export interface IdentityStats {
  today: number
  week: number
  month: number
  progress: number
}
