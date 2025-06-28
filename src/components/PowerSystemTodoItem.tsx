'use client'

import React, { memo } from 'react'
import { Check, Edit3, Trash2, Save, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PowerSystemTodo } from '@/lib/api'

interface PowerSystemTodoItemProps {
  todo: PowerSystemTodo
  editMode: boolean
  isEditing: boolean
  editText: string
  isLoading: boolean
  onToggleComplete: (todoId: string, event?: React.MouseEvent) => void
  onStartEditing: (todo: PowerSystemTodo) => void
  onEditTodo: (todoId: string, newText: string) => void
  onDeleteTodo: (todoId: string) => void
  onCancelEditing: () => void
  onSetEditText: (text: string) => void
}

const PowerSystemTodoItem = memo(function PowerSystemTodoItem({
  todo,
  editMode,
  isEditing,
  editText,
  isLoading,
  onToggleComplete,
  onStartEditing,
  onEditTodo,
  onDeleteTodo,
  onCancelEditing,
  onSetEditText
}: PowerSystemTodoItemProps) {
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

  const completedToday = isCompletedToday(todo)

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <input
          type="text"
          value={editText}
          onChange={(e) => onSetEditText(e.target.value)}
          className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') onEditTodo(todo.id, editText)
            if (e.key === 'Escape') onCancelEditing()
          }}
        />
        <button
          onClick={() => onEditTodo(todo.id, editText)}
          className="p-1 text-green-600 hover:text-green-700 transition-colors"
          title="Save"
        >
          <Save className="w-4 h-4" />
        </button>
        <button
          onClick={onCancelEditing}
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
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg transition-all duration-300 goal-item group",
        !editMode && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:scale-[1.02] hover:shadow-sm",
        editMode && "hover:bg-gray-50 dark:hover:bg-gray-800/50 edit-mode",
        completedToday && "completed bg-green-50 dark:bg-green-900/20",
        isLoading && "opacity-50 pointer-events-none"
      )}
      onClick={!editMode ? (e) => onToggleComplete(todo.id, e) : undefined}
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
          {isLoading ? (
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
            onClick={() => onStartEditing(todo)}
            className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
            title="Edit"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDeleteTodo(todo.id)}
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
})

export default PowerSystemTodoItem
