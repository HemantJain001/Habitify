'use client'

import { useState, useEffect } from 'react'
import { X, Save, Calendar as CalendarIcon, TrendingUp, Target, Clock, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { cn, type JournalEntry, type PowerSystemTodo, mockJournalEntries } from '@/lib/utils'

interface DailyJournalModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate?: Date
  powerSystemTodos?: PowerSystemTodo[]
}

export function DailyJournalModal({ isOpen, onClose, selectedDate, powerSystemTodos = [] }: DailyJournalModalProps) {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(mockJournalEntries)
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    gratitude: true,
    tomorrowGoals: true,
    powerStats: true
  })

  // Form state (removed mood, dailyWins, challenges, reflection)
  const [gratitude, setGratitude] = useState<string[]>([''])
  const [tomorrowGoals, setTomorrowGoals] = useState<string[]>([''])

  const displayDate = selectedDate || new Date()

  useEffect(() => {
    if (isOpen) {
      loadJournalForDate(displayDate)
    }
  }, [isOpen, selectedDate])

  const loadJournalForDate = (date: Date) => {
    const dateStr = date.toDateString()
    const existingEntry = journalEntries.find(entry => 
      entry.date.toDateString() === dateStr
    )

    if (existingEntry) {
      setCurrentEntry(existingEntry)
      setGratitude(existingEntry.gratitude.length > 0 ? existingEntry.gratitude : [''])
      setTomorrowGoals(existingEntry.tomorrowGoals.length > 0 ? existingEntry.tomorrowGoals : [''])
      setIsEditing(false)
    } else {
      setCurrentEntry(null)
      setGratitude([''])
      setTomorrowGoals([''])
      setIsEditing(true)
    }
  }

  const calculatePowerSystemStats = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const targetDate = new Date(displayDate)
    targetDate.setHours(0, 0, 0, 0)

    const identities = ['brain', 'muscle', 'money'] as const
    const stats = {} as any

    identities.forEach(identity => {
      const identityTodos = powerSystemTodos.filter(todo => 
        todo.identity === identity && todo.isActive
      )
      const completed = identityTodos.filter(todo => 
        todo.completedDates.some(date => {
          const completedDate = new Date(date)
          completedDate.setHours(0, 0, 0, 0)
          return completedDate.getTime() === targetDate.getTime()
        })
      ).length

      stats[identity] = {
        completed,
        total: identityTodos.length
      }
    })

    return stats
  }

  const handleSave = () => {
    const powerStats = calculatePowerSystemStats()
    
    const entryData: JournalEntry = {
      id: currentEntry?.id || `journal-${Date.now()}`,
      date: displayDate,
      mood: 4, // Default mood since we're removing mood tracking
      reflection: '', // Empty since we're removing this
      dailyWins: [], // Empty since we're removing this
      challenges: [], // Empty since we're removing this
      gratitude: gratitude.filter(item => item.trim()),
      tomorrowGoals: tomorrowGoals.filter(goal => goal.trim()),
      powerSystemStats: powerStats,
      createdAt: currentEntry?.createdAt || new Date(),
      updatedAt: new Date()
    }

    setJournalEntries(prev => {
      const existing = prev.findIndex(entry => entry.id === entryData.id)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = entryData
        return updated
      } else {
        return [...prev, entryData]
      }
    })

    setCurrentEntry(entryData)
    setIsEditing(false)
  }

  const addArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => [...prev, ''])
  }

  const updateArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
    setter(prev => prev.map((item, i) => i === index ? value : item))
  }

  const removeArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index))
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#191919] rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📖</span>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Daily Journal
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {displayDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors notion-hover"
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  Save
                </button>
                <button
                  onClick={() => loadJournalForDate(displayDate)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium transition-colors notion-hover"
                >
                  Cancel
                </button>
              </>
            ) : currentEntry && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium transition-colors notion-hover"
              >
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors notion-hover"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Power System and Tomorrow's Goals Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Power System Stats */}
            <div className="space-y-2">
              <button
                onClick={() => toggleSection('powerStats')}
                className="flex items-center justify-between w-full"
              >
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Power System</h3>
                {expandedSections.powerStats ? 
                  <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                }
              </button>
              
              {expandedSections.powerStats && (
                <div className="border border-gray-100 dark:border-gray-800 rounded-lg p-3 bg-gray-50/30 dark:bg-gray-800/20">
                  <div className="space-y-2">
                    {(['brain', 'muscle', 'money'] as const).map(identity => {
                      const stats = currentEntry?.powerSystemStats?.[identity] || calculatePowerSystemStats()[identity]
                      const config = {
                        brain: { icon: '🧠', color: 'text-purple-600 dark:text-purple-400' },
                        muscle: { icon: '💪', color: 'text-green-600 dark:text-green-400' },
                        money: { icon: '💰', color: 'text-yellow-600 dark:text-yellow-400' }
                      }[identity]

                      return (
                        <div key={identity} className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{config.icon}</span>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">
                              {identity}
                            </span>
                          </div>
                          <div className={cn("text-sm font-semibold", config.color)}>
                            {stats?.completed || 0}/{stats?.total || 0}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Tomorrow's Goals */}
            <div className="space-y-2">
              <button
                onClick={() => toggleSection('tomorrowGoals')}
                className="flex items-center justify-between w-full"
              >
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Tomorrow's Goals</h3>
                {expandedSections.tomorrowGoals ? 
                  <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                }
              </button>
              
              {expandedSections.tomorrowGoals && (
                <div className="border border-gray-100 dark:border-gray-800 rounded-lg p-3 bg-gray-50/30 dark:bg-gray-800/20">
                  <div className="space-y-2">
                    {isEditing ? (
                      <>
                        {tomorrowGoals.map((goal: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              value={goal}
                              onChange={(e) => updateArrayItem(setTomorrowGoals, index, e.target.value)}
                              placeholder="What do you want to achieve tomorrow?"
                              className="flex-1 p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                            {tomorrowGoals.length > 1 && (
                              <button
                                onClick={() => removeArrayItem(setTomorrowGoals, index)}
                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => addArrayItem(setTomorrowGoals)}
                          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-md transition-colors text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Add goal
                        </button>
                      </>
                    ) : (
                      <div className="space-y-1">
                        {(currentEntry?.tomorrowGoals || []).length > 0 ? (
                          currentEntry!.tomorrowGoals.map((goal, index) => (
                            <div key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                              {goal}
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400 italic text-sm">
                            No goals added yet.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Gratitude Section */}
          <div className="space-y-2">
            <button
              onClick={() => toggleSection('gratitude')}
              className="flex items-center justify-between w-full"
            >
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Gratitude</h3>
              {expandedSections.gratitude ? 
                <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                <ChevronDown className="w-4 h-4 text-gray-500" />
              }
            </button>
            
            {expandedSections.gratitude && (
              <div className="border border-gray-100 dark:border-gray-800 rounded-lg p-3 bg-gray-50/30 dark:bg-gray-800/20">
                <div className="space-y-2">
                  {isEditing ? (
                    <>
                      {gratitude.map((item: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            value={item}
                            onChange={(e) => updateArrayItem(setGratitude, index, e.target.value)}
                            placeholder="What are you grateful for?"
                            className="flex-1 p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                          {gratitude.length > 1 && (
                            <button
                              onClick={() => removeArrayItem(setGratitude, index)}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => addArrayItem(setGratitude)}
                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-md transition-colors text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add gratitude
                      </button>
                    </>
                  ) : (
                    <div className="space-y-1">
                      {(currentEntry?.gratitude || []).length > 0 ? (
                        currentEntry!.gratitude.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                            {item}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic text-sm">
                          No gratitude added yet.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
