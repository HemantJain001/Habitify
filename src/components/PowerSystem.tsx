'use client'

import { useState, useCallback, useMemo } from 'react'
import { ChevronDown, Plus, Save, X, Edit3 } from 'lucide-react'
import { cn, type IdentityStats, identityConfig, type ViewPeriod, isCompletedToday } from '@/lib/utils'
import { usePowerSystemTodos, useCreatePowerSystemTodo, useUpdatePowerSystemTodo, useDeletePowerSystemTodo } from '@/lib/hooks'
import type { PowerSystemTodo } from '@/lib/api'
import PowerSystemTodoItem from './PowerSystemTodoItem'

interface PowerSystemProps {
  brain: IdentityStats
  muscle: IdentityStats
  money: IdentityStats
  todos?: PowerSystemTodo[]
}

export function PowerSystem({ brain, muscle, money, todos: propTodos }: PowerSystemProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [viewPeriod, setViewPeriod] = useState<ViewPeriod>('weekly')
  
  // API hooks - only fetch data if not provided as props
  const { data: powerSystemData, isLoading } = usePowerSystemTodos(
    propTodos ? { enabled: false } : {}
  )
  const createTodoMutation = useCreatePowerSystemTodo()
  const updateTodoMutation = useUpdatePowerSystemTodo()
  const deleteTodoMutation = useDeletePowerSystemTodo()
  
  const todos = propTodos || powerSystemData?.powerSystemTodos || []
  
  // Debug: Log the todos to see what we're getting
  console.log('PowerSystem component debug:', {
    propTodosLength: propTodos?.length || 0,
    propTodos: propTodos,
    apiDataLength: powerSystemData?.powerSystemTodos?.length || 0,
    finalTodosLength: todos.length,
    usingProps: !!propTodos,
    isLoading
  })
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

  // Memoize computed values to prevent unnecessary recalculations
  const getActiveTodosCount = useCallback((identity: string) => {
    return todos.filter(todo => todo.category === identity).length
  }, [todos])

  const getCompletedTodayCount = useCallback((identity: string) => {
    return todos
      .filter(todo => todo.category === identity)
      .filter(todo => isCompletedToday(todo)).length
  }, [todos])

  // Memoize identity todos to prevent unnecessary filtering
  const identityTodos = useMemo(() => {
    return {
      brain: todos.filter(todo => todo.category === 'brain'),
      muscle: todos.filter(todo => todo.category === 'muscle'),
      money: todos.filter(todo => todo.category === 'money')
    }
  }, [todos])

  const handleToggleComplete = useCallback(async (todoId: string, event?: React.MouseEvent) => {
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
      newCompleted: !isCurrentlyCompleted,
      newDate: today
    })
    
    try {
      await updateTodoMutation.mutateAsync({
        id: todoId,
        data: { 
          completed: !isCurrentlyCompleted,
          date: today
        }
      })
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }, [todos, updateTodoMutation])

  const handleAddTodo = useCallback(async (identity: string) => {
    if (!newTodoText.trim()) return
    
    await createTodoMutation.mutateAsync({
      title: newTodoText.trim(),
      category: identity,
      date: new Date().toISOString().split('T')[0]
    })
    
    setNewTodoText('')
    setAddingToIdentity(null)
  }, [newTodoText, createTodoMutation])

  const handleEditTodo = useCallback(async (todoId: string, newText: string) => {
    console.log('🔧 handleEditTodo called:', { todoId, newText })
    if (!newText.trim()) {
      console.log('❌ Edit cancelled: empty text')
      return
    }
    
    try {
      console.log('📤 Sending edit request...')
      const result = await updateTodoMutation.mutateAsync({
        id: todoId,
        data: { title: newText.trim() }
      })
      console.log('✅ Edit successful:', result)
      
      setEditingTodo(null)
      setEditText('')
    } catch (error) {
      console.error('❌ Edit failed:', error)
      // Show user-friendly error
      if (error instanceof Error && error.message.includes('401')) {
        alert('Authentication required. Please sign in and try again.')
      } else {
        alert('Failed to update todo. Please try again.')
      }
    }
  }, [updateTodoMutation])

  const handleDeleteTodo = useCallback(async (todoId: string) => {
    console.log('🗑️ handleDeleteTodo called:', { todoId })
    
    // Add confirmation dialog
    const confirmed = confirm('Are you sure you want to delete this todo?')
    if (!confirmed) {
      console.log('❌ Delete cancelled by user')
      return
    }
    
    try {
      console.log('📤 Sending delete request...')
      const result = await deleteTodoMutation.mutateAsync(todoId)
      console.log('✅ Delete successful:', result)
    } catch (error) {
      console.error('❌ Delete failed:', error)
      // Show user-friendly error
      if (error instanceof Error && error.message.includes('401')) {
        alert('Authentication required. Please sign in and try again.')
      } else {
        alert('Failed to delete todo. Please try again.')
      }
    }
  }, [deleteTodoMutation])

  const startEditing = useCallback((todo: PowerSystemTodo) => {
    console.log('✏️ startEditing called:', { todoId: todo.id, todoTitle: todo.title })
    setEditingTodo(todo.id)
    setEditText(todo.title)
  }, [])

  const cancelEditing = useCallback(() => {
    setEditingTodo(null)
    setEditText('')
  }, [])

  const cancelAdding = useCallback(() => {
    setAddingToIdentity(null)
    setNewTodoText('')
  }, [])

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
              onClick={() => {
                console.log('🎛️ Edit Goals button clicked, current editMode:', editMode)
                setEditMode(!editMode)
                console.log('🎛️ Edit mode will be:', !editMode)
              }}
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
                    {identityTodos[key as keyof typeof identityTodos]?.map((todo) => (
                      <PowerSystemTodoItem
                        key={todo.id}
                        todo={todo}
                        editMode={editMode}
                        isEditing={editingTodo === todo.id}
                        editText={editText}
                        isLoading={updateTodoMutation.isPending || deleteTodoMutation.isPending}
                        onToggleComplete={handleToggleComplete}
                        onStartEditing={startEditing}
                        onEditTodo={handleEditTodo}
                        onDeleteTodo={handleDeleteTodo}
                        onCancelEditing={cancelEditing}
                        onSetEditText={setEditText}
                      />
                    ))}
                    
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
