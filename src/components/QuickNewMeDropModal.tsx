'use client'

import { useState } from 'react'
import { X, Plus, Target, Brain, Dumbbell, DollarSign, Sparkles, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

interface QuickAction {
  id: string
  title: string
  identity: 'brain' | 'muscle' | 'money'
  xp: number
  timestamp: Date
}

interface QuickNewMeDropModalProps {
  isOpen: boolean
  onClose: () => void
}

export function QuickNewMeDropModal({ isOpen, onClose }: QuickNewMeDropModalProps) {
  const [quickAction, setQuickAction] = useState('')
  const [selectedIdentity, setSelectedIdentity] = useState<'brain' | 'muscle' | 'money'>('brain')
  const [recentActions, setRecentActions] = useState<QuickAction[]>([
    {
      id: '1',
      title: 'Solved complex algorithm',
      identity: 'brain',
      xp: 50,
      timestamp: new Date()
    },
    {
      id: '2',
      title: 'Completed workout',
      identity: 'muscle',
      xp: 30,
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: '3',
      title: 'Negotiated better deal',
      identity: 'money',
      xp: 40,
      timestamp: new Date(Date.now() - 7200000)
    }
  ])

  if (!isOpen) return null

  const handleQuickAdd = () => {
    if (!quickAction.trim()) return

    const newAction: QuickAction = {
      id: Date.now().toString(),
      title: quickAction.trim(),
      identity: selectedIdentity,
      xp: getXPForIdentity(selectedIdentity),
      timestamp: new Date()
    }

    setRecentActions(prev => [newAction, ...prev.slice(0, 9)]) // Keep only 10 recent actions
    setQuickAction('')
    
    // Auto-close after adding (quick action behavior)
    setTimeout(() => {
      onClose()
    }, 500)
  }

  const getXPForIdentity = (identity: string) => {
    const xpMap = { brain: 50, muscle: 30, money: 40 }
    return xpMap[identity as keyof typeof xpMap] || 30
  }

  const getIdentityIcon = (identity: string) => {
    switch (identity) {
      case 'brain': return Brain
      case 'muscle': return Dumbbell  
      case 'money': return DollarSign
      default: return Target
    }
  }

  const getIdentityColor = (identity: string) => {
    switch (identity) {
      case 'brain': return 'bg-purple-500'
      case 'muscle': return 'bg-red-500'
      case 'money': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getIdentityLightColor = (identity: string) => {
    switch (identity) {
      case 'brain': return 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200'
      case 'muscle': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
      case 'money': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
      default: return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200'
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuickAdd()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#191919] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
              <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Quick Level Up
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Drop your win instantly
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full p-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Add Form */}
        <div className="p-6 space-y-4">
          {/* Identity Selector */}
          <div className="grid grid-cols-3 gap-2">
            {(['brain', 'muscle', 'money'] as const).map((identity) => {
              const Icon = getIdentityIcon(identity)
              const isSelected = selectedIdentity === identity
              return (
                <button
                  key={identity}
                  onClick={() => setSelectedIdentity(identity)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    isSelected
                      ? `${getIdentityColor(identity)} border-transparent text-white`
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-xs font-medium capitalize">
                    {identity}
                  </div>
                  <div className="text-xs opacity-75">
                    +{getXPForIdentity(identity)} XP
                  </div>
                </button>
              )
            })}
          </div>

          {/* Quick Input */}
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="What did you just accomplish?"
              value={quickAction}
              onChange={(e) => setQuickAction(e.target.value)}
              onKeyPress={handleKeyPress}
              className="text-center text-lg py-3"
              autoFocus
            />
            
            <Button
              onClick={handleQuickAdd}
              className="w-full py-3"
              disabled={!quickAction.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Level Up (+{getXPForIdentity(selectedIdentity)} XP)
            </Button>
          </div>
        </div>

        {/* Recent Actions */}
        <div className="px-6 pb-6">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
            Recent Wins
          </h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {recentActions.slice(0, 5).map((action) => {
              const Icon = getIdentityIcon(action.identity)
              return (
                <div
                  key={action.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div className={`p-1 rounded ${getIdentityLightColor(action.identity)}`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
                      {action.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {action.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  <div className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                    +{action.xp}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gray-50 dark:bg-gray-900/50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Quick Tips
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            🧠 Brain: Learning, coding, problem-solving<br />
            💪 Muscle: Workouts, walks, health habits<br />
            💰 Money: Business wins, investments, deals
          </p>
        </div>
      </div>
    </div>
  )
}
