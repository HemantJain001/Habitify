'use client'

import { useState } from 'react'
import { X, Plus, Trash2, Target, Calendar, Star, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NewMeModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Habit {
  id: string
  name: string
  category: 'brain' | 'muscle' | 'money'
  frequency: 'daily' | 'weekly'
  target: number
  current: number
  streak: number
}

interface Goal {
  id: string
  title: string
  category: 'brain' | 'muscle' | 'money'
  deadline: string
  progress: number
  milestones: string[]
}

export function NewMeModal({ isOpen, onClose }: NewMeModalProps) {
  const [activeTab, setActiveTab] = useState<'habits' | 'goals'>('habits')
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Read technical articles',
      category: 'brain',
      frequency: 'daily',
      target: 1,
      current: 0,
      streak: 5
    },
    {
      id: '2',
      name: 'Workout sessions',
      category: 'muscle',
      frequency: 'daily',
      target: 1,
      current: 1,
      streak: 7
    },
    {
      id: '3',
      name: 'Review finances',
      category: 'money',
      frequency: 'weekly',
      target: 1,
      current: 0,
      streak: 2
    }
  ])

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Complete Full-Stack Development Course',
      category: 'brain',
      deadline: '2025-12-31',
      progress: 35,
      milestones: ['Finish React section', 'Build 3 projects', 'Deploy portfolio']
    },
    {
      id: '2',
      title: 'Run a Half Marathon',
      category: 'muscle',
      deadline: '2025-09-15',
      progress: 20,
      milestones: ['Run 5K consistently', 'Build up to 10K', 'Complete 21K']
    },
    {
      id: '3',
      title: 'Save $10,000 Emergency Fund',
      category: 'money',
      deadline: '2025-08-31',
      progress: 60,
      milestones: ['Save $5,000', 'Optimize expenses', 'Reach $10,000']
    }
  ])

  const [newHabit, setNewHabit] = useState({
    name: '',
    category: 'brain' as const,
    frequency: 'daily' as const,
    target: 1
  })

  const [newGoal, setNewGoal] = useState({
    title: '',
    category: 'brain' as const,
    deadline: '',
    milestones: ['']
  })

  const categoryConfig = {
    brain: { icon: '🧠', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    muscle: { icon: '💪', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
    money: { icon: '💰', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' }
  }

  const handleAddHabit = () => {
    if (newHabit.name.trim()) {
      const habit: Habit = {
        id: Date.now().toString(),
        name: newHabit.name,
        category: newHabit.category,
        frequency: newHabit.frequency,
        target: newHabit.target,
        current: 0,
        streak: 0
      }
      setHabits([...habits, habit])
      setNewHabit({ name: '', category: 'brain', frequency: 'daily', target: 1 })
    }
  }

  const handleAddGoal = () => {
    if (newGoal.title.trim() && newGoal.deadline) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        category: newGoal.category,
        deadline: newGoal.deadline,
        progress: 0,
        milestones: newGoal.milestones.filter(m => m.trim() !== '')
      }
      setGoals([...goals, goal])
      setNewGoal({ title: '', category: 'brain', deadline: '', milestones: [''] })
    }
  }

  const handleDeleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id))
  }

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id))
  }

  const handleHabitProgress = (id: string, increment: boolean) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        const newCurrent = increment 
          ? Math.min(habit.current + 1, habit.target)
          : Math.max(habit.current - 1, 0)
        
        return {
          ...habit,
          current: newCurrent,
          streak: newCurrent === habit.target ? habit.streak + 1 : habit.streak
        }
      }
      return habit
    }))
  }

  const addMilestone = () => {
    setNewGoal({
      ...newGoal,
      milestones: [...newGoal.milestones, '']
    })
  }

  const updateMilestone = (index: number, value: string) => {
    const updated = [...newGoal.milestones]
    updated[index] = value
    setNewGoal({ ...newGoal, milestones: updated })
  }

  const removeMilestone = (index: number) => {
    setNewGoal({
      ...newGoal,
      milestones: newGoal.milestones.filter((_, i) => i !== index)
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              New Me Tracker
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Track your habits and long-term goals across all three identities
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('habits')}
            className={cn(
              "flex-1 px-6 py-3 text-sm font-medium transition-colors",
              activeTab === 'habits'
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Daily Habits
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={cn(
              "flex-1 px-6 py-3 text-sm font-medium transition-colors",
              activeTab === 'goals'
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            <Star className="w-4 h-4 inline mr-2" />
            Long-term Goals
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'habits' && (
            <div className="space-y-6">
              {/* Add New Habit */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Add New Habit
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="Habit name"
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={newHabit.category}
                    onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value as any })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="brain">🧠 Intelligent</option>
                    <option value="muscle">💪 Muscular</option>
                    <option value="money">💰 Rich</option>
                  </select>
                  <select
                    value={newHabit.frequency}
                    onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value as any })}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                  <button
                    onClick={handleAddHabit}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </button>
                </div>
              </div>

              {/* Habits List */}
              <div className="space-y-4">
                {habits.map((habit) => (
                  <div key={habit.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{categoryConfig[habit.category].icon}</span>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {habit.name}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <span className="capitalize">{habit.frequency}</span>
                            <span>Target: {habit.target}</span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {habit.streak} day streak
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleHabitProgress(habit.id, false)}
                            disabled={habit.current === 0}
                            className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-medium text-gray-900 dark:text-white">
                            {habit.current}/{habit.target}
                          </span>
                          <button
                            onClick={() => handleHabitProgress(habit.id, true)}
                            disabled={habit.current >= habit.target}
                            className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleDeleteHabit(habit.id)}
                          className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={cn(
                            "h-2 rounded-full transition-all",
                            habit.current >= habit.target ? "bg-green-500" : "bg-blue-500"
                          )}
                          style={{ width: `${(habit.current / habit.target) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="space-y-6">
              {/* Add New Goal */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Add New Goal
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Goal title"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as any })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="brain">🧠 Intelligent</option>
                      <option value="muscle">💪 Muscular</option>
                      <option value="money">💰 Rich</option>
                    </select>
                    <input
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Milestones
                    </label>
                    {newGoal.milestones.map((milestone, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder={`Milestone ${index + 1}`}
                          value={milestone}
                          onChange={(e) => updateMilestone(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {newGoal.milestones.length > 1 && (
                          <button
                            onClick={() => removeMilestone(index)}
                            className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addMilestone}
                      className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      + Add milestone
                    </button>
                  </div>
                  
                  <button
                    onClick={handleAddGoal}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Goal
                  </button>
                </div>
              </div>

              {/* Goals List */}
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl mt-1">{categoryConfig[goal.category].icon}</span>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {goal.title}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(goal.deadline).toLocaleDateString()}
                            </span>
                            <span>{goal.progress}% complete</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 bg-blue-500 rounded-full transition-all"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Milestones:
                      </h5>
                      <ul className="space-y-1">
                        {goal.milestones.map((milestone, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full" />
                            {milestone}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
