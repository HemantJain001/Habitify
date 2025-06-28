'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardTitle, Button, Input, Checkbox, ProgressBar } from '@/components/ui'
import type { Task } from '@/lib/api'

interface TaskListProps {
  tasks: Task[]
  isLoading?: boolean
  onTaskToggle: (taskId: string) => void
  onAddTask: (task: { title: string }) => void
  onEditTask?: (taskId: string, updatedTask: { title: string }) => void
  onDeleteTask?: (taskId: string) => void
}

interface TaskItemProps {
  task: Task
  isEditing: boolean
  editText: string
  onToggle: () => void
  onEditStart: () => void
  onEditSave: () => void
  onEditCancel: () => void
  onEditTextChange: (text: string) => void
  onDelete: () => void
}

function TaskItem({ 
  task, 
  isEditing, 
  editText, 
  onToggle, 
  onEditStart, 
  onEditSave, 
  onEditCancel, 
  onEditTextChange, 
  onDelete 
}: TaskItemProps) {
  const editInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [isEditing])

  if (isEditing) {
    return (
      <div className="flex items-center gap-3 px-2 py-2 rounded-md bg-gray-50 dark:bg-gray-800/50">
        <Checkbox disabled />
        <Input
          ref={editInputRef}
          variant="ghost"
          value={editText}
          onChange={(e) => onEditTextChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onEditSave()
            else if (e.key === 'Escape') onEditCancel()
          }}
          className="flex-1"
        />
        <button
          onClick={onEditSave}
          className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors notion-hover cursor-pointer"
          title="Save"
        >
          <Plus className="w-4 h-4 rotate-45" />
        </button>
      </div>
    )
  }

  return (
    <div className="relative group flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors notion-hover">
      {/* Edit/Delete buttons */}
      <div className="absolute -top-1 -right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEditStart()
          }}
          className="w-5 h-5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400 rounded flex items-center justify-center transition-colors notion-hover cursor-pointer"
          title="Edit task"
        >
          <Edit2 className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="w-5 h-5 bg-gray-100 hover:bg-red-100 dark:bg-gray-700 dark:hover:bg-red-900/20 text-gray-600 hover:text-red-600 dark:text-gray-400 rounded flex items-center justify-center transition-colors notion-hover cursor-pointer"
          title="Delete task"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Task content */}
      <div 
        onClick={onToggle}
        className="flex items-center gap-3 flex-1 cursor-pointer"
      >
        <Checkbox
          checked={task.completed}
          onCheckedChange={onToggle}
        />
        <span 
          className={cn(
            "text-gray-900 dark:text-gray-100 transition-all duration-200",
            task.completed && "text-gray-400 dark:text-gray-500 line-through"
          )}
        >
          {task.title}
        </span>
      </div>
    </div>
  )
}

interface AddTaskFormProps {
  newTask: { title: string }
  onNewTaskChange: (task: { title: string }) => void
  onAddTask: () => void
  onCancel: () => void
}

function AddTaskForm({ newTask, onNewTaskChange, onAddTask, onCancel }: AddTaskFormProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className="flex items-center gap-3 px-2 py-2 rounded-md bg-gray-50 dark:bg-gray-800/50">
      <Checkbox disabled />
      <Input
        ref={inputRef}
        variant="ghost"
        placeholder="Add a task"
        value={newTask.title}
        onChange={(e) => onNewTaskChange({ title: e.target.value })}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onAddTask()
          else if (e.key === 'Escape') onCancel()
        }}
        onBlur={() => {
          if (!newTask.title.trim()) onCancel()
        }}
        className="flex-1"
      />
      {newTask.title.trim() && (
        <button
          onClick={onAddTask}
          className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors notion-hover cursor-pointer"
          title="Add Task"
        >
          <Plus className="w-4 h-4 rotate-45" />
        </button>
      )}
    </div>
  )
}

export function TaskListNew({ tasks, isLoading, onTaskToggle, onAddTask, onEditTask, onDeleteTask }: TaskListProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [newTask, setNewTask] = useState({
    title: ''
  })
  const [editTask, setEditTask] = useState({
    title: ''
  })

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      onAddTask({
        title: newTask.title
      })
      setNewTask({ title: '' })
      setShowAddForm(false)
    }
  }

  const handleEditStart = (task: Task) => {
    setEditingTaskId(task.id)
    setEditTask({
      title: task.title
    })
  }

  const handleEditSave = () => {
    if (editingTaskId && editTask.title.trim()) {
      if (onEditTask) {
        onEditTask(editingTaskId, {
          title: editTask.title
        })
      }
      setEditingTaskId(null)
      setEditTask({ title: '' })
    }
  }

  const handleEditCancel = () => {
    setEditingTaskId(null)
    setEditTask({ title: '' })
  }

  const handleDelete = (taskId: string) => {
    if (onDeleteTask) {
      onDeleteTask(taskId)
    }
  }

  // Calculate progress
  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length

  if (isLoading) {
    return (
      <Card variant="glass">
        <CardTitle>Today's Actions</CardTitle>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 px-2 py-2">
              <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-1" />
            </div>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card variant="glass">
      <CardTitle>Today's Actions</CardTitle>
      
      {/* Progress Bar */}
      {totalTasks > 0 && (
        <div className="mb-6">
          <ProgressBar
            value={completedTasks}
            max={totalTasks}
            showLabel={true}
            label={`${completedTasks} of ${totalTasks} completed`}
          />
        </div>
      )}
      
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isEditing={editingTaskId === task.id}
            editText={editTask.title}
            onToggle={() => onTaskToggle(task.id)}
            onEditStart={() => handleEditStart(task)}
            onEditSave={handleEditSave}
            onEditCancel={handleEditCancel}
            onEditTextChange={(title) => setEditTask({ title })}
            onDelete={() => handleDelete(task.id)}
          />
        ))}
      </div>

      {/* Add Task Section */}
      <div className="mt-4">
        {!showAddForm ? (
          <Button
            variant="ghost"
            onClick={() => setShowAddForm(true)}
            className="w-full justify-start gap-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
          >
            <Plus className="w-4 h-4" />
            <span>Add a task</span>
          </Button>
        ) : (
          <AddTaskForm
            newTask={newTask}
            onNewTaskChange={setNewTask}
            onAddTask={handleAddTask}
            onCancel={() => {
              setShowAddForm(false)
              setNewTask({ title: '' })
            }}
          />
        )}
      </div>
    </Card>
  )
}
