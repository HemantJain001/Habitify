'use client'

import { useState } from 'react'
import { X, Zap, Brain, Dumbbell, DollarSign, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface BehaviorEntry {
  id: string
  behavior: string
  identity: 'brain' | 'muscle' | 'money'
  timestamp: Date
  xp: number
}

interface SimpleBehaviorModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SimpleBehaviorModal({ isOpen, onClose }: SimpleBehaviorModalProps) {
  const [behavior, setBehavior] = useState('')
  const [selectedIdentity, setSelectedIdentity] = useState<'brain' | 'muscle' | 'money'>('brain')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!behavior.trim()) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Calculate XP based on behavior complexity
    const xp = Math.floor(Math.random() * 50) + 25
    
    const entry: BehaviorEntry = {
      id: Date.now().toString(),
      behavior: behavior.trim(),
      identity: selectedIdentity,
      timestamp: new Date(),
      xp
    }

    console.log('New behavior entry:', entry)
    
    setBehavior('')
    setIsSubmitting(false)
    onClose()
  }

  const identities = [
    { 
      id: 'brain' as const, 
      label: '🧠 Brain', 
      icon: Brain, 
      examples: ['Learned new concept', 'Solved problem', 'Read educational content']
    },
    { 
      id: 'muscle' as const, 
      label: '💪 Muscle', 
      icon: Dumbbell, 
      examples: ['Worked out', 'Ate healthy', 'Got good sleep']
    },
    { 
      id: 'money' as const, 
      label: '💰 Money', 
      icon: DollarSign, 
      examples: ['Made money', 'Saved money', 'Invested wisely']
    }
  ]

  const selectedIdentityData = identities.find(i => i.id === selectedIdentity)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Track Yourself
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Quick behavior win
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

        {/* Identity Selection Tabs */}
        <div className="mb-4">
          <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
            {identities.map((identity) => (
              <button
                key={identity.id}
                onClick={() => setSelectedIdentity(identity.id)}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                  selectedIdentity === identity.id
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {identity.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Behavior Buttons */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            What did you do?
          </label>
          <div className="grid gap-2">
            {selectedIdentityData?.examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setBehavior(example)}
                className={`p-3 text-left rounded-lg border-2 transition-all hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  behavior === example
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {example}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Or describe your own:
          </label>
          <textarea
            value={behavior}
            onChange={(e) => setBehavior(e.target.value)}
            placeholder="What behavior demonstrated your new identity?"
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none"
            rows={2}
            maxLength={100}
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {behavior.length}/100 characters
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!behavior.trim() || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Recording...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Record Behavior (+{Math.floor(Math.random() * 30) + 15} XP)
            </div>
          )}
        </Button>
      </Card>
    </div>
  )
}
