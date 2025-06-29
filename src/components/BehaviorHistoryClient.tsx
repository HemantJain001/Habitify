'use client'

import { useState, useMemo } from 'react'
import { Calendar, ChevronDown, Clock, FileText, Filter, Search, Sparkles, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useBehaviors } from '@/lib/hooks'
import { format, isToday, isYesterday, startOfDay, subDays } from 'date-fns'

interface FilterOptions {
  search: string
  dateRange: 'all' | 'today' | 'week' | 'month'
  sortBy: 'newest' | 'oldest' | 'title'
}

export function BehaviorHistoryClient() {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    dateRange: 'all',
    sortBy: 'newest'
  })
  const [showFilters, setShowFilters] = useState(false)

  // Calculate date filter for API
  const dateFilter = useMemo(() => {
    const today = new Date()
    switch (filters.dateRange) {
      case 'today':
        return format(today, 'yyyy-MM-dd')
      case 'week':
        return format(subDays(today, 7), 'yyyy-MM-dd')
      case 'month':
        return format(subDays(today, 30), 'yyyy-MM-dd')
      default:
        return undefined
    }
  }, [filters.dateRange])

  const { data, isLoading, error } = useBehaviors({ 
    date: dateFilter,
    limit: 100 
  })

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    if (!data?.behaviorEntries) return []

    let filtered = data.behaviorEntries

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(entry => 
        entry.title.toLowerCase().includes(searchLower) ||
        entry.value.toLowerCase().includes(searchLower)
      )
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'title':
          return a.title.localeCompare(b.title)
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return filtered
  }, [data?.behaviorEntries, filters])

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isToday(dateObj)) return 'Today'
    if (isYesterday(dateObj)) return 'Yesterday'
    return format(dateObj, 'MMM dd, yyyy')
  }

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return format(dateObj, 'h:mm a')
  }

  // Group entries by date
  const groupedEntries = useMemo(() => {
    const groups: Record<string, typeof filteredEntries> = {}
    
    filteredEntries.forEach(entry => {
      const dateKey = format(startOfDay(new Date(entry.createdAt)), 'yyyy-MM-dd')
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(entry)
    })

    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a))
  }, [filteredEntries])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <FileText className="w-12 h-12 mx-auto" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Unable to Load History
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {error instanceof Error ? error.message : 'Something went wrong'}
            </p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Behavior History
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your progress and review past entries
              </p>
            </div>
          </div>
          
          {/* Stats */}
          {data?.behaviorEntries && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <Card className="p-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {data.behaviorEntries.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Entries
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {data.behaviorEntries.filter(e => isToday(new Date(e.createdAt))).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Today
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {data.behaviorEntries.filter(e => new Date(e.createdAt) >= subDays(new Date(), 7)).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  This Week
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {new Set(data.behaviorEntries.map(e => format(new Date(e.createdAt), 'yyyy-MM-dd'))).size}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Active Days
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search entries..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Range
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as FilterOptions['dateRange'] }))}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterOptions['sortBy'] }))}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>
            </div>
          )}
        </Card>

        {/* Loading State */}
        {isLoading && (
          <Card className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading your behavior history...</p>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && filteredEntries.length === 0 && (
          <Card className="p-8 text-center">
            <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              No Entries Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {filters.search || filters.dateRange !== 'all' 
                ? "No entries match your current filters." 
                : "Start tracking your behavior to see your history here."}
            </p>
            {(filters.search || filters.dateRange !== 'all') && (
              <Button
                variant="secondary"
                onClick={() => setFilters({ search: '', dateRange: 'all', sortBy: 'newest' })}
              >
                Clear Filters
              </Button>
            )}
          </Card>
        )}

        {/* Entries List */}
        {!isLoading && groupedEntries.length > 0 && (
          <div className="space-y-6">
            {groupedEntries.map(([dateKey, entries]) => (
              <div key={dateKey}>
                {/* Date Header */}
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {formatDate(entries[0].createdAt)}
                  </h3>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                  </span>
                </div>

                {/* Entries for this date */}
                <div className="grid gap-3">
                  {entries.map((entry) => (
                    <Card key={entry.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                              {entry.title}
                            </h4>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="w-3 h-3" />
                              {formatTime(entry.createdAt)}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {entry.value}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
