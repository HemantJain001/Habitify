'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, BookOpen, Target } from 'lucide-react'
import { cn, type JournalEntry, type PowerSystemTodo, mockJournalEntries } from '@/lib/utils'

interface CalendarModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenJournal?: (date: Date) => void
  journalEntries?: JournalEntry[]
  powerSystemTodos?: PowerSystemTodo[]
}

export function CalendarModal({ isOpen, onClose, onOpenJournal, journalEntries = mockJournalEntries, powerSystemTodos = [] }: CalendarModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const today = new Date()
  const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  
  const calendarDays = []
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  // Mock events data
  const events = {
    15: [
      { id: 1, title: 'Team Meeting', time: '10:00 AM', type: 'work' },
      { id: 2, title: 'Gym Session', time: '6:00 PM', type: 'fitness' }
    ],
    20: [
      { id: 3, title: 'Project Deadline', time: '5:00 PM', type: 'important' }
    ],
    25: [
      { id: 4, title: 'Code Review', time: '2:00 PM', type: 'work' },
      { id: 5, title: 'Study Session', time: '8:00 PM', type: 'personal' }
    ]
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const isToday = (day: number) => {
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear()
  }

  const hasJournalEntry = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return journalEntries.some(entry => entry.date.toDateString() === date.toDateString())
  }

  const hasEvents = (day: number) => {
    return events[day as keyof typeof events]?.length > 0
  }

  const getPowerSystemProgress = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    date.setHours(0, 0, 0, 0)
    
    const identities = ['brain', 'muscle', 'money'] as const
    let totalCompleted = 0
    let totalGoals = 0

    identities.forEach(identity => {
      const identityTodos = powerSystemTodos.filter(todo => 
        todo.identity === identity && todo.isActive
      )
      const completed = identityTodos.filter(todo => 
        todo.completedDates.some(completedDate => {
          const checkDate = new Date(completedDate)
          checkDate.setHours(0, 0, 0, 0)
          return checkDate.getTime() === date.getTime()
        })
      ).length

      totalCompleted += completed
      totalGoals += identityTodos.length
    })

    return { completed: totalCompleted, total: totalGoals }
  }

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(clickedDate)
  }

  const handleOpenJournal = (date?: Date) => {
    const targetDate = date || selectedDate || new Date()
    onOpenJournal?.(targetDate)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#191919] rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Calendar
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors notion-hover"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {currentMonth}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPreviousMonth}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors notion-hover"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={goToNextMonth}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors notion-hover"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Days of Week */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-sm font-medium text-gray-500 dark:text-gray-400 text-center py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return <div key={index} className="h-12"></div>
                  }

                  const progress = getPowerSystemProgress(day)
                  const hasJournal = hasJournalEntry(day)
                  const hasEventsToday = hasEvents(day)
                  const selectedDay = selectedDate?.getDate()
                  const isSelectedMonth = selectedDate?.getMonth() === currentDate.getMonth() && 
                                         selectedDate?.getFullYear() === currentDate.getFullYear()

                  return (
                    <button
                      key={index}
                      onClick={() => handleDayClick(day)}
                      className={cn(
                        "h-12 text-sm rounded-md transition-colors relative flex flex-col items-center justify-center",
                        isToday(day)
                          ? "bg-blue-500 text-white font-semibold"
                          : selectedDay === day && isSelectedMonth
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
                        (hasJournal || hasEventsToday) && !isToday(day) && "font-semibold"
                      )}
                    >
                      <span className="text-xs">{day}</span>
                      
                      {/* Indicators */}
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                        {hasJournal && (
                          <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                        )}
                        {hasEventsToday && (
                          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                        )}
                        {progress.total > 0 && progress.completed === progress.total && (
                          <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Add Event Button */}
              <button 
                onClick={() => handleOpenJournal()}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md font-medium transition-colors notion-hover"
              >
                <BookOpen className="w-4 h-4" />
                Open Journal
              </button>

              {/* Selected Date Info */}
              {selectedDate && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {selectedDate.toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric',
                        year: selectedDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                      })}
                    </h4>
                    <button
                      onClick={() => handleOpenJournal(selectedDate)}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      View Journal
                    </button>
                  </div>
                  
                  {/* Events for Selected Date */}
                  {(() => {
                    const selectedDay = selectedDate.getDate()
                    const dayEvents = events[selectedDay as keyof typeof events]
                    
                    return dayEvents ? (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Events</h5>
                        <div className="space-y-2">
                          {dayEvents.map((event) => (
                            <div
                              key={event.id}
                              className={cn(
                                "p-3 rounded-md border-l-4",
                                event.type === 'work' && "bg-blue-50 dark:bg-blue-900/20 border-blue-500",
                                event.type === 'fitness' && "bg-green-50 dark:bg-green-900/20 border-green-500",
                                event.type === 'important' && "bg-red-50 dark:bg-red-900/20 border-red-500",
                                event.type === 'personal' && "bg-purple-50 dark:bg-purple-900/20 border-purple-500"
                              )}
                            >
                              <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                {event.title}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {event.time}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        No events for this day
                      </div>
                    )
                  })()}
                </div>
              )}

              {/* Upcoming Events */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Upcoming</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/30 rounded-md">
                    <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      Team Standup
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Tomorrow at 9:00 AM
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/30 rounded-md">
                    <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      Workout Session
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Dec 27 at 6:00 PM
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">This Month</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/30 rounded-md">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">12</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Events</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/30 rounded-md">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">8</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
                  </div>
                </div>
              </div>

              {/* Power System Progress */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Power System</h4>
                <div className="space-y-2">
                  {(['brain', 'muscle', 'money'] as const).map(identity => {
                    const config = {
                      brain: { icon: '🧠', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/10' },
                      muscle: { icon: '💪', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/10' },
                      money: { icon: '💰', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/10' }
                    }[identity]

                    const getCompletedTodayCount = () => {
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      return powerSystemTodos
                        .filter(todo => todo.identity === identity && todo.isActive)
                        .filter(todo => 
                          todo.completedDates.some(date => {
                            const completedDate = new Date(date)
                            completedDate.setHours(0, 0, 0, 0)
                            return completedDate.getTime() === today.getTime()
                          })
                        ).length
                    }

                    const getActiveTodosCount = () => {
                      return powerSystemTodos.filter(todo => todo.identity === identity && todo.isActive).length
                    }

                    const completed = getCompletedTodayCount()
                    const total = getActiveTodosCount()
                    const percentage = total > 0 ? (completed / total) * 100 : 0

                    return (
                      <div key={identity} className={cn("flex items-center justify-between p-2 rounded-lg", config.bg)}>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{config.icon}</span>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">
                            {identity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all duration-300",
                                identity === 'brain' && "bg-purple-500",
                                identity === 'muscle' && "bg-green-500",
                                identity === 'money' && "bg-yellow-500"
                              )}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className={cn("text-xs font-bold", config.color)}>
                            {completed}/{total}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Daily Progress */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Daily Tasks</h4>
                <div className="space-y-2">
                  {(() => {
                    // Mock daily tasks - in real app this would come from props
                    const mockDailyTasks = [
                      { id: '1', title: 'Complete morning routine', completed: true, category: 'personal' },
                      { id: '2', title: 'Review project documentation', completed: true, category: 'work' },
                      { id: '3', title: 'Gym workout', completed: false, category: 'fitness' },
                      { id: '4', title: 'Read for 30 minutes', completed: false, category: 'learning' }
                    ]
                    
                    const completedCount = mockDailyTasks.filter(task => task.completed).length
                    const totalCount = mockDailyTasks.length
                    const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

                    return (
                      <>
                        <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Today's Progress</span>
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            {completedCount}/{totalCount}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                            style={{ width: `${completionPercentage}%` }}
                          />
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
