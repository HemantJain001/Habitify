'use client'

import { useState, useEffect } from 'react'

import { AuthGuard } from '@/components/AuthGuard'
import { TopBar } from '@/components/TopBar'
import { TaskListNew } from '@/components/TaskListNew'
import { PowerSystem } from '@/components/PowerSystem'
import { AICoach } from '@/components/AICoach'
import { BottomControls } from '@/components/BottomControls'
import { ProblemSolvingModal } from '@/components/ProblemSolvingModal'
import { SimpleBehaviorModal } from '@/components/SimpleBehaviorModal'
import { SolvedProblemsModal } from '@/components/SolvedProblemsModal'
import { Sidebar } from '@/components/Sidebar'
import { CalendarModal } from '@/components/CalendarModal'
import { DailyJournalModal } from '@/components/DailyJournalModal'
import { DebugSession } from '@/components/DebugSession'

import { useTasks, useUserStats, usePowerSystemTodos, useCreateTask, useUpdateTask, useDeleteTask } from '@/lib/hooks'
import type { Task } from '@/lib/api'
import { useSession } from 'next-auth/react'

export default function Home() {
  const { data: session, status } = useSession()
  
  // API queries - only enabled when user is authenticated
  const { data: tasksData, isLoading: tasksLoading, error: tasksError } = useTasks()
  const { data: statsData, isLoading: statsLoading } = useUserStats()
  const { data: powerSystemData, isLoading: powerSystemLoading } = usePowerSystemTodos()
  
  // API mutations
  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

  // Local state
  const [darkMode, setDarkMode] = useState(false)
  const [aiCoachOpen, setAiCoachOpen] = useState(false)
  const [problemSolvingOpen, setProblemSolvingOpen] = useState(false)
  const [quickTrackYourselfOpen, setQuickTrackYourselfOpen] = useState(false)
  const [solvedProblemsOpen, setSolvedProblemsOpen] = useState(false)
  const [calendarModalOpen, setCalendarModalOpen] = useState(false)
  const [journalModalOpen, setJournalModalOpen] = useState(false)
  const [selectedJournalDate, setSelectedJournalDate] = useState<Date | undefined>(undefined)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Extract data from API responses
  const tasks = tasksData?.tasks || []
  const stats = statsData || { streak: 0, brain: { today: 0, week: 0, month: 0, progress: 0 }, muscle: { today: 0, week: 0, month: 0, progress: 0 }, money: { today: 0, week: 0, month: 0, progress: 0 } }
  const powerSystemTodos = powerSystemData?.powerSystemTodos || []



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

  const handleOpenJournal = (date?: Date) => {
    setSelectedJournalDate(date)
    setJournalModalOpen(true)
  }

  const handleOpenSolvedProblems = () => {
    setSolvedProblemsOpen(true)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-[#191919] dark:to-gray-900 transition-all duration-500">
      {/* Sidebar */}
      <Sidebar 
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
          {/* Debug Session - Remove in production */}
          <DebugSession />
          
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
                />
              )}
            </div>
          </div>
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

      <DailyJournalModal 
        isOpen={journalModalOpen}
        onClose={() => {
          setJournalModalOpen(false)
          setSelectedJournalDate(undefined)
        }}
        selectedDate={selectedJournalDate}
        powerSystemTodos={[]}
      />

      <SolvedProblemsModal 
        isOpen={solvedProblemsOpen}
        onClose={() => setSolvedProblemsOpen(false)}
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
