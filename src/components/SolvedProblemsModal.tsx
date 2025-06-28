'use client'

import { useState } from 'react'
import { X, CheckCircle, Clock, Calendar, Award, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Common'

interface SolvedProblem {
  id: string
  title: string
  description: string
  category: 'technical' | 'personal' | 'business' | 'health'
  difficulty: 'easy' | 'medium' | 'hard'
  solvedDate: Date
  timeSpent: number // in minutes
  tags: string[]
  solution?: string
}

interface SolvedProblemsModalProps {
  isOpen: boolean
  onClose: () => void
}

// Mock data for solved problems
const mockSolvedProblems: SolvedProblem[] = [
  {
    id: '1',
    title: 'Implemented Authentication System',
    description: 'Built a secure JWT-based authentication system with role-based access control',
    category: 'technical',
    difficulty: 'hard',
    solvedDate: new Date('2024-01-15'),
    timeSpent: 180,
    tags: ['React', 'Node.js', 'JWT', 'Security'],
    solution: 'Used JWT tokens with refresh mechanism and implemented middleware for route protection'
  },
  {
    id: '2',
    title: 'Optimized Morning Routine',
    description: 'Streamlined morning routine to include exercise, meditation, and healthy breakfast',
    category: 'personal',
    difficulty: 'medium',
    solvedDate: new Date('2024-01-12'),
    timeSpent: 60,
    tags: ['Habits', 'Health', 'Productivity'],
    solution: 'Created a structured 90-minute morning routine with time blocks for each activity'
  },
  {
    id: '3',
    title: 'Database Performance Issue',
    description: 'Resolved slow query performance by optimizing database indexes and query structure',
    category: 'technical',
    difficulty: 'hard',
    solvedDate: new Date('2024-01-10'),
    timeSpent: 240,
    tags: ['Database', 'SQL', 'Performance', 'Optimization'],
    solution: 'Added composite indexes and rewrote queries to use proper JOIN conditions'
  },
  {
    id: '4',
    title: 'Client Communication Strategy',
    description: 'Developed better communication framework for handling difficult client conversations',
    category: 'business',
    difficulty: 'medium',
    solvedDate: new Date('2024-01-08'),
    timeSpent: 90,
    tags: ['Communication', 'Business', 'Strategy'],
    solution: 'Implemented active listening techniques and structured meeting agendas'
  }
]

export function SolvedProblemsModal({ isOpen, onClose }: SolvedProblemsModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')

  if (!isOpen) return null

  const filteredProblems = mockSolvedProblems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || problem.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || problem.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'personal': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'business': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'health': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const totalTimeSpent = mockSolvedProblems.reduce((sum, problem) => sum + problem.timeSpent, 0)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#191919] rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Solved Problems
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your problem-solving journey and achievements
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
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {mockSolvedProblems.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Problems Solved
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Math.round(totalTimeSpent / 60)}h
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Time Invested
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search problems, tags, or solutions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical</option>
              <option value="personal">Personal</option>
              <option value="business">Business</option>
              <option value="health">Health</option>
            </select>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Problems List */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {filteredProblems.map((problem) => (
              <Card key={problem.id} className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {problem.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {problem.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge className={getCategoryColor(problem.category)}>
                        {problem.category}
                      </Badge>
                      <Badge className={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                    </div>
                  </div>

                  {/* Solution */}
                  {problem.solution && (
                    <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                        Solution:
                      </h4>
                      <p className="text-sm text-green-800 dark:text-green-200">
                        {problem.solution}
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {problem.tags.map((tag) => (
                      <Badge key={tag} variant="default" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {problem.solvedDate.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {problem.timeSpent}m
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredProblems.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">
                No problems found matching your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
