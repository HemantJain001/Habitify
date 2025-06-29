'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Calendar, Save, Edit3, Plus, ArrowLeft, ArrowRight, BookOpen, Trash2 } from 'lucide-react'
import { useJournalEntries, useCreateJournalEntry, useUpdateJournalEntry } from '@/lib/hooks'
import type { JournalEntry } from '@/lib/api'

interface JournalProps {
  className?: string
}

export function Journal({ className }: JournalProps) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isEditing, setIsEditing] = useState(false)
  const [mood, setMood] = useState(5) // Default matches database schema
  const [notes, setNotes] = useState('')
  const [unsavedChanges, setUnsavedChanges] = useState(false)

  // Format date for API
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  // Get journal entry for selected date
  const { data: journalData, isLoading, error } = useJournalEntries({
    date: formatDate(selectedDate)
  })

  const createMutation = useCreateJournalEntry()
  const updateMutation = useUpdateJournalEntry()

  const currentEntry = journalData?.journalEntries?.[0]
  const hasEntry = Boolean(currentEntry)

  // Update local state when entry changes
  useEffect(() => {
    if (currentEntry) {
      setMood(currentEntry.mood || 5)
      setNotes(currentEntry.notes || '')
    } else {
      setMood(5)
      setNotes('')
    }
    setUnsavedChanges(false)
    setIsEditing(false)
  }, [currentEntry, selectedDate])

  // Track unsaved changes
  const handleMoodChange = useCallback((newMood: number) => {
    setMood(newMood)
    setUnsavedChanges(true)
  }, [])

  const handleNotesChange = useCallback((newNotes: string) => {
    setNotes(newNotes)
    setUnsavedChanges(true)
  }, [])

  // Save entry
  const handleSave = useCallback(async () => {
    try {
      if (hasEntry && currentEntry) {
        // Update existing entry
        await updateMutation.mutateAsync({
          id: currentEntry.id,
          data: { mood, notes }
        })
      } else {
        // Create new entry
        await createMutation.mutateAsync({
          date: formatDate(selectedDate),
          mood,
          notes
        })
      }
      setUnsavedChanges(false)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save journal entry:', error)
    }
  }, [hasEntry, currentEntry, mood, notes, selectedDate, updateMutation, createMutation])

  // Navigation
  const goToPreviousDay = useCallback(() => {
    const prevDay = new Date(selectedDate)
    prevDay.setDate(prevDay.getDate() - 1)
    setSelectedDate(prevDay)
  }, [selectedDate])

  const goToNextDay = useCallback(() => {
    const nextDay = new Date(selectedDate)
    nextDay.setDate(nextDay.getDate() + 1)
    setSelectedDate(nextDay)
  }, [selectedDate])

  const goToToday = useCallback(() => {
    setSelectedDate(new Date())
  }, [])

  // Mood configuration (1-10 scale to match database schema)
  const moodConfig = {
    1: { emoji: '�', label: 'Terrible', color: 'text-red-600' },
    2: { emoji: '😞', label: 'Very Bad', color: 'text-red-500' },
    3: { emoji: '😕', label: 'Bad', color: 'text-orange-500' },
    4: { emoji: '😐', label: 'Below Average', color: 'text-orange-400' },
    5: { emoji: '😑', label: 'Neutral', color: 'text-yellow-500' },
    6: { emoji: '🙂', label: 'Okay', color: 'text-yellow-400' },
    7: { emoji: '😊', label: 'Good', color: 'text-green-400' },
    8: { emoji: '�', label: 'Very Good', color: 'text-green-500' },
    9: { emoji: '😁', label: 'Great', color: 'text-blue-500' },
    10: { emoji: '🤩', label: 'Excellent', color: 'text-blue-600' }
  }

  // Ensure mood is always a valid value (1-10 scale)
  const validMood = mood >= 1 && mood <= 10 ? mood : 5
  const currentMoodConfig = moodConfig[validMood as keyof typeof moodConfig]

  const isToday = formatDate(selectedDate) === formatDate(new Date())
  const isFuture = selectedDate > new Date()
  const isLoading_ = isLoading || createMutation.isPending || updateMutation.isPending

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Daily Journal
            </h2>
          </div>
          
          {unsavedChanges && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-amber-600">Unsaved changes</span>
              <button
                onClick={handleSave}
                disabled={isLoading_}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                <Save className="h-3 w-3" />
                Save
              </button>
            </div>
          )}
        </div>

        {/* Date Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousDay}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h3>
            {!isToday && (
              <button
                onClick={goToToday}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                Today
              </button>
            )}
          </div>

          <button
            onClick={goToNextDay}
            disabled={isFuture}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {error ? (
          <div className="text-center py-12 text-red-500">
            <p>Error loading journal entry: {error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        ) : isFuture ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>You can't write journal entries for future dates.</p>
            <button
              onClick={goToToday}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Go to Today
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Mood Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                How was your mood today?
              </label>
              
              <div className="space-y-4">
                {/* Mood Slider */}
                <div className="flex items-center gap-4">
                  <span className="text-lg">�</span>
                  <div className="flex-1">                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={validMood}
                    onChange={(e) => handleMoodChange(parseInt(e.target.value))}
                    disabled={isLoading_}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  </div>
                  <span className="text-lg">🤩</span>
                </div>

                {/* Current Mood Display */}
                <div className="text-center">
                  <div className="text-2xl mb-1">
                    {currentMoodConfig.emoji}
                  </div>
                  <div className={`text-sm font-medium ${currentMoodConfig.color}`}>
                    {currentMoodConfig.label}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Reflection & Notes
              </label>
              
              <textarea
                value={notes || ''}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="What happened today? How did you feel? What did you learn? What are you grateful for?"
                rows={8}
                disabled={isLoading_}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50"
              />
              
              <div className="text-right text-xs text-gray-500">
                {(notes || '').length} characters
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                {hasEntry && currentEntry && currentEntry.updatedAt && (
                  <>
                    <span>Last updated:</span>
                    <span>{new Date(currentEntry.updatedAt).toLocaleString()}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3">
                {unsavedChanges && (
                  <button
                    onClick={() => {
                      if (currentEntry) {
                        setMood(currentEntry.mood || 5)
                        setNotes(currentEntry.notes || '')
                      } else {
                        setMood(5)
                        setNotes('')
                      }
                      setUnsavedChanges(false)
                    }}
                    disabled={isLoading_}
                    className="px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
                
                <button
                  onClick={handleSave}
                  disabled={isLoading_ || (!unsavedChanges && hasEntry)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  {hasEntry ? 'Update Entry' : 'Create Entry'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider:focus {
          outline: none;
        }
      `}</style>
    </div>
  )
}

export default Journal
