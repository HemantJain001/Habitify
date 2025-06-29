'use client'

import { useState } from 'react'
import { X, CheckCircle, Clock, Calendar, Award, Search, Filter, Edit, Trash2, Brain, Target, TrendingUp, BarChart3, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useProblems, useDeleteProblem, useUpdateProblem } from '@/lib/hooks'
import { ProblemSolvingEntry } from '@/lib/utils'

interface SolvedProblemsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SolvedProblemsModal({ isOpen, onClose }: SolvedProblemsModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'impact'>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  
  const { data: problemsData, isLoading } = useProblems()
  const deleteProblem = useDeleteProblem()
  const updateProblem = useUpdateProblem()
  
  const problems = problemsData?.problemEntries || []

  if (!isOpen) return null

  const filteredProblems = problems.filter(problem => {
    const searchContent = `${problem.problemBehavior} ${problem.triggerPattern} ${problem.preferredBehavior} ${problem.longTermSolution || ''}`.toLowerCase()
    const matchesSearch = searchContent.includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || problem.problemCategory === selectedCategory

    return matchesSearch && matchesCategory
  })

  const sortedProblems = [...filteredProblems].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'impact':
        return b.emotionalImpact - a.emotionalImpact
      default:
        return 0
    }
  })

  const handleDeleteProblem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this problem analysis? This action cannot be undone.')) {
      try {
        await deleteProblem.mutateAsync(id)
      } catch (error) {
        console.error('Failed to delete problem:', error)
        alert('Failed to delete problem. Please try again.')
      }
    }
  }

  const handleTogglePin = async (problem: ProblemSolvingEntry) => {
    try {
      await updateProblem.mutateAsync({
        id: problem.id,
        data: { isPinned: !problem.isPinned }
      })
    } catch (error) {
      console.error('Failed to toggle pin:', error)
      alert('Failed to update problem. Please try again.')
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Emotional/Behavioral': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'Career/Professional': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'Health/Wellness': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'Relationship': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400'
      case 'Financial': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'Practical/External': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getEmotionalImpactColor = (impact: number) => {
    if (impact >= 70) return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    if (impact >= 40) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
  }

  const getImpactIcon = (impact: number) => {
    if (impact >= 70) return '🔴'
    if (impact >= 40) return '🟡'
    return '🟢'
  }

  const avgEmotionalImpact = problems.length > 0 
    ? Math.round(problems.reduce((sum, p) => sum + p.emotionalImpact, 0) / problems.length)
    : 0

  const categoryDistribution = problems.reduce((acc, problem) => {
    acc[problem.problemCategory] = (acc[problem.problemCategory] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topCategory = Object.entries(categoryDistribution).reduce((a, b) => 
    categoryDistribution[a[0]] > categoryDistribution[b[0]] ? a : b, ['None', 0]
  )[0]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#191919] rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Problem Analysis Dashboard
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your journey of self-discovery and growth
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-white/50"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Stats Dashboard */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {problems.length}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Problems Analyzed
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {avgEmotionalImpact}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Avg. Impact Level
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {topCategory}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Top Category
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {problems.filter(p => p.isPinned).length}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Pinned Solutions
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search behaviors, triggers, or solutions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              </div>
            </div>
            
            <div className="flex gap-3 flex-wrap">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="general">General</option>
                <option value="Emotional/Behavioral">Emotional/Behavioral</option>
                <option value="Practical/External">Practical/External</option>
                <option value="Relationship">Relationship</option>
                <option value="Career/Professional">Career/Professional</option>
                <option value="Health/Wellness">Health/Wellness</option>
                <option value="Financial">Financial</option>
                <option value="Other">Other</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="impact">Highest Impact</option>
              </select>
              
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-gray-600 shadow-sm' 
                      : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-gray-600 shadow-sm' 
                      : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
                <p className="text-gray-600 dark:text-gray-400">Loading your problem analyses...</p>
              </div>
            </div>
          ) : sortedProblems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No Problems Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                {searchTerm || selectedCategory !== 'all' 
                  ? "No problems match your current filters. Try adjusting your search."
                  : "You haven't analyzed any problems yet. Start by creating your first problem analysis."}
              </p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
            }>
              {sortedProblems.map((problem) => (
                <Card 
                  key={problem.id} 
                  className={`
                    relative overflow-hidden transition-all duration-200 hover:shadow-lg
                    ${problem.isPinned ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}
                    ${viewMode === 'grid' ? 'h-fit' : ''}
                  `}
                >
                  {/* Pin indicator */}
                  {problem.isPinned && (
                    <div className="absolute top-3 right-3 z-10">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-lg"></div>
                    </div>
                  )}
                  
                  <div className="p-5 space-y-4">
                    {/* Header */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                            {getImpactIcon(problem.emotionalImpact)} {problem.problemBehavior.length > 60 
                              ? problem.problemBehavior.substring(0, 60) + '...' 
                              : problem.problemBehavior}
                          </h3>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={getCategoryColor(problem.problemCategory)}>
                            {problem.problemCategory.replace('/', '/')}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Trigger */}
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium text-gray-900 dark:text-gray-200">Trigger:</span> {problem.triggerPattern}
                        </p>
                      </div>
                    </div>

                    {/* Impact and Tags */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getEmotionalImpactColor(problem.emotionalImpact)}>
                        {problem.emotionalImpact}% impact
                      </Badge>
                      {problem.isDaily && (
                        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
                          Daily Pattern
                        </Badge>
                      )}
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        {new Date(problem.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>

                    {/* Expandable Content */}
                    <div className="space-y-3">
                      {(expandedCard === problem.id || viewMode === 'list') && (
                        <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                          {/* Preferred Behavior */}
                          {problem.preferredBehavior && (
                            <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-3 border-l-4 border-green-400">
                              <h4 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
                                💡 Better Alternative
                              </h4>
                              <p className="text-sm text-green-800 dark:text-green-200">
                                {problem.preferredBehavior}
                              </p>
                            </div>
                          )}

                          {/* Long-term Solution */}
                          {problem.longTermSolution && (
                            <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-3 border-l-4 border-blue-400">
                              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                🎯 Long-term Solution
                              </h4>
                              <p className="text-sm text-blue-800 dark:text-blue-200">
                                {problem.longTermSolution}
                              </p>
                            </div>
                          )}

                          {/* Control Source */}
                          {problem.controlSource && (
                            <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-3 border-l-4 border-purple-400">
                              <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-1">
                                ⚡ Areas of Control
                              </h4>
                              <p className="text-sm text-purple-800 dark:text-purple-200">
                                {problem.controlSource}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        {viewMode === 'grid' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedCard(expandedCard === problem.id ? null : problem.id)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            {expandedCard === problem.id ? (
                              <>
                                <EyeOff className="w-4 h-4 mr-1" />
                                Less
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4 mr-1" />
                                More
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePin(problem)}
                          className={`p-2 transition-colors ${
                            problem.isPinned 
                              ? 'text-yellow-600 hover:text-yellow-700 dark:text-yellow-400' 
                              : 'text-gray-400 hover:text-yellow-500'
                          }`}
                          disabled={updateProblem.isPending}
                        >
                          <Award className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProblem(problem.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          disabled={deleteProblem.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
