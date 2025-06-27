'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, Check, Edit2, Trash2 } from 'lucide-react'
import { cn, type Task, identityConfig } from '@/lib/utils'

interface TaskListProps {
  tasks: Task[]
  onTaskToggle: (taskId: string) => void
  onAddTask: (task: Omit<Task, 'id'>) => void
  onEditTask?: (taskId: string, updatedTask: Omit<Task, 'id'>) => void
  onDeleteTask?: (taskId: string) => void
}

export function TaskList({ tasks, onTaskToggle, onAddTask, onEditTask, onDeleteTask }: TaskListProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [newTask, setNewTask] = useState({
    text: '',
    xp: 10,
    identity: 'brain' as Task['identity']
  })
  const [editTask, setEditTask] = useState({
    text: '',
    xp: 10,
    identity: 'brain' as Task['identity']
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)

  // Auto-focus input when form opens
  useEffect(() => {
    if (showAddForm && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showAddForm])

  // Auto-focus edit input when editing starts
  useEffect(() => {
    if (editingTaskId && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [editingTaskId])

  const handleAddTask = () => {
    if (newTask.text.trim()) {
      onAddTask({
        text: newTask.text,
        completed: false,
        xp: newTask.xp,
        identity: newTask.identity
      })
      setNewTask({ text: '', xp: 10, identity: 'brain' })
      setShowAddForm(false)
    }
  }

  const handleEditStart = (task: Task) => {
    setEditingTaskId(task.id)
    setEditTask({
      text: task.text,
      xp: task.xp,
      identity: task.identity
    })
  }

  const handleEditSave = () => {
    if (editingTaskId && editTask.text.trim()) {
      const originalTask = tasks.find(task => task.id === editingTaskId)
      if (onEditTask && originalTask) {
        onEditTask(editingTaskId, {
          text: editTask.text,
          completed: originalTask.completed, // Preserve original completion status
          xp: editTask.xp,
          identity: editTask.identity
        })
      }
      setEditingTaskId(null)
      setEditTask({ text: '', xp: 10, identity: 'brain' })
    }
  }

  const handleEditCancel = () => {
    setEditingTaskId(null)
    setEditTask({ text: '', xp: 10, identity: 'brain' })
  }

  const handleDelete = (taskId: string) => {
    if (onDeleteTask) {
      onDeleteTask(taskId)
    }
  }

  // Calculate progress
  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="glass backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-800/30 shadow-lg">
      <h2 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
        Today's Actions
      </h2>
      
      {/* Progress Bar */}
      {totalTasks > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {completedTasks} of {totalTasks} completed
            </span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        {tasks.map((task) => {
          const config = identityConfig[task.identity]
          const isEditing = editingTaskId === task.id
          
          if (isEditing) {
            return (
              <div 
                key={task.id}
                className="flex items-center gap-3 px-2 py-2 rounded-md bg-gray-50 dark:bg-gray-800/50"
              >
                {/* Checkbox - disabled during editing */}
                <div className="w-4 h-4 rounded-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />

                {/* Edit Input */}
                <input
                  ref={editInputRef}
                  type="text"
                  value={editTask.text}
                  onChange={(e) => setEditTask({ ...editTask, text: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleEditSave()
                    } else if (e.key === 'Escape') {
                      handleEditCancel()
                    }
                  }}
                  className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none notion-input"
                />

                {/* Save button */}
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleEditSave()
                  }}
                  className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors notion-hover"
                  title="Save"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            )
          }

          return (
            <div 
              key={task.id}
              className="relative group flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors notion-hover"
            >
              {/* Edit/Delete buttons - appear on hover */}
              <div className="absolute -top-1 -right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditStart(task)
                  }}
                  className="w-5 h-5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 rounded flex items-center justify-center transition-colors notion-hover"
                  title="Edit task"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(task.id)
                  }}
                  className="w-5 h-5 bg-gray-100 hover:bg-red-100 dark:bg-gray-700 dark:hover:bg-red-900/20 text-gray-600 hover:text-red-600 dark:text-gray-400 rounded flex items-center justify-center transition-colors notion-hover"
                  title="Delete task"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              {/* Task content - clickable for toggle */}
              <div 
                onClick={() => onTaskToggle(task.id)}
                className="flex items-center gap-3 flex-1 cursor-pointer"
              >
                {/* Checkbox */}
                <div
                  className={cn(
                    "w-4 h-4 rounded-sm border flex items-center justify-center transition-all duration-200 ease-out",
                    task.completed
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-gray-800"
                  )}
                >
                  <Check 
                    className={cn(
                      "w-3 h-3 text-white transition-all duration-200 ease-out",
                      task.completed 
                        ? "opacity-100 scale-100" 
                        : "opacity-0 scale-75"
                    )} 
                  />
                </div>

                {/* Task Text */}
                <span 
                  className={cn(
                    "text-gray-900 dark:text-gray-100 transition-all duration-200",
                    task.completed 
                      ? "text-gray-400 dark:text-gray-500 line-through" 
                      : ""
                  )}
                >
                  {task.text}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Task Section */}
      <div className="mt-4">
        {!showAddForm ? (
          <div
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-3 px-2 py-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/30 rounded-md transition-all cursor-text notion-hover"
          >
            <Plus className="w-4 h-4" />
            <span>Add a task</span>
          </div>
        ) : (
          <div className="flex items-center gap-3 px-2 py-2 rounded-md bg-gray-50 dark:bg-gray-800/50">
            <div className="w-4 h-4 rounded-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
            
            <input
              ref={inputRef}
              type="text"
              placeholder="Add a task"
              value={newTask.text}
              onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddTask()
                } else if (e.key === 'Escape') {
                  setShowAddForm(false)
                  setNewTask({ text: '', xp: 10, identity: 'brain' })
                }
              }}
              onBlur={() => {
                if (!newTask.text.trim()) {
                  setShowAddForm(false)
                }
              }}
              className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none notion-input"
            />

            {newTask.text.trim() && (
              <button
                onClick={handleAddTask}
                className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors notion-hover"
                title="Add Task"
              >
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
