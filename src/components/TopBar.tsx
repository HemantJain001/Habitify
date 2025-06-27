'use client'

import { BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button, ProgressBar } from '@/components/ui'

interface TopBarProps {
  streak: number
  totalXP: number
  maxXP: number
  onOpenJournal: () => void
}

interface GreetingSectionProps {
  streak: number
}

function GreetingSection({ streak }: GreetingSectionProps) {
  return (
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
  )
}

interface XPSectionProps {
  totalXP: number
  maxXP: number
}

function XPSection({ totalXP, maxXP }: XPSectionProps) {
  return (
    <div className="flex items-center gap-4">
      {/* XP Bar */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-yellow-500">⚡</span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {totalXP}/{maxXP}
          </span>
        </div>
        <div className="w-24">
          <ProgressBar
            value={totalXP}
            max={maxXP}
            size="md"
            variant="default"
          />
        </div>
      </div>

      {/* Profile Icon */}
      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700">
        <span className="text-sm">👤</span>
      </div>
    </div>
  )
}

export function TopBar({ streak, totalXP, maxXP, onOpenJournal }: TopBarProps) {
  return (
    <header className="glass sticky top-0 z-30 flex items-center justify-between px-8 py-5 backdrop-blur-md border-b border-white/20 dark:border-gray-800/30 shadow-sm">
      {/* Left Side - Greeting & Streak */}
      <div className="flex items-center gap-6">
        <GreetingSection streak={streak} />
      </div>

      {/* Center - Journal Button */}
      <div className="flex items-center gap-2">
        <Button
          onClick={onOpenJournal}
          variant="primary"
          size="md"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Journal
        </Button>
      </div>

      {/* Right Side - XP Bar & Profile */}
      <XPSection totalXP={totalXP} maxXP={maxXP} />
    </header>
  )
}
