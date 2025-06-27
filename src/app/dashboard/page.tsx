'use client'

import { useState } from 'react'
import { BarChart3, TrendingUp, Target, Brain, Dumbbell, DollarSign, Calendar, Clock, Award, Zap } from 'lucide-react'
import { cn, mockData, mockPowerSystemTodos, type PowerSystemTodo } from '@/lib/utils'
import { Sidebar } from '@/components/Sidebar'
import { TopBar } from '@/components/TopBar'
import { CalendarModal } from '@/components/CalendarModal'
import { DailyJournalModal } from '@/components/DailyJournalModal'
import { ProblemSolvingModal } from '@/components/ProblemSolvingModal'
import { NewMeModal } from '@/components/NewMeModal'

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [stats] = useState(mockData)
  
  // Modal states
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [journalOpen, setJournalOpen] = useState(false)
  const [problemSolvingOpen, setProblemSolvingOpen] = useState(false)
  const [newMeOpen, setNewMeOpen] = useState(false)

  // Calculate dashboard metrics
  const totalTodos = mockPowerSystemTodos.length
  const completedTodos = mockPowerSystemTodos.filter(todo => 
    todo.completedDates.some(date => 
      new Date(date).toDateString() === new Date().toDateString()
    )
  ).length
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0

  const brainTodos = mockPowerSystemTodos.filter(todo => todo.identity === 'brain')
  const muscleTodos = mockPowerSystemTodos.filter(todo => todo.identity === 'muscle')
  const moneyTodos = mockPowerSystemTodos.filter(todo => todo.identity === 'money')

  const getProgressData = (todos: PowerSystemTodo[]) => {
    const total = todos.length
    const completed = todos.filter(todo => 
      todo.completedDates.some(date => 
        new Date(date).toDateString() === new Date().toDateString()
      )
    ).length
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 }
  }

  const brainProgress = getProgressData(brainTodos)
  const muscleProgress = getProgressData(muscleTodos)
  const moneyProgress = getProgressData(moneyTodos)

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-[#191919] dark:to-gray-900 transition-all duration-500">
      <Sidebar
        onOpenCalendar={() => setCalendarOpen(true)}
        onOpenProblemSolving={() => setProblemSolvingOpen(true)}
        onOpenJournal={() => setJournalOpen(true)}
        onOpenSolvedProblems={() => {}}
        onOpenDashboard={() => {}} // Already on dashboard
        onCollapseChange={setSidebarCollapsed}
      />
      
      <div className={cn(
        "flex-1 transition-all duration-300",
        sidebarCollapsed ? "ml-16" : "ml-64"
      )}>
        <TopBar 
          streak={stats.streak}
          totalXP={stats.totalXP}
          maxXP={stats.maxXP}
          onOpenJournal={() => setJournalOpen(true)}
        />
        
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                Dashboard Overview
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your progress across all dimensions of growth
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Streak Card */}
              <div className="bg-white dark:bg-[#191919] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="text-2xl">🔥</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {stats.streak}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Day Streak
                </p>
              </div>

              {/* Total XP Card */}
              <div className="bg-white dark:bg-[#191919] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {stats.totalXP}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total XP
                </p>
              </div>

              {/* Completion Rate Card */}
              <div className="bg-white dark:bg-[#191919] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {completionRate}%
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Today's Completion
                </p>
              </div>

              {/* Active Goals Card */}
              <div className="bg-white dark:bg-[#191919] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {totalTodos}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Active Goals
                </p>
              </div>
            </div>

            {/* Power System Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Brain Progress */}
              <div className="bg-white dark:bg-[#191919] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Brain Power
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Learning & Problem Solving
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {brainProgress.completed}/{brainProgress.total} completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${brainProgress.percentage}%` }}
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {brainProgress.percentage}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Muscle Progress */}
              <div className="bg-white dark:bg-[#191919] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <Dumbbell className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Muscle Power
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Health & Fitness
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {muscleProgress.completed}/{muscleProgress.total} completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${muscleProgress.percentage}%` }}
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-red-600 dark:text-red-400">
                      {muscleProgress.percentage}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Money Progress */}
              <div className="bg-white dark:bg-[#191919] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Money Power
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Financial & Career
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {moneyProgress.completed}/{moneyProgress.total} completed
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${moneyProgress.percentage}%` }}
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      {moneyProgress.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-white dark:bg-[#191919] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Recent Activity
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Completed morning workout
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        30 minutes ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Read 20 pages of "Clean Code"
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Completed daily journal entry
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Yesterday
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-[#191919] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Quick Actions
                  </h3>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => setJournalOpen(true)}
                    className="w-full flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors group"
                  >
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100 group-hover:text-blue-700 dark:group-hover:text-blue-200">
                      Open Daily Journal
                    </span>
                  </button>
                  <button
                    onClick={() => setProblemSolvingOpen(true)}
                    className="w-full flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors group"
                  >
                    <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-purple-900 dark:text-purple-100 group-hover:text-purple-700 dark:group-hover:text-purple-200">
                      Start Problem Solving
                    </span>
                  </button>
                  <button
                    onClick={() => setNewMeOpen(true)}
                    className="w-full flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors group"
                  >
                    <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-900 dark:text-green-100 group-hover:text-green-700 dark:group-hover:text-green-200">
                      Track New Me Progress
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <CalendarModal 
        isOpen={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        onOpenJournal={() => setJournalOpen(true)}
        powerSystemTodos={mockPowerSystemTodos}
      />
      
      <DailyJournalModal 
        isOpen={journalOpen}
        onClose={() => setJournalOpen(false)}
        powerSystemTodos={mockPowerSystemTodos}
      />
      
      <ProblemSolvingModal 
        isOpen={problemSolvingOpen}
        onClose={() => setProblemSolvingOpen(false)}
      />
      
      <NewMeModal 
        isOpen={newMeOpen}
        onClose={() => setNewMeOpen(false)}
      />
    </div>
  )
}
