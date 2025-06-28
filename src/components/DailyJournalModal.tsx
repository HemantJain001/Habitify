'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Calendar as CalendarIcon, ChevronDown, ChevronUp, Bold, Italic, Underline } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useJournalEntries, useCreateJournalEntry, useUpdateJournalEntry } from '@/lib/hooks'
import type { JournalEntry, PowerSystemTodo } from '@/lib/api'

interface DailyJournalModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate?: Date
  powerSystemTodos?: PowerSystemTodo[]
}

export function DailyJournalModal({ isOpen, onClose, selectedDate, powerSystemTodos = [] }: DailyJournalModalProps) {
  const displayDate = selectedDate || new Date()
  const dateString = displayDate.toISOString().split('T')[0]
  
  // API hooks
  const { data: journalData, isLoading } = useJournalEntries({ date: dateString })
  const createJournalMutation = useCreateJournalEntry()
  const updateJournalMutation = useUpdateJournalEntry()
  
  const journalEntries = journalData?.journalEntries || []
  const currentEntry = journalEntries.find(entry => {
    const entryDate = typeof entry.date === 'string' ? entry.date : entry.date.toISOString().split('T')[0]
    return entryDate === dateString
  })
  
  const [isEditing, setIsEditing] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    notes: true
  })

  // Form state
  const [notes, setNotes] = useState('')
  const [mood, setMood] = useState(3)
  
  // Rich text editor ref
  const notesTextareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen) {
      // Load current entry data into form
      if (currentEntry) {
        setNotes(currentEntry.notes || '')
        setMood(currentEntry.mood || 3)
        setIsEditing(false)
      } else {
        setNotes('')
        setMood(3)
        setIsEditing(true)
      }
    }
  }, [isOpen, currentEntry])

  // Handle Escape key to auto-save and close
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleAutoSaveAndClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, isEditing, notes])

  const handleSave = async () => {
    try {
      if (currentEntry) {
        // Update existing entry
        await updateJournalMutation.mutateAsync({
          id: currentEntry.id,
          data: { notes, mood }
        })
      } else {
        // Create new entry
        await createJournalMutation.mutateAsync({
          date: dateString,
          notes,
          mood
        })
      }
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save journal entry:', error)
    }
  }

  const handleAutoSaveAndClose = async () => {
    // Auto-save if there's any content to save
    if (isEditing && notes.trim()) {
      await handleSave()
    }
    onClose()
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const formatText = (formatType: 'bold' | 'italic' | 'underline') => {
    const textarea = notesTextareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = notes.substring(start, end)

    if (selectedText) {
      let formattedText = selectedText
      
      switch (formatType) {
        case 'bold':
          formattedText = `**${selectedText}**`
          break
        case 'italic':
          formattedText = `*${selectedText}*`
          break
        case 'underline':
          formattedText = `__${selectedText}__`
          break
      }

      const newText = notes.substring(0, start) + formattedText + notes.substring(end)
      setNotes(newText)
      
      // Update textarea selection
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start, start + formattedText.length)
      }, 0)
    }
  }

  const renderFormattedText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/__(.*?)__/g, '<u>$1</u>')
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleAutoSaveAndClose()
        }
      }}
    >
      <div className="glass backdrop-blur-sm bg-white/90 dark:bg-[#191919]/90 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-800/30 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Daily Journal
            </h2>
          </div>
          <button
            onClick={handleAutoSaveAndClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Date Display */}
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                {displayDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-gray-600 dark:text-gray-400">Loading journal entry...</div>
              </div>
            ) : (
              <>
                {/* Journal Notes Section */}
                <div className="space-y-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection('notes')}
                  >
                    <h4 className="text-base font-medium text-gray-800 dark:text-gray-200">
                      Journal Notes
                    </h4>
                    {expandedSections.notes ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>

                  {expandedSections.notes && (
                    <div className="space-y-3">
                      {/* Formatting Toolbar */}
                      {isEditing && (
                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                          <button
                            onClick={() => formatText('bold')}
                            className="p-1.5 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                            title="Bold"
                          >
                            <Bold className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => formatText('italic')}
                            className="p-1.5 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                            title="Italic"
                          >
                            <Italic className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => formatText('underline')}
                            className="p-1.5 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                            title="Underline"
                          >
                            <Underline className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {isEditing ? (
                        <textarea
                          ref={notesTextareaRef}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full h-64 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                          placeholder="Write about your day, thoughts, reflections, or anything on your mind..."
                        />
                      ) : (
                        <div 
                          className="min-h-[200px] p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 cursor-pointer"
                          onClick={() => setIsEditing(true)}
                          dangerouslySetInnerHTML={{ 
                            __html: notes ? renderFormattedText(notes) : '<span class="text-gray-500">Click to add journal notes...</span>'
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Mood Section */}
                <div className="space-y-4">
                  <h4 className="text-base font-medium text-gray-800 dark:text-gray-200">
                    How are you feeling today?
                  </h4>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Bad</span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          onClick={() => setMood(value)}
                          className={cn(
                            "w-8 h-8 rounded-full border-2 transition-all",
                            mood === value
                              ? "bg-blue-500 border-blue-500 text-white"
                              : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400"
                          )}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Great</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {currentEntry ? 'Entry exists' : 'New entry'}
            </div>
            <div className="flex items-center gap-3">
              {isEditing && (
                <button
                  onClick={handleSave}
                  disabled={createJournalMutation.isPending || updateJournalMutation.isPending}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white rounded-lg transition-colors"
                >
                  {createJournalMutation.isPending || updateJournalMutation.isPending ? 'Saving...' : 'Save'}
                </button>
              )}
              {!isEditing && currentEntry && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
