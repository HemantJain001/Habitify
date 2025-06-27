'use client'

import { mockTasks } from '@/lib/utils'

interface ProgressTrackerProps {
  // Props for daily task tracking only
}

export function ProgressTracker({ }: ProgressTrackerProps) {
  // Mock daily tasks data
  const dailyTasks = mockTasks
  const completedTasks = dailyTasks.filter(task => task.completed)
  const totalTasks = dailyTasks.length
  const completionPercentage = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0
  
  // Mock weekly daily task completion data
  const weeklyCompletionData = [8, 12, 10, 15, 14, 11, 16] // tasks completed per day
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const maxDaily = Math.max(...weeklyCompletionData)
  
  // Task categories for today
  const brainTasks = dailyTasks.filter(task => task.identity === 'brain')
  const muscleTasks = dailyTasks.filter(task => task.identity === 'muscle')
  const moneyTasks = dailyTasks.filter(task => task.identity === 'money')
  
  const categoryData = [
    { 
      label: 'Learning', 
      completed: brainTasks.filter(t => t.completed).length,
      total: brainTasks.length,
      color: '#8b5cf6'
    },
    { 
      label: 'Fitness', 
      completed: muscleTasks.filter(t => t.completed).length,
      total: muscleTasks.length,
      color: '#10b981'
    },
    { 
      label: 'Finance', 
      completed: moneyTasks.filter(t => t.completed).length,
      total: moneyTasks.length,
      color: '#f59e0b'
    }
  ]

  return (
    <div className="glass backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-800/30 shadow-lg">
      <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
        Daily Task Progress
      </h2>
      
      <div className="space-y-6">
        {/* Today's Completion */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Today's Tasks</span>
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {completedTasks.length}/{totalTasks} completed
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="text-center">
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {Math.round(completionPercentage)}%
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-500 ml-1">complete</span>
          </div>
        </div>

        {/* Weekly Task Completion Trend */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Weekly Task Completion</h3>
          <div className="relative h-20 flex items-end justify-between gap-1 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-100 dark:border-gray-800">
            {weeklyCompletionData.map((value, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-1">
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t transition-all duration-300"
                  style={{ height: `${(value / maxDaily) * 100}%` }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {days[index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Category Progress</h3>
          <div className="space-y-3">
            {categoryData.map((category) => {
              const percentage = category.total > 0 ? (category.completed / category.total) * 100 : 0
              return (
                <div key={category.label} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {category.label}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {category.completed}/{category.total}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ 
                        backgroundColor: category.color,
                        width: `${percentage}%` 
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
