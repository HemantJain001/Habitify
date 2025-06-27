'use client'

import { useState } from 'react'
import { X, ChevronUp, ChevronDown, Plus, Edit2, Check, Calendar, Star } from 'lucide-react'
import { cn, type IdentityStats, identityConfig, mockPowerSystemTodos, type PowerSystemTodo, type ViewPeriod } from '@/lib/utils'

interface PowerSystemModalProps {
  isOpen: boolean
  onClose: () => void
  brain: IdentityStats
  muscle: IdentityStats
  money: IdentityStats
}

export function PowerSystemModal({ isOpen, onClose, brain, muscle, money }: PowerSystemModalProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [selectedTab, setSelectedTab] = useState<'overview' | 'goals'>('overview')
  const [viewPeriod, setViewPeriod] = useState<ViewPeriod>('weekly')
  const [todos, setTodos] = useState<PowerSystemTodo[]>(mockPowerSystemTodos)
  const [showAddTodo, setShowAddTodo] = useState<string | null>(null)
  const [editingTodo, setEditingTodo] = useState<PowerSystemTodo | null>(null)

  const toggleCollapse = (identity: string) => {
    setCollapsed(prev => ({ ...prev, [identity]: !prev[identity] }))
  }

  const identities = [
    { key: 'brain', data: brain },
    { key: 'muscle', data: muscle },
    { key: 'money', data: money }
  ] as const

  const getTodosForCategory = (identity: string, category: string) => {
    return todos.filter(todo => todo.identity === identity && todo.category === category && todo.isActive)
  }

  const isCompletedToday = (todo: PowerSystemTodo) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return todo.completedDates.some(date => {
      const completedDate = new Date(date)
      completedDate.setHours(0, 0, 0, 0)
      return completedDate.getTime() === today.getTime()
    })
  }

  const handleToggleComplete = (todoId: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    setTodos(prev => prev.map(todo => {
      if (todo.id === todoId) {
        const isAlreadyCompleted = isCompletedToday(todo)
        let newCompletedDates = [...todo.completedDates]
        
        if (isAlreadyCompleted) {
          // Remove today's completion
          newCompletedDates = newCompletedDates.filter(date => {
            const completedDate = new Date(date)
            completedDate.setHours(0, 0, 0, 0)
            return completedDate.getTime() !== today.getTime()
          })
        } else {
          // Add today's completion
          newCompletedDates.push(today)
        }
        
        return {
          ...todo,
          completedDates: newCompletedDates,
          lastCompletedDate: isAlreadyCompleted ? todo.lastCompletedDate : today,
          updatedAt: new Date()
        }
      }
      return todo
    }))
  }

  const getStatForPeriod = (data: IdentityStats) => {
    switch (viewPeriod) {
      case 'daily':
        return data.today
      case 'weekly':
        return data.week
      case 'monthly':
        return data.month
      default:
        return data.week
    }
  }

  const getPeriodLabel = () => {
    switch (viewPeriod) {
      case 'daily':
        return 'Today'
      case 'weekly':
        return 'This Week'
      case 'monthly':
        return 'This Month'
      default:
        return 'This Week'
    }
  }

  const handleAddTodo = (identity: string, category: string, text: string, description: string, xp: number) => {
    const newTodo: PowerSystemTodo = {
      id: `${identity}-${category}-${Date.now()}`,
      text,
      description,
      xp,
      identity: identity as 'brain' | 'muscle' | 'money',
      category,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedDates: []
    }
    setTodos(prev => [...prev, newTodo])
    setShowAddTodo(null)
  }

  const handleEditTodo = (updatedTodo: PowerSystemTodo) => {
    setTodos(prev => prev.map(todo => 
      todo.id === updatedTodo.id 
        ? { ...updatedTodo, updatedAt: new Date() }
        : todo
    ))
    setEditingTodo(null)
  }

  const handleDeleteTodo = (todoId: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === todoId 
        ? { ...todo, isActive: false, updatedAt: new Date() }
        : todo
    ))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="glass backdrop-blur-xl rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/20 dark:border-gray-800/30">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-gray-800/30 bg-white/50 dark:bg-gray-900/50">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Power System
            </h2>
            <div className="flex bg-white/80 dark:bg-gray-800/80 rounded-lg p-1">
              <button
                onClick={() => setSelectedTab('overview')}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  selectedTab === 'overview' 
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" 
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                )}
              >
                Overview
              </button>
              <button
                onClick={() => setSelectedTab('goals')}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  selectedTab === 'goals' 
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" 
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                )}
              >
                Goals
              </button>
            </div>
            {selectedTab === 'overview' && (
              <div className="flex bg-white/80 dark:bg-gray-800/80 rounded-lg p-1">
                <button
                  onClick={() => setViewPeriod('daily')}
                  className={cn(
                    "px-3 py-1 rounded text-xs font-medium transition-all duration-200",
                    viewPeriod === 'daily' 
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" 
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  )}
                >
                  Daily
                </button>
                <button
                  onClick={() => setViewPeriod('weekly')}
                  className={cn(
                    "px-3 py-1 rounded text-xs font-medium transition-all duration-200",
                    viewPeriod === 'weekly' 
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" 
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  )}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setViewPeriod('monthly')}
                  className={cn(
                    "px-3 py-1 rounded text-xs font-medium transition-all duration-200",
                    viewPeriod === 'monthly' 
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" 
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  )}
                >
                  Monthly
                </button>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/80 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200 notion-hover"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {identities.map(({ key, data }) => {
                const config = identityConfig[key]
                const isCollapsed = collapsed[key]
                
                return (
                  <div 
                    key={key}
                    className="glass backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 dark:border-gray-800/30 notion-hover"
                  >
                    {/* Header */}
                    <button
                      onClick={() => toggleCollapse(key)}
                      className="w-full flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/30 hover:bg-white/70 dark:hover:bg-gray-800/50 transition-all duration-200 notion-hover"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{config.icon}</span>
                        <div className="text-left">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {config.label}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {getStatForPeriod(data)} XP {getPeriodLabel().toLowerCase()}
                          </p>
                        </div>
                      </div>
                      
                      {isCollapsed ? (
                        <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      )}
                    </button>

                    {/* Content */}
                    {!isCollapsed && (
                      <div className="p-6 bg-white/30 dark:bg-gray-900/30 space-y-4">
                        {/* Simplified Stats */}
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Performance</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">{getPeriodLabel()}</span>
                                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                  {getStatForPeriod(data)} XP
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {data.progress}%
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Goals</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Active Goals</span>
                                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                  {todos.filter(todo => todo.identity === key && todo.isActive).length}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Completed Today</span>
                                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                  {todos.filter(todo => todo.identity === key && todo.isActive && isCompletedToday(todo)).length}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Weekly Progress</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {data.progress}%
                            </span>
                          </div>
                          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                key === 'brain' ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 
                                key === 'muscle' ? 'bg-gradient-to-r from-green-500 to-green-600' : 
                                'bg-gradient-to-r from-yellow-500 to-yellow-600'
                              )}
                              style={{ width: `${data.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {selectedTab === 'goals' && (
            <div className="space-y-6">
              {identities.map(({ key, data }) => {
                const config = identityConfig[key]
                const isCollapsed = collapsed[key]
                
                return (
                  <div 
                    key={key}
                    className="glass backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 dark:border-gray-800/30 notion-hover"
                  >
                    {/* Header */}
                    <button
                      onClick={() => toggleCollapse(key)}
                      className="w-full flex items-center justify-between p-4 bg-white/50 dark:bg-gray-800/30 hover:bg-white/70 dark:hover:bg-gray-800/50 transition-all duration-200 notion-hover"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{config.icon}</span>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {config.label} Goals
                        </h3>
                      </div>
                      
                      {isCollapsed ? (
                        <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      )}
                    </button>

                    {/* Categories */}
                    {!isCollapsed && (
                      <div className="p-6 bg-white/30 dark:bg-gray-900/30 space-y-4">
                        {config.categories.map((category) => {
                          const categoryTodos = getTodosForCategory(key, category.id)
                          
                          return (
                            <div key={category.id} className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                                    {category.name}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {category.description}
                                  </p>
                                </div>
                                <button
                                  onClick={() => setShowAddTodo(`${key}-${category.id}`)}
                                  className="p-2 hover:bg-white/60 dark:hover:bg-gray-800/40 rounded-lg transition-all duration-200 notion-hover"
                                  title="Add new goal"
                                >
                                  <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </button>
                              </div>
                              
                              {/* Todos */}
                              <div className="space-y-2">
                                {categoryTodos.map((todo) => {
                                  const completedToday = isCompletedToday(todo)
                                  
                                  return (
                                    <div key={todo.id} className={cn(
                                      "glass backdrop-blur-sm rounded-lg p-4 border border-white/20 dark:border-gray-800/30 goal-item",
                                      completedToday && "completed"
                                    )}>
                                      <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3 flex-1">
                                          <button
                                            onClick={() => handleToggleComplete(todo.id)}
                                            className={cn(
                                              "p-1 rounded-full transition-all duration-200 mt-0.5 checkmark-button",
                                              completedToday 
                                                ? "bg-green-500 text-white shadow-lg" 
                                                : "border border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                                            )}
                                            title={completedToday ? "Mark as incomplete" : "Mark as complete for today"}
                                          >
                                            <Check className={cn(
                                              "w-3 h-3 transition-all duration-200",
                                              completedToday ? "opacity-100 scale-100" : "opacity-0 scale-75"
                                            )} />
                                          </button>
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                              <h5 className={cn(
                                                "font-medium transition-all duration-200",
                                                completedToday 
                                                  ? "text-green-700 dark:text-green-400 line-through" 
                                                  : "text-gray-900 dark:text-gray-100"
                                              )}>
                                                {todo.text}
                                              </h5>
                                              <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                                                {todo.xp} XP
                                              </span>
                                            </div>
                                            {todo.description && (
                                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {todo.description}
                                              </p>
                                            )}
                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                              <span>Completed {todo.completedDates.length} times</span>
                                              {completedToday && (
                                                <span className="text-green-600 dark:text-green-400 font-medium">
                                                  ✓ Done today
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-1 ml-2">
                                          <button
                                            onClick={() => setEditingTodo(todo)}
                                            className="p-1 hover:bg-white/60 dark:hover:bg-gray-800/40 rounded transition-all duration-200"
                                            title="Edit goal"
                                          >
                                            <Edit2 className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteTodo(todo.id)}
                                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-all duration-200"
                                            title="Remove goal"
                                          >
                                            <X className="w-3 h-3 text-red-500" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}
                                
                                {categoryTodos.length === 0 && (
                                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No goals set for this category yet</p>
                                    <p className="text-xs">Click the + button to add your first goal</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Add Todo Modal */}
      {showAddTodo && <AddTodoModal 
        isOpen={!!showAddTodo}
        onClose={() => setShowAddTodo(null)}
        onSave={handleAddTodo}
        identity={showAddTodo.split('-')[0]}
        category={showAddTodo.split('-')[1]}
      />}
      
      {/* Edit Todo Modal */}
      {editingTodo && <EditTodoModal 
        isOpen={!!editingTodo}
        onClose={() => setEditingTodo(null)}
        onSave={handleEditTodo}
        todo={editingTodo}
      />}
    </div>
  )
}

// Add Todo Modal Component
function AddTodoModal({ 
  isOpen, 
  onClose, 
  onSave, 
  identity, 
  category 
}: {
  isOpen: boolean
  onClose: () => void
  onSave: (identity: string, category: string, text: string, description: string, xp: number) => void
  identity: string
  category: string
}) {
  const [text, setText] = useState('')
  const [description, setDescription] = useState('')
  const [xp, setXp] = useState(25)

  const handleSave = () => {
    if (text.trim()) {
      onSave(identity, category, text.trim(), description.trim(), xp)
      setText('')
      setDescription('')
      setXp(25)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
      <div className="glass backdrop-blur-xl rounded-xl shadow-xl max-w-md w-full p-6 border border-white/20 dark:border-gray-800/30">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Add New Goal
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Goal Title
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100"
              placeholder="Enter your goal..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 h-20"
              placeholder="Describe your goal..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              XP Value
            </label>
            <input
              type="number"
              value={xp}
              onChange={(e) => setXp(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100"
              min="1"
              max="200"
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!text.trim()}
            className="flex-1 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Add Goal
          </button>
        </div>
      </div>
    </div>
  )
}

// Edit Todo Modal Component
function EditTodoModal({ 
  isOpen, 
  onClose, 
  onSave, 
  todo 
}: {
  isOpen: boolean
  onClose: () => void
  onSave: (todo: PowerSystemTodo) => void
  todo: PowerSystemTodo
}) {
  const [text, setText] = useState(todo.text)
  const [description, setDescription] = useState(todo.description || '')
  const [xp, setXp] = useState(todo.xp)

  const handleSave = () => {
    if (text.trim()) {
      onSave({
        ...todo,
        text: text.trim(),
        description: description.trim(),
        xp
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
      <div className="glass backdrop-blur-xl rounded-xl shadow-xl max-w-md w-full p-6 border border-white/20 dark:border-gray-800/30">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Edit Goal
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Goal Title
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 h-20"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              XP Value
            </label>
            <input
              type="number"
              value={xp}
              onChange={(e) => setXp(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100"
              min="1"
              max="200"
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!text.trim()}
            className="flex-1 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
