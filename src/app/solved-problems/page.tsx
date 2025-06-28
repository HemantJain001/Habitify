'use client'

import { useState } from 'react'
import { Search, Filter, Calendar, Brain, Target, Heart, Power, ChevronDown, ChevronUp, Edit3, RotateCcw, Pin, Trash2, AlertCircle } from 'lucide-react'
import { cn, type ProblemSolvingEntry, mockProblemSolvingEntries, mockPowerSystemTodos } from '@/lib/utils'
import { Sidebar } from '@/components/Sidebar'
import { TopBar } from '@/components/TopBar'
import { CalendarModal } from '@/components/CalendarModal'
import { DailyJournalModal } from '@/components/DailyJournalModal'
import { ProblemSolvingModal } from '@/components/ProblemSolvingModal'
import { SimpleBehaviorModal } from '@/components/SimpleBehaviorModal'

export default function SolvedProblemsPage() {
  const [problems, setProblems] = useState<ProblemSolvingEntry[]>(mockProblemSolvingEntries)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState('all')
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [pinnedProblems, setPinnedProblems] = useState<Set<string>>(new Set())
  
  // Modal states
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [journalOpen, setJournalOpen] = useState(false)
  const [problemSolvingOpen, setProblemSolvingOpen] = useState(false)
  const [trackYourselfOpen, setTrackYourselfOpen] = useState(false)

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.wrongThing.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.problemNature.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterBy === 'all') return matchesSearch
    if (filterBy === 'emotional') return matchesSearch && problem.problemNature.toLowerCase() === 'emotional'
    if (filterBy === 'financial') return matchesSearch && problem.problemNature.toLowerCase() === 'financial'
    if (filterBy === 'external') return matchesSearch && problem.problemNature.toLowerCase() === 'external'
    if (filterBy === 'daily') return matchesSearch && problem.isDaily
    if (filterBy === 'high-impact') return matchesSearch && problem.emotionalImpact >= 70
    return matchesSearch
  })

  const toggleCardExpansion = (problemId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(problemId)) {
        newSet.delete(problemId)
      } else {
        newSet.add(problemId)
      }
      return newSet
    })
  }

  const getProblemTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'emotional':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      case 'financial':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'external':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'relational':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  const EmotionalImpactBar = ({ percentage }: { percentage: number }) => (
    <div className="space-y-2">
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-red-400 via-orange-400 to-red-600 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Low</span>
        <span className="font-medium text-gray-700 dark:text-gray-300">{percentage}%</span>
        <span>High</span>
      </div>
    </div>
  )

  // Button handlers
  const handleEdit = (problemId: string) => {
    // TODO: Implement edit functionality
    console.log('Edit problem:', problemId)
    // This could open an edit modal or navigate to edit page
  }

  const handlePin = (problemId: string) => {
    setPinnedProblems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(problemId)) {
        newSet.delete(problemId)
      } else {
        newSet.add(problemId)
      }
      return newSet
    })
  }

  const handleDelete = (problemId: string) => {
    if (window.confirm('Are you sure you want to delete this problem? This action cannot be undone.')) {
      setProblems(prev => prev.filter(problem => problem.id !== problemId))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-[#191919] dark:to-gray-900">
      {/* Sidebar */}
      <Sidebar 
        onOpenCalendar={() => setCalendarOpen(true)}
        onOpenProblemSolving={() => setProblemSolvingOpen(true)}
        onOpenTrackYourself={() => setTrackYourselfOpen(true)}
        onOpenJournal={() => setJournalOpen(true)}
        onOpenSolvedProblems={() => {}}
        onCollapseChange={setSidebarCollapsed}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <TopBar 
          streak={7}
          onOpenJournal={() => setJournalOpen(true)}
        />

        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Solved Problems Dashboard
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Review the thinking trails that helped you navigate confusion and build better patterns.
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-3 rounded-xl">
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Total Problems
                  </div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {problems.length}
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 px-4 py-3 rounded-xl">
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                    Daily Patterns
                  </div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {problems.filter(p => p.isDaily).length}
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/30 px-4 py-3 rounded-xl">
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                    Avg Impact
                  </div>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {Math.round(problems.reduce((acc, p) => acc + p.emotionalImpact, 0) / problems.length || 0)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search problems, triggers, or solutions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm min-w-[200px]"
              >
                <option value="all">All Types</option>
                <option value="emotional">Emotional</option>
                <option value="financial">Financial</option>
                <option value="external">External</option>
                <option value="relational">Relational</option>
                <option value="daily">Daily Patterns</option>
                <option value="high-impact">High Impact (70%+)</option>
              </select>
            </div>
          </div>

          {/* Problem Cards */}
          <div className="space-y-6">
            {filteredProblems.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="max-w-md mx-auto">
                  <AlertCircle className="w-20 h-20 mx-auto mb-6 text-gray-300 dark:text-gray-600" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    No problems found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {searchTerm || filterBy !== 'all' 
                      ? "Try adjusting your search or filter criteria to find what you're looking for."
                      : "Start your reflection journey by solving your first problem. Click 'Problem Solving' in the sidebar to begin."}
                  </p>
                  {(!searchTerm && filterBy === 'all') && (
                    <button 
                      onClick={() => setProblemSolvingOpen(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                    >
                      <Brain className="w-5 h-5" />
                      Start Problem Solving
                    </button>
                  )}
                </div>
              </div>
            ) : (
              filteredProblems.map((problem) => {
                const isExpanded = expandedCards.has(problem.id)
                
                return (
                  <div key={problem.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-300">
                    {/* Card Header - Always Visible */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getProblemTypeColor(problem.problemNature)}`}>
                              {problem.problemNature}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                              {problem.date.toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </span>
                            {problem.isDaily && (
                              <span className="px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                                Daily Pattern
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                            What was I doing wrong?
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                            {problem.wrongThing}
                          </p>
                          
                          {/* Impact indicator in collapsed state */}
                          {!isExpanded && (
                            <div className="mt-4 flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Impact:</span>
                                <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                  <div 
                                    className="bg-gradient-to-r from-red-400 to-red-600 h-1.5 rounded-full"
                                    style={{ width: `${problem.emotionalImpact}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {problem.emotionalImpact}%
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => toggleCardExpansion(problem.id)}
                          className="ml-4 p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                      </div>

                      {!isExpanded && (
                        <button
                          onClick={() => toggleCardExpansion(problem.id)}
                          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition-colors group"
                        >
                          <span>View Full Reflection</span>
                          <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                        </button>
                      )}
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <div className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Section 1: Awareness & Patterns */}
                            <div className="space-y-6">
                              <div className="flex items-center gap-3 pb-3 border-b border-purple-200 dark:border-purple-800">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                  <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                  Awareness & Patterns
                                </h4>
                              </div>

                              <div className="space-y-5">
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                                    ⚠️ Problem Behavior
                                  </label>
                                  <p className="text-gray-900 dark:text-gray-100 font-medium leading-relaxed">
                                    {problem.wrongThing}
                                  </p>
                                </div>

                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                                    🔁 Trigger Pattern
                                  </label>
                                  <p className="text-gray-900 dark:text-gray-100 font-medium leading-relaxed">
                                    {problem.trigger}
                                  </p>
                                </div>

                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                                    ⏳ Daily Repetition
                                  </label>
                                  <p className="text-gray-900 dark:text-gray-100 font-medium leading-relaxed">
                                    {problem.isDaily ? 'Yes, this happens daily' : 'No, this is occasional'}
                                  </p>
                                </div>

                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                                    😵 Wrong Path Reaction
                                  </label>
                                  <p className="text-gray-900 dark:text-gray-100 font-medium leading-relaxed">
                                    {problem.onceStarted}
                                  </p>
                                </div>

                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                                    🧨 Long-term Impact
                                  </label>
                                  <p className="text-gray-900 dark:text-gray-100 font-medium leading-relaxed">
                                    {problem.longTermImpact}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Section 2: Solution & Impact */}
                            <div className="space-y-6">
                              {/* Solution & Benefits */}
                              <div className="flex items-center gap-3 pb-3 border-b border-blue-200 dark:border-blue-800">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                  <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                  Solution & Benefits
                                </h4>
                              </div>

                              <div className="space-y-5">
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                                    🧭 Preferred Behavior
                                  </label>
                                  <p className="text-gray-900 dark:text-gray-100 font-medium leading-relaxed">
                                    {problem.shouldDoInstead}
                                  </p>
                                </div>

                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                                    🌱 Positive Outcome
                                  </label>
                                  <p className="text-gray-900 dark:text-gray-100 font-medium leading-relaxed">
                                    {problem.benefits}
                                  </p>
                                </div>
                              </div>

                              {/* Impact & Power */}
                              <div className="flex items-center gap-3 pb-3 border-b border-red-200 dark:border-red-800">
                                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                  <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                  Impact & Power
                                </h4>
                              </div>

                              <div className="space-y-5">
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                                    🧩 Problem Category
                                  </label>
                                  <p className="text-gray-900 dark:text-gray-100 font-medium leading-relaxed">
                                    {problem.problemNature}
                                  </p>
                                </div>

                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                                    ❤️ Impact Level ({problem.emotionalImpact}%)
                                  </label>
                                  <EmotionalImpactBar percentage={problem.emotionalImpact} />
                                </div>

                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                                    🧘 Coping Strategy
                                  </label>
                                  <p className="text-gray-900 dark:text-gray-100 font-medium leading-relaxed">
                                    {problem.hasStrategy ? problem.strategy : 'No specific strategy yet'}
                                  </p>
                                </div>

                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                                    ⚖️ Control Source
                                  </label>
                                  <p className="text-gray-900 dark:text-gray-100 font-medium leading-relaxed">
                                    {problem.hasPower ? 'Yes, I have power to solve this' : 'No, this is beyond my control'}
                                  </p>
                                </div>

                                {problem.hasPower && (
                                  <>
                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                                        🛠️ Actionable Power
                                      </label>
                                      <p className="text-gray-900 dark:text-gray-100 font-medium leading-relaxed">
                                        {problem.powerToChange}
                                      </p>
                                    </div>

                                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                                        🚀 Long-term Solution
                                      </label>
                                      <p className="text-gray-900 dark:text-gray-100 font-medium leading-relaxed">
                                        {problem.longTermSolution}
                                      </p>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button 
                              onClick={() => setProblemSolvingOpen(true)}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                              <RotateCcw className="w-4 h-4" />
                              Reflect Again
                            </button>
                            <button 
                              onClick={() => handleEdit(problem.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                            >
                              <Edit3 className="w-4 h-4" />
                              Edit
                            </button>
                            <button 
                              onClick={() => handlePin(problem.id)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                                pinnedProblems.has(problem.id)
                                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                              }`}
                            >
                              <Pin className="w-4 h-4" />
                              {pinnedProblems.has(problem.id) ? 'Unpin' : 'Pin'}
                            </button>
                            <button 
                              onClick={() => handleDelete(problem.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-medium"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CalendarModal 
        isOpen={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        onOpenJournal={() => setJournalOpen(true)}
        powerSystemTodos={mockPowerSystemTodos}
      />

      <DailyJournalModal 
        isOpen={journalOpen}
        onClose={() => setJournalOpen(false)}
      />

      <ProblemSolvingModal 
        isOpen={problemSolvingOpen}
        onClose={() => setProblemSolvingOpen(false)}
      />

      <SimpleBehaviorModal 
        isOpen={trackYourselfOpen}
        onClose={() => setTrackYourselfOpen(false)}
      />
    </div>
  )
}
