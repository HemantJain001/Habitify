'use client'

import { useState } from 'react'
import { X, Brain, Target, Lightbulb, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProblemSolvingModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ProblemStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
}

export function ProblemSolvingModal({ isOpen, onClose }: ProblemSolvingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [problemStatement, setProblemStatement] = useState('')
  const [rootCauses, setRootCauses] = useState(['', '', ''])
  const [solutions, setSolutions] = useState(['', '', ''])
  const [actionPlan, setActionPlan] = useState('')

  const steps: ProblemStep[] = [
    {
      id: 'define',
      title: 'Define the Problem',
      description: 'Clearly articulate what exactly you\'re trying to solve',
      icon: <Target className="w-5 h-5" />,
      completed: problemStatement.trim().length > 0
    },
    {
      id: 'analyze',
      title: 'Root Cause Analysis',
      description: 'Identify the underlying causes of the problem',
      icon: <Brain className="w-5 h-5" />,
      completed: rootCauses.some(cause => cause.trim().length > 0)
    },
    {
      id: 'solutions',
      title: 'Generate Solutions',
      description: 'Brainstorm multiple approaches to solve the problem',
      icon: <Lightbulb className="w-5 h-5" />,
      completed: solutions.some(solution => solution.trim().length > 0)
    },
    {
      id: 'plan',
      title: 'Action Plan',
      description: 'Create a concrete plan to implement your solution',
      icon: <CheckCircle className="w-5 h-5" />,
      completed: actionPlan.trim().length > 0
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleRootCauseChange = (index: number, value: string) => {
    const newCauses = [...rootCauses]
    newCauses[index] = value
    setRootCauses(newCauses)
  }

  const handleSolutionChange = (index: number, value: string) => {
    const newSolutions = [...solutions]
    newSolutions[index] = value
    setSolutions(newSolutions)
  }

  const resetForm = () => {
    setCurrentStep(0)
    setProblemStatement('')
    setRootCauses(['', '', ''])
    setSolutions(['', '', ''])
    setActionPlan('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Problem Solving Template
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                    index === currentStep
                      ? "bg-blue-500 border-blue-500 text-white"
                      : step.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400"
                  )}
                >
                  {step.completed && index !== currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-8 h-0.5 mx-2",
                      step.completed ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {currentStep === 0 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  What problem are you trying to solve?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Be specific and concrete. Instead of "I'm not productive," try "I struggle to complete my coding projects on time."
                </p>
                <textarea
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  placeholder="Describe your problem in detail..."
                  className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  What are the root causes?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Dig deeper than surface-level symptoms. Ask "why" multiple times to get to the core issues.
                </p>
                {rootCauses.map((cause, index) => (
                  <div key={index} className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Root Cause {index + 1}
                    </label>
                    <input
                      type="text"
                      value={cause}
                      onChange={(e) => handleRootCauseChange(index, e.target.value)}
                      placeholder={`What's causing this problem? (Cause ${index + 1})`}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Generate Potential Solutions
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Think of multiple approaches. Don't judge them yet - just brainstorm different ways to address the root causes.
                </p>
                {solutions.map((solution, index) => (
                  <div key={index} className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Solution {index + 1}
                    </label>
                    <input
                      type="text"
                      value={solution}
                      onChange={(e) => handleSolutionChange(index, e.target.value)}
                      placeholder={`Potential solution ${index + 1}`}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Create Your Action Plan
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Choose your best solution and break it down into specific, actionable steps with deadlines.
                </p>
                <textarea
                  value={actionPlan}
                  onChange={(e) => setActionPlan(e.target.value)}
                  placeholder="What specific steps will you take? When will you do them? How will you measure success?"
                  className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Previous
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Close
            </button>
            
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Complete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
