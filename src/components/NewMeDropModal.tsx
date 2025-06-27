'use client'

import { useState } from 'react'
import { X, Plus, Target, Brain, Dumbbell, DollarSign, Sparkles, Calendar, Award } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Common'

interface NewMeAction {
  id: string
  title: string
  description: string
  identity: 'brain' | 'muscle' | 'money'
  priority: 'low' | 'medium' | 'high'
  targetDate?: Date
  xpValue: number
  status: 'pending' | 'in-progress' | 'completed'
  createdDate: Date
}

interface NewMeDropModalProps {
  isOpen: boolean
  onClose: () => void
}

// Mock data for existing actions
const mockNewMeActions: NewMeAction[] = [
  {
    id: '1',
    title: 'Learn Advanced React Patterns',
    description: 'Master React patterns like render props, HOCs, and compound components',
    identity: 'brain',
    priority: 'high',
    targetDate: new Date('2024-02-01'),
    xpValue: 200,
    status: 'in-progress',
    createdDate: new Date('2024-01-10')
  },
  {
    id: '2',
    title: 'Complete 30-Day Gym Challenge',
    description: 'Consistent gym attendance for 30 days with progressive strength training',
    identity: 'muscle',
    priority: 'high',
    targetDate: new Date('2024-02-15'),
    xpValue: 300,
    status: 'in-progress',
    createdDate: new Date('2024-01-12')
  },
  {
    id: '3',
    title: 'Launch Side Project MVP',
    description: 'Build and launch minimum viable product for the new SaaS idea',
    identity: 'money',
    priority: 'medium',
    targetDate: new Date('2024-03-01'),
    xpValue: 500,
    status: 'pending',
    createdDate: new Date('2024-01-15')
  }
]

export function NewMeDropModal({ isOpen, onClose }: NewMeDropModalProps) {
  const [actions, setActions] = useState<NewMeAction[]>(mockNewMeActions)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAction, setNewAction] = useState({
    title: '',
    description: '',
    identity: 'brain' as const,
    priority: 'medium' as const,
    targetDate: '',
    xpValue: 100
  })

  if (!isOpen) return null

  const handleAddAction = () => {
    if (!newAction.title.trim() || !newAction.description.trim()) return

    const action: NewMeAction = {
      id: Date.now().toString(),
      title: newAction.title,
      description: newAction.description,
      identity: newAction.identity,
      priority: newAction.priority,
      targetDate: newAction.targetDate ? new Date(newAction.targetDate) : undefined,
      xpValue: newAction.xpValue,
      status: 'pending',
      createdDate: new Date()
    }

    setActions(prev => [...prev, action])
    setNewAction({
      title: '',
      description: '',
      identity: 'brain',
      priority: 'medium',
      targetDate: '',
      xpValue: 100
    })
    setShowAddForm(false)
  }

  const handleStatusChange = (actionId: string, newStatus: NewMeAction['status']) => {
    setActions(prev => prev.map(action => 
      action.id === actionId 
        ? { ...action, status: newStatus }
        : action
    ))
  }

  const getIdentityIcon = (identity: string) => {
    switch (identity) {
      case 'brain': return Brain
      case 'muscle': return Dumbbell
      case 'money': return DollarSign
      default: return Target
    }
  }

  const getIdentityColor = (identity: string) => {
    switch (identity) {
      case 'brain': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'muscle': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'money': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'pending': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const totalXP = actions.filter(a => a.status === 'completed').reduce((sum, action) => sum + action.xpValue, 0)
  const inProgress = actions.filter(a => a.status === 'in-progress').length
  const pending = actions.filter(a => a.status === 'pending').length

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#191919] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
              <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Track Yourself Drop
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Level up your identity with strategic actions
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {actions.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Actions
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {inProgress}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                In Progress
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {pending}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Pending
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {totalXP}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                XP Earned
              </div>
            </div>
          </div>
        </div>

        {/* Add New Action Button */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full"
            variant={showAddForm ? "secondary" : "primary"}
          >
            <Plus className="w-4 h-4 mr-2" />
            {showAddForm ? 'Cancel' : 'Add New Identity Action'}
          </Button>
        </div>

        {/* Add Action Form */}
        {showAddForm && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="Action title..."
                  value={newAction.title}
                  onChange={(e) => setNewAction(prev => ({ ...prev, title: e.target.value }))}
                />
                <select
                  value={newAction.identity}
                  onChange={(e) => setNewAction(prev => ({ ...prev, identity: e.target.value as any }))}
                  className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="brain">Brain Power</option>
                  <option value="muscle">Muscle Power</option>
                  <option value="money">Money Power</option>
                </select>
              </div>
              <textarea
                placeholder="Describe your action and why it will level up your identity..."
                value={newAction.description}
                onChange={(e) => setNewAction(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none"
                rows={3}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={newAction.priority}
                  onChange={(e) => setNewAction(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <Input
                  type="date"
                  value={newAction.targetDate}
                  onChange={(e) => setNewAction(prev => ({ ...prev, targetDate: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="XP Value"
                  value={newAction.xpValue}
                  onChange={(e) => setNewAction(prev => ({ ...prev, xpValue: parseInt(e.target.value) || 100 }))}
                  min="1"
                  max="1000"
                />
              </div>
              <Button onClick={handleAddAction} className="w-full">
                Create Action
              </Button>
            </div>
          </div>
        )}

        {/* Actions List */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {actions.map((action) => {
              const IdentityIcon = getIdentityIcon(action.identity)
              return (
                <Card key={action.id} className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <IdentityIcon className="w-4 h-4" />
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {action.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {action.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge className={getIdentityColor(action.identity)}>
                          {action.identity}
                        </Badge>
                        <Badge className={getPriorityColor(action.priority)}>
                          {action.priority}
                        </Badge>
                      </div>
                    </div>

                    {/* Status Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <select
                          value={action.status}
                          onChange={(e) => handleStatusChange(action.id, e.target.value as any)}
                          className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        <Badge className={getStatusColor(action.status)}>
                          {action.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                        {action.targetDate && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {action.targetDate.toLocaleDateString()}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                          <Award className="w-3 h-3" />
                          {action.xpValue} XP
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {actions.length === 0 && (
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                No identity actions yet. Create your first one!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
