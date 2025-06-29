'use client'

import { useState, useRef, useEffect } from 'react'
import { X, AlertCircle, Brain, Target, Heart, Power, ChevronRight, ChevronLeft, Save, Clock, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCreateProblem } from '@/lib/hooks'

interface ProblemSolvingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ProblemSolvingModal({ isOpen, onClose }: ProblemSolvingModalProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const createProblem = useCreateProblem()
  
  // Form state using database field names
  const [problemBehavior, setProblemBehavior] = useState('')
  const [triggerPattern, setTriggerPattern] = useState('')
  const [isDaily, setIsDaily] = useState(false)
  const [preventiveStrategy, setPreventiveStrategy] = useState('')
  const [wrongPathReaction, setWrongPathReaction] = useState('')
  const [longTermConsequence, setLongTermConsequence] = useState('')
  const [preferredBehavior, setPreferredBehavior] = useState('')
  const [positiveOutcome, setPositiveOutcome] = useState('')
  const [problemCategory, setProblemCategory] = useState('general')
  const [emotionalImpact, setEmotionalImpact] = useState(50)
  const [copingStrategy, setCopingStrategy] = useState('')
  const [controlSource, setControlSource] = useState('')
  const [actionablePower, setActionablePower] = useState('')
  const [longTermSolution, setLongTermSolution] = useState('')

  const sections = [
    {
      title: 'Pattern Analysis',
      icon: <Brain className="w-5 h-5" />,
      color: 'text-purple-600 dark:text-purple-400',
      description: 'Understanding the problem pattern and triggers'
    },
    {
      title: 'Solution Development', 
      icon: <Target className="w-5 h-5" />,
      color: 'text-blue-600 dark:text-blue-400',
      description: 'Developing actionable solutions and alternatives'
    },
    {
      title: 'Emotional Impact',
      icon: <Heart className="w-5 h-5" />,
      color: 'text-red-600 dark:text-red-400',
      description: 'Understanding emotional effects and coping strategies'
    },
    {
      title: 'Power & Control',
      icon: <Power className="w-5 h-5" />,
      color: 'text-green-600 dark:text-green-400',
      description: 'Assessing control and long-term solutions'
    }
  ]

  const handleSave = async () => {
    if (!problemBehavior.trim() || !triggerPattern.trim()) {
      alert('Problem behavior and trigger pattern are required')
      return
    }

    try {
      await createProblem.mutateAsync({
        problemBehavior,
        triggerPattern,
        isDaily,
        preventiveStrategy: preventiveStrategy || undefined,
        wrongPathReaction,
        longTermConsequence,
        preferredBehavior,
        positiveOutcome,
        problemCategory,
        emotionalImpact,
        copingStrategy: copingStrategy || undefined,
        controlSource,
        actionablePower: actionablePower || undefined,
        longTermSolution: longTermSolution || undefined,
      })
      
      resetForm()
      onClose()
    } catch (error) {
      console.error('Failed to save problem:', error)
      alert('Failed to save problem. Please try again.')
    }
  }

  const resetForm = () => {
    setCurrentSection(0)
    setProblemBehavior('')
    setTriggerPattern('')
    setIsDaily(false)
    setPreventiveStrategy('')
    setWrongPathReaction('')
    setLongTermConsequence('')
    setPreferredBehavior('')
    setPositiveOutcome('')
    setProblemCategory('general')
    setEmotionalImpact(50)
    setCopingStrategy('')
    setControlSource('')
    setActionablePower('')
    setLongTermSolution('')
  }

  const handleAutoSaveAndClose = () => {
    // Auto-save if there's meaningful content
    if (problemBehavior.trim() || triggerPattern.trim()) {
      handleSave()
    } else {
      resetForm()
      onClose()
    }
  }

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      if (e.key === 'Escape') {
        handleAutoSaveAndClose()
      } else if (e.key === 'ArrowRight' && e.ctrlKey) {
        nextSection()
      } else if (e.key === 'ArrowLeft' && e.ctrlKey) {
        prevSection()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentSection])

  if (!isOpen) return null

  const renderSectionContent = () => {
    switch (currentSection) {
      case 0: // Pattern Analysis
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                Understanding the Problem Pattern
              </h3>
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                Let's identify what's really happening and what triggers this behavior.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What wrong thing am I doing?
              </label>
              <textarea
                value={problemBehavior}
                onChange={(e) => setProblemBehavior(e.target.value)}
                placeholder="Describe the specific behavior or action that's problematic..."
                rows={3}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What triggers this behavior?
              </label>
              <textarea
                value={triggerPattern}
                onChange={(e) => setTriggerPattern(e.target.value)}
                placeholder="What situations, emotions, or thoughts lead to this behavior?"
                rows={3}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isDaily"
                checked={isDaily}
                onChange={(e) => setIsDaily(e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="isDaily" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                This happens daily
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                How can I avoid the trigger?
              </label>
              <textarea
                value={preventiveStrategy}
                onChange={(e) => setPreventiveStrategy(e.target.value)}
                placeholder="What preventive measures can you take to avoid the trigger?"
                rows={3}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Once I've started, how do I stop?
              </label>
              <textarea
                value={wrongPathReaction}
                onChange={(e) => setWrongPathReaction(e.target.value)}
                placeholder="What strategies can help you break the pattern once it's begun?"
                rows={3}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What are the long-term consequences of this behavior?
              </label>
              <textarea
                value={longTermConsequence}
                onChange={(e) => setLongTermConsequence(e.target.value)}
                placeholder="How does this behavior affect your goals, relationships, and well-being over time?"
                rows={3}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        )

      case 1: // Solution Development
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Developing Better Alternatives
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Let's create actionable solutions and positive alternatives to replace the problematic behavior.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What should I do instead?
              </label>
              <textarea
                value={preferredBehavior}
                onChange={(e) => setPreferredBehavior(e.target.value)}
                placeholder="What specific positive behaviors can replace the problematic ones?"
                rows={4}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What are the benefits of changing this behavior?
              </label>
              <textarea
                value={positiveOutcome}
                onChange={(e) => setPositiveOutcome(e.target.value)}
                placeholder="How will changing this behavior improve your life? What will you gain?"
                rows={4}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        )

      case 2: // Emotional Impact
        return (
          <div className="space-y-6">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                Understanding Emotional Effects
              </h3>
              <p className="text-red-700 dark:text-red-300 text-sm">
                Let's explore how this problem affects you emotionally and develop coping strategies.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What is the nature of this problem?
              </label>
              <select
                value={problemCategory}
                onChange={(e) => setProblemCategory(e.target.value)}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="general">General</option>
                <option value="Emotional/Behavioral">Emotional/Behavioral</option>
                <option value="Practical/External">Practical/External</option>
                <option value="Relationship">Relationship</option>
                <option value="Career/Professional">Career/Professional</option>
                <option value="Health/Wellness">Health/Wellness</option>
                <option value="Financial">Financial</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Emotional Impact Level: {emotionalImpact}%
              </label>
              <div className="px-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={emotionalImpact}
                  onChange={(e) => setEmotionalImpact(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>No impact</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                How do you cope with the emotional impact?
              </label>
              <textarea
                value={copingStrategy}
                onChange={(e) => setCopingStrategy(e.target.value)}
                placeholder="What techniques, habits, or approaches help you manage the emotional impact?"
                rows={4}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        )

      case 3: // Power & Control
        return (
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                Assessing Your Control
              </h3>
              <p className="text-green-700 dark:text-green-300 text-sm">
                Understanding what you can control and creating long-term solutions.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What specifically can you change or control?
              </label>
              <textarea
                value={controlSource}
                onChange={(e) => setControlSource(e.target.value)}
                placeholder="List the specific aspects of this situation that are within your control..."
                rows={4}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What actionable power do you have?
              </label>
              <textarea
                value={actionablePower}
                onChange={(e) => setActionablePower(e.target.value)}
                placeholder="Describe the specific actions you can take to address this problem..."
                rows={4}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What's your long-term solution?
              </label>
              <textarea
                value={longTermSolution}
                onChange={(e) => setLongTermSolution(e.target.value)}
                placeholder="Describe a comprehensive plan to address this problem permanently..."
                rows={4}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleAutoSaveAndClose()
        }
      }}
    >
      <div className="bg-white dark:bg-[#191919] rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧩</span>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Problem Solving Framework
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {sections[currentSection].description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {createProblem.isPending && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </div>
            )}
            <button
              onClick={handleAutoSaveAndClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Section Navigation */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={cn("p-2 rounded-lg", sections[currentSection].color)}>
                {sections[currentSection].icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  {sections[currentSection].title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {currentSection + 1} of {sections.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prevSection}
                disabled={currentSection === 0}
                className="p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSection}
                disabled={currentSection === sections.length - 1}
                className="p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          {/* Section Content */}
          {renderSectionContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Use <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Ctrl + ←/→</kbd> to navigate sections
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                resetForm()
                onClose()
              }}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!problemBehavior.trim() || !triggerPattern.trim() || createProblem.isPending}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Solution
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
