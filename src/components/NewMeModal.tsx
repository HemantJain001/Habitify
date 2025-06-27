'use client'

import { useState } from 'react'
import { X, Plus, Trash2, User, Brain, Target } from 'lucide-react'
import { cn, type PersonalDataPoint, mockPersonalDataPoints } from '@/lib/utils'

interface NewMeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewMeModal({ isOpen, onClose }: NewMeModalProps) {
  const [dataPoints, setDataPoints] = useState<PersonalDataPoint[]>(mockPersonalDataPoints)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newDataPoint, setNewDataPoint] = useState({
    title: '',
    value: '',
    category: 'identity' as PersonalDataPoint['category']
  })

  const categories = [
    { id: 'identity', name: 'Who I Am', icon: User, color: 'text-blue-600 dark:text-blue-400' },
    { id: 'skills', name: 'What I Do', icon: Brain, color: 'text-green-600 dark:text-green-400' },
    { id: 'goals', name: 'Where I Go', icon: Target, color: 'text-purple-600 dark:text-purple-400' }
  ]

  const handleAddDataPoint = () => {
    if (!newDataPoint.title.trim() || !newDataPoint.value.trim()) return

    const dataPoint: PersonalDataPoint = {
      id: `data-${Date.now()}`,
      title: newDataPoint.title,
      value: newDataPoint.value,
      category: newDataPoint.category,
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setDataPoints(prev => [...prev, dataPoint])
    setNewDataPoint({ title: '', value: '', category: 'identity' })
    setIsAddingNew(false)
  }

  const handleDeleteDataPoint = (id: string) => {
    setDataPoints(prev => prev.filter(dp => dp.id !== id))
  }

  const getCategoryInfo = (category: PersonalDataPoint['category']) => {
    return categories.find(cat => cat.id === category) || categories[0]
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#191919] rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              New Me
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Document yourself in simple data points
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          {/* Add New Button */}
          {!isAddingNew && (
            <div className="mb-6">
              <button
                onClick={() => setIsAddingNew(true)}
                className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add New Data Point</span>
              </button>
            </div>
          )}

          {/* Add New Form */}
          {isAddingNew && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <div>
                  <div className="grid grid-cols-3 gap-3">
                    {categories.map((category) => {
                      const Icon = category.icon
                      return (
                        <button
                          key={category.id}
                          onClick={() => setNewDataPoint(prev => ({ ...prev, category: category.id as PersonalDataPoint['category'] }))}
                          className={cn(
                            "p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2",
                            newDataPoint.category === category.id
                              ? `border-current ${category.color} bg-gray-50 dark:bg-gray-800`
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                          )}
                        >
                          <Icon className={cn("w-5 h-5", category.color)} />
                          <span className={cn("text-xs font-medium", category.color)}>
                            {category.name}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <input
                  type="text"
                  value={newDataPoint.title}
                  onChange={(e) => setNewDataPoint(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Title"
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <textarea
                  value={newDataPoint.value}
                  onChange={(e) => setNewDataPoint(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="Description"
                  rows={2}
                  className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />

                <div className="flex gap-3">
                  <button
                    onClick={handleAddDataPoint}
                    disabled={!newDataPoint.title.trim() || !newDataPoint.value.trim()}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingNew(false)
                      setNewDataPoint({ title: '', value: '', category: 'identity' })
                    }}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Data Points List */}
          <div className="space-y-4">
            {dataPoints.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No data points yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Start documenting yourself by adding your first data point.
                </p>
              </div>
            ) : (
              dataPoints.map((dataPoint) => {
                const categoryInfo = getCategoryInfo(dataPoint.category)
                const Icon = categoryInfo.icon
                return (
                  <div
                    key={dataPoint.id}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                          <Icon className={cn("w-4 h-4", categoryInfo.color)} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {dataPoint.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span className={cn("px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800", categoryInfo.color)}>
                              {categoryInfo.name}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteDataPoint(dataPoint.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {dataPoint.value}
                    </p>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {dataPoints.length} data point{dataPoints.length !== 1 ? 's' : ''} documented
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
