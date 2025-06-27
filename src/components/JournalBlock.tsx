'use client'

import { useState } from 'react'
import { Brain, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function JournalBlock() {
  const [mood, setMood] = useState(4)
  const [reflection, setReflection] = useState('')

  const moodLabels = {
    1: 'Terrible',
    2: 'Bad', 
    3: 'Okay',
    4: 'Good',
    5: 'Excellent'
  }

  const moodEmojis = {
    1: '😔',
    2: '😕',
    3: '😐',
    4: '😊',
    5: '😄'
  }

  return (
    <div className="glass backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-800/30 shadow-lg">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
        Daily Reflection
      </h2>
      
      <div className="space-y-6">
        {/* Mood Slider */}
        <div className="space-y-3">
          <label className="block text-sm text-gray-600 dark:text-gray-400">
            Today's Mood
          </label>
          
          <div className="space-y-3">
            {/* Mood Slider */}
            <div className="flex items-center gap-3">
              <span className="text-lg">😔</span>
              <div className="flex-1 relative">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={mood}
                  onChange={(e) => setMood(parseInt(e.target.value))}
                  className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
              <span className="text-lg">😄</span>
            </div>
            
            {/* Current Mood Display */}
            <div className="text-center py-2">
              <div className="text-xl mb-1">{moodEmojis[mood as keyof typeof moodEmojis]}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Feeling {moodLabels[mood as keyof typeof moodLabels]}
              </div>
            </div>
          </div>
        </div>

        {/* Reflection Input */}
        <div className="space-y-2">
          <label className="block text-sm text-gray-600 dark:text-gray-400">
            Reflection
          </label>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="What went well today? What could be improved?"
            rows={3}
            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm notion-input"
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors notion-hover">
            <Brain className="w-4 h-4" />
            Problem Solving Template
          </button>
          
          <button className="w-full flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 px-3 py-2 rounded-md text-sm font-medium transition-colors notion-hover">
            <User className="w-4 h-4" />
            New Me Tracker
          </button>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  )
}
