'use client'

import { Settings, Moon, Sun, Bot, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BottomControlsProps {
  darkMode: boolean
  onToggleDarkMode: () => void
  onOpenAICoach: () => void
}

export function BottomControls({ darkMode, onToggleDarkMode, onOpenAICoach }: BottomControlsProps) {
  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-2 glass backdrop-blur-xl border border-white/20 dark:border-gray-800/30 rounded-2xl p-2 shadow-2xl">
      {/* Settings */}
      <button 
        className="p-3 hover:bg-white/60 dark:hover:bg-gray-800/40 rounded-xl transition-all duration-300 group notion-hover"
        title="Settings"
      >
        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200" />
      </button>

      {/* Theme Toggle */}
      <button 
        onClick={onToggleDarkMode}
        className="p-3 hover:bg-white/60 dark:hover:bg-gray-800/40 rounded-xl transition-all duration-300 group notion-hover"
        title="Toggle Theme"
      >
        {darkMode ? (
          <Sun className="w-5 h-5 text-yellow-500 group-hover:text-yellow-600" />
        ) : (
          <Moon className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
        )}
      </button>

      {/* AI Coach */}
      <button 
        onClick={onOpenAICoach}
        className="p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-300 group notion-hover"
        title="AI Coach"
      >
        <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300" />
      </button>

      {/* Collapse UI */}
      <button 
        className="p-3 hover:bg-white/60 dark:hover:bg-gray-800/40 rounded-xl transition-all duration-300 group notion-hover"
        title="Collapse UI"
      >
        <Maximize2 className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200" />
      </button>
    </div>
  )
}
