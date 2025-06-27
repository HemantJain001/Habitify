'use client'

import { useState, useEffect } from 'react'
import { TopBar } from '@/components/TopBar'
import { TaskList } from '@/components/TaskList'
import { PowerSystem } from '@/components/PowerSystem'
import { ProgressTracker } from '@/components/ProgressTracker'
import { JournalBlock } from '@/components/JournalBlock'
import { AICoach } from '@/components/AICoach'
import { BottomControls } from '@/components/BottomControls'
import { ProblemSolvingModal } from '@/components/ProblemSolvingModal'
import { NewMeModal } from '@/components/NewMeModal'
import { Sidebar } from '@/components/Sidebar'
import { PowerSystemModal } from '@/components/PowerSystemModal'
import { CalendarModal } from '@/components/CalendarModal'
import { mockData, mockTasks, type Task } from '@/lib/utils'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [stats, setStats] = useState(mockData)
  const [darkMode, setDarkMode] = useState(false)
  const [aiCoachOpen, setAiCoachOpen] = useState(false)
  const [problemSolvingOpen, setProblemSolvingOpen] = useState(false)
  const [newMeOpen, setNewMeOpen] = useState(false)
  const [powerSystemModalOpen, setPowerSystemModalOpen] = useState(false)
  const [calendarModalOpen, setCalendarModalOpen] = useState(false)

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
        ? { 
            ...task, 
            text: updatedTask.text, 
            xp: updatedTask.xp, 
            identity: updatedTask.identity,
            completed: updatedTask.completed // Preserve the completion status from the update
          }
        : task
    ))
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#191919] transition-colors">
      {/* Sidebar */}
      <Sidebar 
        onOpenPowerSystem={() => setPowerSystemModalOpen(true)}
        onOpenCalendar={() => setCalendarModalOpen(true)}
      />

      {/* Top Bar */}
      <TopBar 
        streak={stats.streak}
        totalXP={stats.totalXP}
        maxXP={stats.maxXP}
        onOpenProblemSolving={() => setProblemSolvingOpen(true)}
        onOpenNewMe={() => setNewMeOpen(true)}
      />

      {/* Main Content - Notion-like layout */}
      <div className="max-w-[1200px] mx-auto px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Action List */}
            <TaskList 
              tasks={tasks}
              onTaskToggle={handleTaskToggle}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
            
            {/* Power System */}
            <PowerSystem 
              brain={stats.brain}
              muscle={stats.muscle}
              money={stats.money}
            />
          </div>

          {/* Right Panel (1/3 width) */}
          <div className="space-y-8">
            {/* Progress Tracker */}
            <ProgressTracker 
              brain={stats.brain}
              muscle={stats.muscle}
              money={stats.money}
              totalXP={stats.totalXP}
              maxXP={stats.maxXP}
            />
            
            {/* Journal Block */}
            <JournalBlock />
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

      <PowerSystemModal 
        isOpen={powerSystemModalOpen}
        onClose={() => setPowerSystemModalOpen(false)}
        brain={stats.brain}
        muscle={stats.muscle}
        money={stats.money}
      />

      <CalendarModal 
        isOpen={calendarModalOpen}
        onClose={() => setCalendarModalOpen(false)}
      />
    </div>
  )
}
