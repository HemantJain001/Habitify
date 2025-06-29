'use client'

import { useState } from 'react'
import { CheckCircle, Clock, Calendar, Award, Search, Filter, Edit, Trash2, Brain, Target, TrendingUp, BarChart3, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useProblems, useDeleteProblem, useUpdateProblem } from '@/lib/hooks'
import { ProblemSolvingEntry } from '@/lib/utils'

export function SolvedProblemsClient() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'impact'>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  
  const { data: problemsData, isLoading } = useProblems()
  const deleteProblem = useDeleteProblem()
  const updateProblem = useUpdateProblem()
  
  const problems = problemsData?.problemEntries || []

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

  const categories = Array.from(new Set(problems.map(p => p.problemCategory))).filter(Boolean)

  const getImpactColor = (impact: number) => {
    if (impact >= 80) return 'text-red-500'
    if (impact >= 60) return 'text-orange-500'
    if (impact >= 40) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getImpactBadgeColor = (impact: number) => {
    if (impact >= 80) return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    if (impact >= 60) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
    if (impact >= 40) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this problem entry?')) {
      try {
        await deleteProblem.mutateAsync(id)
      } catch (error) {
        console.error('Failed to delete problem:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Solved Problems
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Review and manage your problem-solving journey
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Card className="p-4">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {problems.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Problems
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {problems.filter(p => p.emotionalImpact >= 70).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              High Impact
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {categories.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Categories
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {Math.round(problems.reduce((sum, p) => sum + p.emotionalImpact, 0) / problems.length) || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Avg Impact
            </div>
          </Card>
        </div>
      </div>

      {/* Controls */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="min-w-[200px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="min-w-[150px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'impact')}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="impact">Highest Impact</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </div>
        </div>
      </Card>

      {/* Empty State */}
      {sortedProblems.length === 0 && (
        <Card className="p-8 text-center">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            No Problems Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || selectedCategory !== 'all' 
              ? "No problems match your current filters." 
              : "Start solving problems to see them here."}
          </p>
          {(searchTerm || selectedCategory !== 'all') && (
            <Button
              variant="secondary"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
            >
              Clear Filters
            </Button>
          )}
        </Card>
      )}

      {/* Problems Grid/List */}
      {sortedProblems.length > 0 && (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}>
          {sortedProblems.map((problem) => (
            <Card key={problem.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getImpactBadgeColor(problem.emotionalImpact)}>
                      Impact: {problem.emotionalImpact}%
                    </Badge>
                    {problem.problemCategory && (
                      <Badge variant="default">
                        {problem.problemCategory}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {formatDate(problem.createdAt.toString())}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedCard(expandedCard === problem.id ? null : problem.id)}
                  >
                    {expandedCard === problem.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(problem.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                    Problem Behavior
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {problem.problemBehavior}
                  </p>
                </div>

                {expandedCard === problem.id && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                        Trigger Pattern
                      </label>
                      <p className="text-gray-600 dark:text-gray-400">
                        {problem.triggerPattern}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                        Preferred Behavior
                      </label>
                      <p className="text-gray-600 dark:text-gray-400">
                        {problem.preferredBehavior}
                      </p>
                    </div>

                    {problem.longTermSolution && (
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                          Long-term Solution
                        </label>
                        <p className="text-gray-600 dark:text-gray-400">
                          {problem.longTermSolution}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-1">
                        <Target className={`w-4 h-4 ${getImpactColor(problem.emotionalImpact)}`} />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Emotional Impact: {problem.emotionalImpact}%
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
