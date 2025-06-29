'use client'

import React, { memo, useMemo, useCallback } from 'react'
import { Check, Edit3, Trash2, Save, X } from 'lucide-react'
import { cn, isCompletedToday } from '@/lib/utils'
import type { PowerSystemTodo } from '@/lib/api'

// Constants for reused CSS classes
const BUTTON_BASE = "p-1 transition-colors"
const EDIT_CONTAINER = "flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
const INPUT_BASE = "flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"

/**
 * Props interface for PowerSystemTodoItem component
 */

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

/**
 * Optimized PowerSystemTodoItem component with memoization and performance improvements
 * 
 * Features:
 * - Memoized computation of completion status and CSS classes
 * - Optimized event handlers with useCallback
 * - Custom memo comparison function to prevent unnecessary re-renders
 * - Extracted constants for better maintainability
 * - Improved type safety and documentation
 */
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
  
  // Memoize completion status to avoid recalculation
  const completedToday = useMemo(() => isCompletedToday(todo), [todo.completed, todo.date])
  
  // Memoize event handlers to prevent unnecessary re-renders
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onEditTodo(todo.id, editText)
    if (e.key === 'Escape') onCancelEditing()
  }, [todo.id, editText, onEditTodo, onCancelEditing])
  
  const handleSave = useCallback(() => {
    onEditTodo(todo.id, editText)
  }, [todo.id, editText, onEditTodo])
  
  const handleEdit = useCallback(() => {
    console.log('🔧 Edit button clicked for todo:', todo.id, todo.title)
    onStartEditing(todo)
  }, [todo, onStartEditing])
  
  const handleDelete = useCallback(() => {
    console.log('🗑️ Delete button clicked for todo:', todo.id, todo.title)
    onDeleteTodo(todo.id)
  }, [todo.id, onDeleteTodo])
  
  const handleToggle = useCallback((e: React.MouseEvent) => {
    onToggleComplete(todo.id, e)
  }, [todo.id, onToggleComplete])
  
  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSetEditText(e.target.value)
  }, [onSetEditText])
  
  // Memoize CSS classes
  const containerClasses = useMemo(() => cn(
    "flex items-center gap-3 p-3 rounded-lg transition-all duration-300 goal-item group",
    !editMode && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:scale-[1.02] hover:shadow-sm",
    editMode && "hover:bg-gray-50 dark:hover:bg-gray-800/50 edit-mode",
    completedToday && "completed bg-green-50 dark:bg-green-900/20",
    isLoading && "opacity-50 pointer-events-none"
  ), [editMode, completedToday, isLoading])
  
  const checkmarkClasses = useMemo(() => cn(
    "p-1.5 rounded-full transition-all duration-300 flex-shrink-0 checkmark-button relative overflow-hidden",
    completedToday 
      ? "bg-green-500 text-white shadow-lg transform scale-110" 
      : "border-2 border-gray-300 dark:border-gray-600 group-hover:border-green-500 dark:group-hover:border-green-500 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 group-hover:scale-110"
  ), [completedToday])
  
  const titleClasses = useMemo(() => cn(
    "text-sm font-medium transition-all duration-200 block truncate",
    completedToday 
      ? "text-green-700 dark:text-green-300 line-through" 
      : "text-gray-800 dark:text-gray-200"
  ), [completedToday])
  
  const statusClasses = useMemo(() => cn(
    "text-xs font-medium flex-shrink-0 px-2 py-1 rounded-full",
    completedToday 
      ? "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30" 
      : "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800"
  ), [completedToday])

  // Render edit mode
  if (isEditing) {
    return (
      <div className={EDIT_CONTAINER}>
        <input
          type="text"
          value={editText}
          onChange={handleTextChange}
          className={INPUT_BASE}
          autoFocus
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSave}
          className={cn(BUTTON_BASE, "text-green-600 hover:text-green-700")}
          title="Save"
        >
          <Save className="w-4 h-4" />
        </button>
        <button
          onClick={onCancelEditing}
          className={cn(BUTTON_BASE, "text-gray-600 hover:text-gray-700")}
          title="Cancel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  // Render display mode
  return (
    <div 
      className={containerClasses}
      onClick={!editMode ? handleToggle : undefined}
    >
      {/* Checkbox/Icon Section */}
      {!editMode ? (
        <div className={checkmarkClasses}>
          {isLoading ? (
            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Check className={cn(
              "w-3 h-3 transition-all duration-300 relative z-10",
              completedToday ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-75 rotate-45"
            )} />
          )}
          {/* Ripple effect */}
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
      
      {/* Title Section */}
      <div className="flex-1 min-w-0 text-left">
        <span className={titleClasses}>
          {todo.title}
        </span>
      </div>
      
      {/* Action Section */}
      {editMode ? (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleEdit}
            className={cn(BUTTON_BASE, "text-blue-600 hover:text-blue-700")}
            title="Edit"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={handleDelete}
            className={cn(BUTTON_BASE, "text-red-600 hover:text-red-700")}
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <span className={statusClasses}>
          {completedToday ? "✓ Done" : "Pending"}
        </span>
      )}
    </div>
  )
})

// Custom comparison function for memo to prevent unnecessary re-renders
const areEqual = (prevProps: PowerSystemTodoItemProps, nextProps: PowerSystemTodoItemProps) => {
  return (
    prevProps.todo.id === nextProps.todo.id &&
    prevProps.todo.title === nextProps.todo.title &&
    prevProps.todo.completed === nextProps.todo.completed &&
    prevProps.todo.date === nextProps.todo.date &&
    prevProps.editMode === nextProps.editMode &&
    prevProps.isEditing === nextProps.isEditing &&
    prevProps.editText === nextProps.editText &&
    prevProps.isLoading === nextProps.isLoading
  )
}

export default memo(PowerSystemTodoItem, areEqual)
