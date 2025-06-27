'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TopBar } from '@/components/TopBar'
import { TaskList } from '@/components/TaskList'
import { PowerSystem } from '@/components/PowerSystem'


import { AICoach } from '@/components/AICoach'
import { BottomControls } from '@/components/BottomControls'
import { ProblemSolvingModal } from '@/components/ProblemSolvingModal'
import { NewMeModal } from '@/components/NewMeModal'
import { Sidebar } from '@/components/Sidebar'
import { CalendarModal } from '@/components/CalendarModal'
import { DailyJournalModal } from '@/components/DailyJournalModal'
import { mockData, mockTasks, mockPowerSystemTodos, type Task } from '@/lib/utils'

export default function Home() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [stats, setStats] = useState(mockData)
  const [darkMode, setDarkMode] = useState(false)
  const [aiCoachOpen, setAiCoachOpen] = useState(false)
  const [problemSolvingOpen, setProblemSolvingOpen] = useState(false)
  const [newMeOpen, setNewMeOpen] = useState(false)
  const [calendarModalOpen, setCalendarModalOpen] = useState(false)
  const [journalModalOpen, setJournalModalOpen] = useState(false)
  const [selectedJournalDate, setSelectedJournalDate] = useState<Date | undefined>(undefined)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const handleTaskToggle = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updated = { ...task, completed: !task.completed }
        
        // Update stats when task is completed
        if (updated.completed && !task.completed) {
          setStats(prevStats => ({
            ...prevStats,
            totalXP: prevStats.totalXP + task.xp,
            [task.identity]: {
              ...prevStats[task.identity],
              today: prevStats[task.identity].today + task.xp,
              week: prevStats[task.identity].week + task.xp
            }
          }))
        } else if (!updated.completed && task.completed) {
          // Subtract XP when task is uncompleted
          setStats(prevStats => ({
            ...prevStats,
            totalXP: Math.max(0, prevStats.totalXP - task.xp),
            [task.identity]: {
              ...prevStats[task.identity],
              today: Math.max(0, prevStats[task.identity].today - task.xp),
              week: Math.max(0, prevStats[task.identity].week - task.xp)
            }
          }))
        }
        
        return updated
      }
      return task
    }))
  }

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString()
    }
    setTasks(prev => [...prev, task])
  }

  const handleEditTask = (taskId: string, updatedTask: Omit<Task, 'id'>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, ...updatedTask }
        : task
    ))
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  const handleOpenJournal = (date?: Date) => {
    setSelectedJournalDate(date)
    setJournalModalOpen(true)
  }

  const handleOpenSolvedProblems = () => {
    router.push('/solved-problems')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-[#191919] dark:to-gray-900 transition-all duration-500">
      {/* Sidebar */}
      <Sidebar 
        onOpenCalendar={() => setCalendarModalOpen(true)}
        onOpenProblemSolving={() => setProblemSolvingOpen(true)}
        onOpenNewMe={() => setNewMeOpen(true)}
        onOpenJournal={() => handleOpenJournal()}
        onOpenSolvedProblems={handleOpenSolvedProblems}
        onCollapseChange={setSidebarCollapsed}
      />

      {/* Main Content Wrapper */}
      <div className={`layout-transition ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Top Bar */}
        <TopBar 
          streak={stats.streak}
          totalXP={stats.totalXP}
          maxXP={stats.maxXP}
          onOpenJournal={() => handleOpenJournal()}
        />

        {/* Main Content Grid */}
        <div className="p-8 max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* First Section - Today's Actions */}
            <div>
              <TaskList 
                tasks={tasks}
                onTaskToggle={handleTaskToggle}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
            
            {/* Second Section - Power System */}
            <div>
              <PowerSystem 
                brain={stats.brain}
                muscle={stats.muscle}
                money={stats.money}
              />
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
      
      <NewMeModal 
        isOpen={newMeOpen}
        onClose={() => setNewMeOpen(false)}
      />

      <CalendarModal 
        isOpen={calendarModalOpen}
        onClose={() => setCalendarModalOpen(false)}
        onOpenJournal={handleOpenJournal}
        powerSystemTodos={mockPowerSystemTodos}
      />

      <DailyJournalModal 
        isOpen={journalModalOpen}
        onClose={() => {
          setJournalModalOpen(false)
          setSelectedJournalDate(undefined)
        }}
        selectedDate={selectedJournalDate}
        powerSystemTodos={mockPowerSystemTodos}
      />
      </div>
    </div>
  )
}
