'use client'

import { useState } from 'react'
import { ChevronDown, Check, Plus, Edit3, Trash2, Save, X } from 'lucide-react'
import { cn, type IdentityStats, identityConfig, type ViewPeriod } from '@/lib/utils'
import { usePowerSystemTodos, useCreatePowerSystemTodo, useUpdatePowerSystemTodo } from '@/lib/hooks'
import type { PowerSystemTodo } from '@/lib/api'

interface PowerSystemProps {
  brain: IdentityStats
  muscle: IdentityStats
  money: IdentityStats
}

export function PowerSystem({ brain, muscle, money }: PowerSystemProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [viewPeriod, setViewPeriod] = useState<ViewPeriod>('weekly')
  
  // API hooks
  const { data: powerSystemData, isLoading } = usePowerSystemTodos()
  const createTodoMutation = useCreatePowerSystemTodo()
  const updateTodoMutation = useUpdatePowerSystemTodo()
  
  const todos = powerSystemData?.powerSystemTodos || []
  const [editMode, setEditMode] = useState(false)
  const [editingTodo, setEditingTodo] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [addingToIdentity, setAddingToIdentity] = useState<string | null>(null)
  const [newTodoText, setNewTodoText] = useState('')

  const toggleCollapse = (identity: string) => {
    setCollapsed(prev => ({ ...prev, [identity]: !prev[identity] }))
  }

  const identities = [
    { key: 'brain', data: brain },
    { key: 'muscle', data: muscle },
    { key: 'money', data: money }
  ] as const

  const getActiveTodosCount = (identity: string) => {
    return todos.filter(todo => todo.category === identity).length
  }

  const getCompletedTodayCount = (identity: string) => {
    const today = new Date().toISOString().split('T')[0]
    return todos
      .filter(todo => todo.category === identity)
      .filter(todo => isCompletedToday(todo)).length
  }

  const isCompletedToday = (todo: PowerSystemTodo) => {
    if (!todo.completed) return false
    
    const today = new Date().toISOString().split('T')[0]
    let todoDateStr = ''
    
    // Handle both string and Date types for the date field
    if (todo.date instanceof Date) {
      todoDateStr = todo.date.toISOString().split('T')[0]
    } else {
      // Treat as string (serialized from API)
      const dateStr = String(todo.date)
      if (dateStr.includes('T')) {
        todoDateStr = dateStr.split('T')[0]
      } else {
        todoDateStr = dateStr
      }
    }
    
    return todoDateStr === today
  }

  const handleToggleComplete = async (todoId: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    
    const todo = todos.find(t => t.id === todoId)
    if (!todo) {
      console.warn('Todo not found:', todoId)
      return
    }

    const today = new Date().toISOString().split('T')[0]
    const isCurrentlyCompleted = isCompletedToday(todo)
    
    console.log('Toggling todo:', {
      todoId,
      title: todo.title,
      currentCompleted: todo.completed,
      currentDate: todo.date,
      isCurrentlyCompleted,
      today,
      newCompleted: !isCurrentlyCompleted,
      newDate: today
    })
    
    try {
      const result = await updateTodoMutation.mutateAsync({
        id: todoId,
        data: { 
          completed: !isCurrentlyCompleted,
          date: today
        }
      })
      console.log('Todo updated successfully:', result)
    } catch (error) {
      console.error('Error updating todo:', error)
      // You could add toast notification here
    }
  }

  const handleAddTodo = async (identity: string) => {
    if (!newTodoText.trim()) return
    
    await createTodoMutation.mutateAsync({
      title: newTodoText.trim(),
      category: identity, // Using category for identity grouping
      date: new Date().toISOString().split('T')[0]
    })
    
    setNewTodoText('')
    setAddingToIdentity(null)
  }

  const handleEditTodo = async (todoId: string, newText: string) => {
    if (!newText.trim()) return
    
    await updateTodoMutation.mutateAsync({
      id: todoId,
      data: { title: newText.trim() }
    })
    
    setEditingTodo(null)
    setEditText('')
  }

  const handleDeleteTodo = async (todoId: string) => {
    // For now, we'll just mark as completed = false
    // In a real app, you might want a soft delete
    await updateTodoMutation.mutateAsync({
      id: todoId,
      data: { completed: false }
    })
  }

  const startEditing = (todo: PowerSystemTodo) => {
    setEditingTodo(todo.id)
    setEditText(todo.title)
  }

  const cancelEditing = () => {
    setEditingTodo(null)
    setEditText('')
  }

  const cancelAdding = () => {
    setAddingToIdentity(null)
    setNewTodoText('')
  }

  return (
    <div className="glass backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-800/30 shadow-lg">
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-600 dark:text-gray-400">Loading power system...</div>
        </div>
      ) : (
        <>
          {/* Header with Progress Tracking */}
          <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Power System
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditMode(!editMode)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                editMode
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              )}
            >
              <Edit3 className="w-3 h-3" />
              {editMode ? 'Exit Edit' : 'Edit Goals'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {identities.map(({ key, data }) => {
          const config = identityConfig[key]
          const isCollapsed = collapsed[key]
          
          return (
            <div 
              key={key}
              className="border border-white/30 dark:border-gray-700/50 rounded-xl overflow-hidden notion-hover backdrop-blur-sm bg-white/40 dark:bg-gray-800/40"
            >
              {/* Header */}
              <button
                onClick={() => toggleCollapse(key)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300 notion-hover"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{config.icon}</span>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {config.label}
                  </h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                      {getCompletedTodayCount(key)}/{getActiveTodosCount(key)} done
                    </span>
                  </div>
                </div>
                
                <ChevronDown className={cn(
                  "w-4 h-4 text-gray-500 dark:text-gray-400 chevron-transition",
                  isCollapsed ? "chevron-down" : "chevron-up"
                )} />
              </button>

              {/* Content */}
              <div className={cn(
                "power-system-content",
                isCollapsed ? "collapsed" : "expanded"
              )}>
                <div className="px-4 pb-4 bg-white dark:bg-[#191919]">
                  {/* Interactive Goals List */}
                  <div className="space-y-2">
                    {todos
                      .filter(todo => todo.category === key)
                      .map((todo) => {
                        const completedToday = isCompletedToday(todo)
                        const isEditing = editingTodo === todo.id
                        
                        if (isEditing) {
                          return (
                            <div key={todo.id} className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                              <input
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleEditTodo(todo.id, editText)
                                  if (e.key === 'Escape') cancelEditing()
                                }}
                              />
                              <button
                                onClick={() => handleEditTodo(todo.id, editText)}
                                className="p-1 text-green-600 hover:text-green-700 transition-colors"
                                title="Save"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="p-1 text-gray-600 hover:text-gray-700 transition-colors"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )
                        }
                        
                        return (
                          <div 
                            key={todo.id} 
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-lg transition-all duration-300 goal-item group",
                              !editMode && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:scale-[1.02] hover:shadow-sm",
                              editMode && "hover:bg-gray-50 dark:hover:bg-gray-800/50 edit-mode",
                              completedToday && "completed bg-green-50 dark:bg-green-900/20",
                              updateTodoMutation.isPending && "opacity-50 pointer-events-none"
                            )}
                            onClick={!editMode ? (e) => handleToggleComplete(todo.id, e) : undefined}
                          >
                            {!editMode ? (
                              <div
                                className={cn(
                                  "p-1.5 rounded-full transition-all duration-300 flex-shrink-0 checkmark-button relative overflow-hidden",
                                  completedToday 
                                    ? "bg-green-500 text-white shadow-lg transform scale-110" 
                                    : "border-2 border-gray-300 dark:border-gray-600 group-hover:border-green-500 dark:group-hover:border-green-500 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 group-hover:scale-110"
                                )}
                              >
                                {updateTodoMutation.isPending ? (
                                  <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Check className={cn(
                                    "w-3 h-3 transition-all duration-300 relative z-10",
                                    completedToday ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-75 rotate-45"
                                  )} />
                                )}
                                {/* Ripple effect on click */}
                                <div className={cn(
                                  "absolute inset-0 bg-green-500 rounded-full transition-all duration-500 opacity-0",
                                  completedToday && "animate-ping opacity-30"
                                )} />
                              </div>
                            ) : (
                              <div className="w-8 h-8 flex items-center justify-center">
                                <span className="text-gray-400">•</span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0 text-left">
                              <span className={cn(
                                "text-sm font-medium transition-all duration-200 block truncate",
                                completedToday 
                                  ? "text-green-700 dark:text-green-300 line-through" 
                                  : "text-gray-800 dark:text-gray-200"
                              )}>
                                {todo.title}
                              </span>
                            </div>
                            
                            {editMode ? (
                              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => startEditing(todo)}
                                  className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                                  title="Edit"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTodo(todo.id)}
                                  className="p-1 text-red-600 hover:text-red-700 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <span className={cn(
                                "text-xs font-medium flex-shrink-0 px-2 py-1 rounded-full",
                                completedToday 
                                  ? "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30" 
                                  : "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800"
                              )}>
                                {completedToday ? "✓ Done" : "Pending"}
                              </span>
                            )}
                          </div>
                        )
                      })}
                    
                    {/* Add New Todo */}
                    {editMode && addingToIdentity === key && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <input
                          type="text"
                          value={newTodoText}
                          onChange={(e) => setNewTodoText(e.target.value)}
                          className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
                          placeholder="Enter new goal..."
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddTodo(key)
                            if (e.key === 'Escape') cancelAdding()
                          }}
                        />
                        <button
                          onClick={() => handleAddTodo(key)}
                          className="p-1 text-green-600 hover:text-green-700 transition-colors"
                          title="Add"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelAdding}
                          className="p-1 text-gray-600 hover:text-gray-700 transition-colors"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    {/* Add Goal Button */}
                    {editMode && addingToIdentity !== key && (
                      <button
                        onClick={() => setAddingToIdentity(key)}
                        className="w-full flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">Add new goal</span>
                      </button>
                    )}
                    
                    {getActiveTodosCount(key) === 0 && !editMode && (
                      <div className="text-sm text-gray-500 dark:text-gray-500 text-center py-6 bg-gray-50 dark:bg-gray-800/30 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700">
                        No goals set yet. Click "Edit Goals" to add some!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      </>
      )}
    </div>
  )
}
