'use client'

import { BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TopBarProps {
  streak: number
  totalXP: number
  maxXP: number
  onOpenJournal: () => void
}

export function TopBar({ streak, totalXP, maxXP, onOpenJournal }: TopBarProps) {
  const progressPercentage = (totalXP / maxXP) * 100

  return (
    <header className="glass sticky top-0 z-30 flex items-center justify-between px-8 py-5 backdrop-blur-md border-b border-white/20 dark:border-gray-800/30 shadow-sm">
      {/* Left Side - Greeting & Streak */}
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1">
            Good evening, Warrior 👋
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-lg">🔥</span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Day {streak} streak
            </span>
          </div>
        </div>
      </div>

      {/* Center - Journal Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenJournal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors notion-hover font-medium"
        >
          <BookOpen className="w-4 h-4" />
          Journal
        </button>
      </div>

      {/* Right Side - XP Bar & Profile */}
      <div className="flex items-center gap-4">
        {/* XP Bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-yellow-500">⚡</span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {totalXP}/{maxXP}
            </span>
          </div>
          <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Profile Icon */}
        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700">
          <span className="text-sm">👤</span>
        </div>
      </div>
    </header>
  )
}
