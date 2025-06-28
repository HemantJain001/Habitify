'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Calendar as CalendarIcon, Plus, Trash2, ChevronDown, ChevronUp, Bold, Italic, Underline } from 'lucide-react'
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
    notes: true,
    gratitude: true,
    tomorrowGoals: true
  })

  // Form state
  const [notes, setNotes] = useState('')
  const [gratitude, setGratitude] = useState<string[]>([''])
  const [tomorrowGoals, setTomorrowGoals] = useState<string[]>([''])
  
  // Rich text editor ref
  const notesTextareaRef = useRef<HTMLTextAreaElement>(null)

  const displayDate = selectedDate || new Date()

  useEffect(() => {
    if (isOpen) {
      loadJournalForDate(displayDate)
    }
  }, [isOpen, selectedDate])

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
  }, [isOpen, isEditing, notes, gratitude, tomorrowGoals])

  const loadJournalForDate = (date: Date) => {
    const dateStr = date.toDateString()
    const existingEntry = journalEntries.find(entry => 
      entry.date.toDateString() === dateStr
    )

    if (existingEntry) {
      setCurrentEntry(existingEntry)
      setNotes(existingEntry.notes || '')
      setGratitude(existingEntry.gratitude.length > 0 ? existingEntry.gratitude : [''])
      setTomorrowGoals(existingEntry.tomorrowGoals.length > 0 ? existingEntry.tomorrowGoals : [''])
      setIsEditing(false)
    } else {
      setCurrentEntry(null)
      setNotes('')
      setGratitude([''])
      setTomorrowGoals([''])
      setIsEditing(true)
    }
  }

  const handleSave = () => {
    const entryData: JournalEntry = {
      id: currentEntry?.id || `journal-${Date.now()}`,
      date: displayDate,
      mood: 4, // Default mood since we're removing mood tracking
      reflection: '', // Empty since we're removing this
      dailyWins: [], // Empty since we're removing this
      challenges: [], // Empty since we're removing this
      notes: notes,
      gratitude: gratitude.filter(item => item.trim()),
      tomorrowGoals: tomorrowGoals.filter(goal => goal.trim()),
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

  const handleAutoSaveAndClose = () => {
    // Auto-save if there's any content to save
    if (isEditing && (notes.trim() || gratitude.some(item => item.trim()) || tomorrowGoals.some(goal => goal.trim()))) {
      handleSave()
    }
    onClose()
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

  // Rich text formatting functions
  const formatText = (format: 'bold' | 'italic' | 'underline') => {
    const textarea = notesTextareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = notes.substring(start, end)
    
    if (selectedText) {
      let formattedText = ''
      
      switch (format) {
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
      
      // Restore focus and selection
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start, start + formattedText.length)
      }, 0)
    }
  }

  // Convert markdown-like formatting to HTML for display
  const formatNotesForDisplay = (text: string) => {
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
            {!isEditing && currentEntry && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium transition-colors notion-hover"
              >
                Edit
              </button>
            )}
            {isEditing && (
              <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                Changes save automatically
              </span>
            )}
            <button
              onClick={handleAutoSaveAndClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors notion-hover"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Notes Section */}
          <div className="space-y-2 mb-6">
            <button
              onClick={() => toggleSection('notes')}
              className="flex items-center justify-between w-full"
            >
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Notes & Thoughts</h3>
              {expandedSections.notes ? 
                <ChevronUp className="w-4 h-4 text-gray-500" /> : 
                <ChevronDown className="w-4 h-4 text-gray-500" />
              }
            </button>
            
            {expandedSections.notes && (
              <div className="border border-gray-100 dark:border-gray-800 rounded-lg p-3 bg-gray-50/30 dark:bg-gray-800/20">
                {isEditing ? (
                  <div className="space-y-3">
                    {/* Formatting Toolbar */}
                    <div className="flex items-center gap-1 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                      <button
                        onClick={() => formatText('bold')}
                        className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        title="Bold (Ctrl+B)"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => formatText('italic')}
                        className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        title="Italic (Ctrl+I)"
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => formatText('underline')}
                        className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        title="Underline (Ctrl+U)"
                      >
                        <Underline className="w-4 h-4" />
                      </button>
                      <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        Select text to format
                      </span>
                    </div>
                    
                    {/* Textarea */}
                    <textarea
                      ref={notesTextareaRef}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      onKeyDown={(e) => {
                        // Keyboard shortcuts
                        if (e.ctrlKey || e.metaKey) {
                          switch (e.key) {
                            case 'b':
                              e.preventDefault()
                              formatText('bold')
                              break
                            case 'i':
                              e.preventDefault()
                              formatText('italic')
                              break
                            case 'u':
                              e.preventDefault()
                              formatText('underline')
                              break
                          }
                        }
                      }}
                      placeholder="Write your thoughts, reflections, or anything that comes to mind..."
                      className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none h-32 font-mono"
                    />
                    
                    {/* Helper text */}
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Use <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">**bold**</code>, <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">*italic*</code>, or <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">__underline__</code> for formatting
                    </div>
                  </div>
                ) : (
                  <div 
                    className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: (currentEntry?.notes || '').length > 0 
                        ? formatNotesForDisplay(currentEntry!.notes)
                        : '<p class="text-gray-500 dark:text-gray-400 italic">No notes added yet.</p>'
                    }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Tomorrow's Goals */}
          <div className="space-y-2 mb-6">
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
