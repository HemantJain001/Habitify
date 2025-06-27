'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SidebarProps {
  onOpenCalendar?: () => void
  onOpenProblemSolving?: () => void
  onOpenNewMe?: () => void
  onOpenJournal?: () => void
  onCollapseChange?: (collapsed: boolean) => void
}

export function Sidebar({ onOpenCalendar, onOpenProblemSolving, onOpenNewMe, onOpenJournal, onCollapseChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleToggleCollapse = () => {
    const newCollapsedState = !isCollapsed
    setIsCollapsed(newCollapsedState)
    onCollapseChange?.(newCollapsedState)
  }

  return (
    <div className={`fixed left-0 top-0 h-full z-40 glass backdrop-blur-xl border-r border-white/20 dark:border-gray-800/30 shadow-xl sidebar-transition ${
      isCollapsed ? 'w-16' : 'w-64'
    } hidden lg:block`}>
      {/* Header */}
      <div className={`h-16 border-b border-white/10 dark:border-gray-800/30 flex items-center bg-white/50 dark:bg-gray-900/50 ${
        isCollapsed ? 'justify-center px-2' : 'justify-between px-4'
      }`}>
        <h2 className={`text-base font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent sidebar-content-transition ${
          isCollapsed ? 'opacity-0 scale-90 w-0' : 'opacity-100 scale-100 w-auto'
        }`}>
          Navigation
        </h2>
        <button
          onClick={handleToggleCollapse}
          className="p-2 hover:bg-white/80 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-300 notion-hover hover:scale-105"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <div className="flex-1 p-3 space-y-1 overflow-y-auto">
        {/* Calendar */}
        <button
          onClick={onOpenCalendar}
          className={`w-full flex items-center p-3 text-left hover:bg-white/60 dark:hover:bg-gray-800/40 rounded-xl transition-all duration-300 ease-in-out group notion-hover ${
            isCollapsed ? 'justify-center' : 'gap-3'
          }`}
          title="Calendar"
        >
          <span className="text-xl transition-transform duration-300 ease-in-out group-hover:scale-110 flex-shrink-0">📅</span>
          <span className={`text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white sidebar-content-transition whitespace-nowrap ${
            isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
          }`}>
            Calendar
          </span>
        </button>

        {/* Daily Journal */}
        <button
          onClick={onOpenJournal}
          className={`w-full flex items-center p-3 text-left hover:bg-white/60 dark:hover:bg-gray-800/40 rounded-xl transition-all duration-300 ease-in-out group notion-hover ${
            isCollapsed ? 'justify-center' : 'gap-3'
          }`}
          title="Daily Journal"
        >
          <span className="text-xl transition-transform duration-300 ease-in-out group-hover:scale-110 flex-shrink-0">📖</span>
          <span className={`text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white sidebar-content-transition whitespace-nowrap ${
            isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
          }`}>
            Daily Journal
          </span>
        </button>

        {/* Problem Solving */}
        <button
          onClick={onOpenProblemSolving}
          className={`w-full flex items-center p-3 text-left hover:bg-white/60 dark:hover:bg-gray-800/40 rounded-xl transition-all duration-300 ease-in-out group notion-hover ${
            isCollapsed ? 'justify-center' : 'gap-3'
          }`}
          title="Problem Solving"
        >
          <span className="text-xl transition-transform duration-300 ease-in-out group-hover:scale-110 flex-shrink-0">🧠</span>
          <span className={`text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white sidebar-content-transition whitespace-nowrap ${
            isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
          }`}>
            Problem Solving
          </span>
        </button>

        {/* New Me */}
        <button
          onClick={onOpenNewMe}
          className={`w-full flex items-center p-3 text-left hover:bg-white/60 dark:hover:bg-gray-800/40 rounded-xl transition-all duration-300 ease-in-out group notion-hover ${
            isCollapsed ? 'justify-center' : 'gap-3'
          }`}
          title="New Me"
        >
          <span className="text-xl transition-transform duration-300 ease-in-out group-hover:scale-110 flex-shrink-0">🚀</span>
          <span className={`text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white sidebar-content-transition whitespace-nowrap ${
            isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
          }`}>
            New Me
          </span>
        </button>
      </div>
    </div>
  )
}
