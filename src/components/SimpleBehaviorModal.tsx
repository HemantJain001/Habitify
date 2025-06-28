'use client'

import { useState } from 'react'
import { X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface PersonalDataEntry {
  id: string
  title: string
  value: string
  date: Date
  createdAt: Date
  updatedAt: Date
}

interface SimpleBehaviorModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SimpleBehaviorModal({ isOpen, onClose }: SimpleBehaviorModalProps) {
  const [title, setTitle] = useState('')
  const [value, setValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!title.trim() || !value.trim()) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const entry: PersonalDataEntry = {
      id: Date.now().toString(),
      title: title.trim(),
      value: value.trim(),
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    console.log('New personal data entry:', entry)
    
    setTitle('')
    setValue('')
    setIsSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Track Yourself
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Record your progress
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full p-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Title Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Heading
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a heading for your entry"
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            maxLength={100}
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {title.length}/100 characters
          </div>
        </div>

        {/* Text Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Describe what you did or want to track"
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none"
            rows={4}
            maxLength={500}
          />
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {value.length}/500 characters
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!title.trim() || !value.trim() || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Save Entry
            </div>
          )}
        </Button>
      </Card>
    </div>
  )
}
