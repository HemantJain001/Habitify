'use client'

import { Brain, Dumbbell, DollarSign } from 'lucide-react'
import { cn, mockPowerSystemTodos, type PowerSystemTodo } from '@/lib/utils'

interface PowerSystemMiniProps {
  powerSystemTodos?: PowerSystemTodo[]
}

export function PowerSystemMini({ powerSystemTodos = mockPowerSystemTodos }: PowerSystemMiniProps) {
  const getCompletedTodayCount = (identity: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return powerSystemTodos
      .filter(todo => todo.identity === identity && todo.isActive)
      .filter(todo => 
        todo.completedDates.some(date => {
          const completedDate = new Date(date)
          completedDate.setHours(0, 0, 0, 0)
          return completedDate.getTime() === today.getTime()
        })
      ).length
  }

  const getActiveTodosCount = (identity: string) => {
    return powerSystemTodos.filter(todo => todo.identity === identity && todo.isActive).length
  }

  const identities = [
    { 
      key: 'brain', 
      icon: Brain, 
      label: 'Brain',
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/10',
      border: 'border-purple-200 dark:border-purple-800'
    },
    { 
      key: 'muscle', 
      icon: Dumbbell, 
      label: 'Muscle',
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/10',
      border: 'border-green-200 dark:border-green-800'
    },
    { 
      key: 'money', 
      icon: DollarSign, 
      label: 'Money',
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-900/10',
      border: 'border-yellow-200 dark:border-yellow-800'
    }
  ]

  return (
    <div className="glass backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-800/30 shadow-lg">
      <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
        Power System Progress
      </h2>
      
      <div className="space-y-3">
        {identities.map(({ key, icon: Icon, label, color, bg, border }) => {
          const completed = getCompletedTodayCount(key)
          const total = getActiveTodosCount(key)
          const percentage = total > 0 ? (completed / total) * 100 : 0
          
          return (
            <div 
              key={key}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
                bg, border
              )}
            >
              <div className={cn("p-1.5 rounded-md", bg)}>
                <Icon className={cn("w-4 h-4", color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {label}
                  </span>
                  <span className={cn("text-xs font-bold", color)}>
                    {completed}/{total}
                  </span>
                </div>
                <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500 ease-out",
                      key === 'brain' && "bg-gradient-to-r from-purple-400 to-purple-600",
                      key === 'muscle' && "bg-gradient-to-r from-green-400 to-green-600",
                      key === 'money' && "bg-gradient-to-r from-yellow-400 to-yellow-600"
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
