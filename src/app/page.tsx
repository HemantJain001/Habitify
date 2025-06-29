'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

import { AuthGuard } from '@/components/AuthGuard'
import { TopBar } from '@/components/TopBar'
import { TaskListNew } from '@/components/TaskListNew'
import { PowerSystem } from '@/components/PowerSystem'
import { AICoach } from '@/components/AICoach'
import { BottomControls } from '@/components/BottomControls'
import { ProblemSolvingModal } from '@/components/ProblemSolvingModal'
import { SimpleBehaviorModal } from '@/components/SimpleBehaviorModal'
import { Sidebar } from '@/components/Sidebar'
import { CalendarModal } from '@/components/CalendarModal'
import { Journal } from '@/components/Journal'
import { useTasks, useUserStats, usePowerSystemTodos, useCreateTask, useUpdateTask, useDeleteTask } from '@/lib/hooks'
import type { Task } from '@/lib/api'
import { useSession } from 'next-auth/react'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // Debug session
  console.log('🔐 Session debug:', { session, status, userId: session?.user?.id })
  
  // API queries - only enabled when user is authenticated
  const { data: tasksData, isLoading: tasksLoading, error: tasksError } = useTasks()
  const { data: statsData, isLoading: statsLoading } = useUserStats()
  
  // Get today's date for power system todos filtering
  const todayDateString = new Date().toISOString().split('T')[0]
  const { data: powerSystemData, isLoading: powerSystemLoading } = usePowerSystemTodos({ date: todayDateString })
  
  // API mutations
  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

  // Local state
  const [darkMode, setDarkMode] = useState(false)
  const [aiCoachOpen, setAiCoachOpen] = useState(false)
  const [problemSolvingOpen, setProblemSolvingOpen] = useState(false)
  const [quickTrackYourselfOpen, setQuickTrackYourselfOpen] = useState(false)
  const [calendarModalOpen, setCalendarModalOpen] = useState(false)
  const [journalPageOpen, setJournalPageOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Handle navigation query parameters
  const searchParams = useSearchParams()

  // Extract data from API responses
  const allTasks = tasksData?.tasks || []
  const stats = statsData || { streak: 0, brain: { today: 0, week: 0, month: 0, progress: 0 }, muscle: { today: 0, week: 0, month: 0, progress: 0 }, money: { today: 0, week: 0, month: 0, progress: 0 } }
  const powerSystemTodos = powerSystemData?.powerSystemTodos || []
  
  // Debug: Log what we're passing to PowerSystem
  console.log('Main page - powerSystemTodos being passed to PowerSystem:', powerSystemTodos.length, powerSystemTodos)

  // Filter tasks for today only
  const today = new Date()
  const startOfDay = new Date(today)
  startOfDay.setHours(0, 0, 0, 0)
  
  const endOfDay = new Date(today)
  endOfDay.setHours(23, 59, 59, 999)
  
  const tasks = allTasks.filter(task => {
    const taskDate = new Date(task.createdAt)
    return taskDate >= startOfDay && taskDate <= endOfDay
  })

  // Check for journal query parameter on mount
  useEffect(() => {
    if (searchParams.get('journal') === 'true') {
      setJournalPageOpen(true)
    }
  }, [searchParams])



  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const handleTaskToggle = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      await updateTaskMutation.mutateAsync({
        id: taskId,
        data: { completed: !task.completed }
      })
    }
  }

  const handleAddTask = async (newTaskData: { title: string }) => {
    await createTaskMutation.mutateAsync({
      title: newTaskData.title
    })
  }

  const handleEditTask = async (taskId: string, updatedTaskData: { title: string }) => {
    await updateTaskMutation.mutateAsync({
      id: taskId,
      data: { title: updatedTaskData.title }
    })
  }

  const handleDeleteTask = async (taskId: string) => {
    await deleteTaskMutation.mutateAsync(taskId)
  }

  const handleOpenJournal = () => {
    setJournalPageOpen(true)
  }

  const handleOpenDashboard = () => {
    setJournalPageOpen(false)
  }

  const handleOpenSolvedProblems = () => {
    router.push('/solved-problems')
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-[#191919] dark:to-gray-900 transition-all duration-500">
      {/* Sidebar */}
      <Sidebar 
        onOpenDashboard={handleOpenDashboard}
        onOpenCalendar={() => setCalendarModalOpen(true)}
        onOpenProblemSolving={() => setProblemSolvingOpen(true)}
        onOpenTrackYourself={() => setQuickTrackYourselfOpen(true)}
        onOpenJournal={() => handleOpenJournal()}
        onOpenSolvedProblems={handleOpenSolvedProblems}
        onCollapseChange={setSidebarCollapsed}
      />

      {/* Main Content Wrapper */}
      <div className={`layout-transition ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Top Bar */}
        <TopBar 
          streak={stats.streak}
          onOpenJournal={() => handleOpenJournal()}
        />

        {/* Main Content Grid */}
        <div className="p-8 max-w-[1200px] mx-auto">
          {journalPageOpen ? (
            /* Journal Page View */
            <div className="space-y-6">
              {/* Header with Back Button */}
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => setJournalPageOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Daily Journal
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Reflect on your day and track your mood
                  </p>
                </div>
              </div>
              
              {/* Journal Component */}
              <Journal />
            </div>
          ) : (
            /* Dashboard View */
            <>
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Attack Mode
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Transform your life through consistent daily actions
                </p>
              </div>

              {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* First Section - Today's Actions */}
            <div>
              {tasksError ? (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400">
                    Error loading tasks: {tasksError.message}
                  </p>
                </div>
              ) : (
                <TaskListNew 
                  tasks={tasks}
                  isLoading={tasksLoading}
                  onTaskToggle={handleTaskToggle}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                />
              )}
            </div>
            
            {/* Second Section - Power System */}
            <div>
              {statsLoading ? (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400">Loading power system...</p>
                </div>
              ) : (
                <PowerSystem 
                  brain={stats.brain}
                  muscle={stats.muscle}
                  money={stats.money}
                  todos={powerSystemTodos}
                />
              )}
            </div>
          </div>
            </>
          )}
        </div>

      {/* AI Coach Sidebar */}
      <AICoach 
        isOpen={aiCoachOpen}
        onClose={() => setAiCoachOpen(false)}
      />

      {/* Bottom Controls */}
      <BottomControls 
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenAICoach={() => setAiCoachOpen(true)}
      />

      {/* Modals */}
      <ProblemSolvingModal 
        isOpen={problemSolvingOpen}
        onClose={() => setProblemSolvingOpen(false)}
      />

      <CalendarModal 
        isOpen={calendarModalOpen}
        onClose={() => setCalendarModalOpen(false)}
        onOpenJournal={handleOpenJournal}
        powerSystemTodos={[]}
      />

      <SimpleBehaviorModal 
        isOpen={quickTrackYourselfOpen}
        onClose={() => setQuickTrackYourselfOpen(false)}
      />
      </div>
    </div>
    </AuthGuard>
  )
}
