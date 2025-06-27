'use client'

import { useState } from 'react'
import { ArrowLeft, Search, Filter, Calendar, Brain, Target, Heart, Power, Clock, ChevronRight } from 'lucide-react'
import { cn, type ProblemSolvingEntry, mockProblemSolvingEntries, mockPowerSystemTodos } from '@/lib/utils'
import { Sidebar } from '@/components/Sidebar'
import { TopBar } from '@/components/TopBar'
import { CalendarModal } from '@/components/CalendarModal'
import { DailyJournalModal } from '@/components/DailyJournalModal'
import { ProblemSolvingModal } from '@/components/ProblemSolvingModal'
import { NewMeModal } from '@/components/NewMeModal'

export default function SolvedProblemsPage() {
  const [problems] = useState<ProblemSolvingEntry[]>(mockProblemSolvingEntries)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState('all')
  const [selectedProblem, setSelectedProblem] = useState<ProblemSolvingEntry | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  // Modal states
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [journalOpen, setJournalOpen] = useState(false)
  const [problemSolvingOpen, setProblemSolvingOpen] = useState(false)
  const [newMeOpen, setNewMeOpen] = useState(false)

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.wrongThing.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.problemNature.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterBy === 'all') return matchesSearch
    if (filterBy === 'daily') return matchesSearch && problem.isDaily
    if (filterBy === 'high-impact') return matchesSearch && problem.emotionalImpact >= 70
    if (filterBy === 'recent') {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      return matchesSearch && problem.date >= oneWeekAgo
    }
    return matchesSearch
  })

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'pattern':
        return <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
      case 'solution':
        return <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      case 'emotional':
        return <Heart className="w-4 h-4 text-red-600 dark:text-red-400" />
      case 'power':
        return <Power className="w-4 h-4 text-green-600 dark:text-green-400" />
      default:
        return null
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  const getImpactColor = (impact: number) => {
    if (impact >= 80) return 'text-red-600 dark:text-red-400'
    if (impact >= 60) return 'text-orange-600 dark:text-orange-400'
    if (impact >= 40) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-green-600 dark:text-green-400'
  }

  const getImpactBg = (impact: number) => {
    if (impact >= 80) return 'bg-red-100 dark:bg-red-900/20'
    if (impact >= 60) return 'bg-orange-100 dark:bg-orange-900/20'
    if (impact >= 40) return 'bg-yellow-100 dark:bg-yellow-900/20'
    return 'bg-green-100 dark:bg-green-900/20'
  }

  if (selectedProblem) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-[#0A0A0A]">
        <Sidebar
          onOpenCalendar={() => setCalendarOpen(true)}
          onOpenProblemSolving={() => setProblemSolvingOpen(true)}
          onOpenNewMe={() => setNewMeOpen(true)}
          onOpenJournal={() => setJournalOpen(true)}
          onOpenSolvedProblems={() => {}} // Already on this page
          onCollapseChange={setSidebarCollapsed}
        />
        
        <div className={cn(
          "flex-1 transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}>
          <TopBar 
            streak={7}
            totalXP={48}
            maxXP={100}
            onOpenJournal={() => setJournalOpen(true)}
          />
          
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setSelectedProblem(null)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Problem Analysis
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Detailed breakdown of {selectedProblem.title}
                  </p>
                </div>
              </div>

              {/* Problem Details */}
              <div className="bg-white dark:bg-[#191919] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                {/* Problem Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {selectedProblem.title}
                      </h2>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(selectedProblem.date)}
                        </div>
                        {selectedProblem.isDaily && (
                          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                            Daily Pattern
                          </span>
                        )}
                        <span className={cn(
                          "px-2 py-1 text-xs rounded-full",
                          getImpactBg(selectedProblem.emotionalImpact),
                          getImpactColor(selectedProblem.emotionalImpact)
                        )}>
                          {selectedProblem.emotionalImpact}% Impact
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sections */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {/* Pattern Analysis */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      {getSectionIcon('pattern')}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Pattern Analysis
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Problematic Behavior
                        </h4>
                        <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                          {selectedProblem.wrongThing}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Trigger
                        </h4>
                        <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                          {selectedProblem.trigger}
                        </p>
                      </div>
                      {selectedProblem.avoidTrigger && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            How to Avoid Trigger
                          </h4>
                          <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                            {selectedProblem.avoidTrigger}
                          </p>
                        </div>
                      )}
                      {selectedProblem.onceStarted && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            How to Stop Once Started
                          </h4>
                          <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                            {selectedProblem.onceStarted}
                          </p>
                        </div>
                      )}
                      {selectedProblem.longTermImpact && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Long-term Consequences
                          </h4>
                          <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                            {selectedProblem.longTermImpact}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Solution Development */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      {getSectionIcon('solution')}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Solution Development
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {selectedProblem.shouldDoInstead && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            What to Do Instead
                          </h4>
                          <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                            {selectedProblem.shouldDoInstead}
                          </p>
                        </div>
                      )}
                      {selectedProblem.benefits && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Benefits of Change
                          </h4>
                          <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                            {selectedProblem.benefits}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Emotional Impact */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      {getSectionIcon('emotional')}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Emotional Impact
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {selectedProblem.problemNature && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Problem Nature
                          </h4>
                          <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full text-sm">
                            {selectedProblem.problemNature}
                          </span>
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Emotional Impact Level
                        </h4>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={cn(
                                "h-2 rounded-full transition-all duration-300",
                                selectedProblem.emotionalImpact >= 80 ? "bg-red-500" :
                                selectedProblem.emotionalImpact >= 60 ? "bg-orange-500" :
                                selectedProblem.emotionalImpact >= 40 ? "bg-yellow-500" : "bg-green-500"
                              )}
                              style={{ width: `${selectedProblem.emotionalImpact}%` }}
                            />
                          </div>
                          <span className={cn("text-sm font-medium", getImpactColor(selectedProblem.emotionalImpact))}>
                            {selectedProblem.emotionalImpact}%
                          </span>
                        </div>
                      </div>
                      {selectedProblem.hasStrategy && selectedProblem.strategy && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Coping Strategy
                          </h4>
                          <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                            {selectedProblem.strategy}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Power & Control */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      {getSectionIcon('power')}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Power & Control
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Sense of Control
                        </h4>
                        <span className={cn(
                          "inline-block px-3 py-1 rounded-full text-sm",
                          selectedProblem.hasPower 
                            ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                            : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                        )}>
                          {selectedProblem.hasPower ? "I have control" : "Limited control"}
                        </span>
                      </div>
                      {selectedProblem.powerToChange && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            What I Can Control
                          </h4>
                          <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                            {selectedProblem.powerToChange}
                          </p>
                        </div>
                      )}
                      {selectedProblem.longTermSolution && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Long-term Solution
                          </h4>
                          <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                            {selectedProblem.longTermSolution}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
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
          powerSystemTodos={mockPowerSystemTodos}
        />
        
        <ProblemSolvingModal 
          isOpen={problemSolvingOpen}
          onClose={() => setProblemSolvingOpen(false)}
        />
        
        <NewMeModal 
          isOpen={newMeOpen}
          onClose={() => setNewMeOpen(false)}
        />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0A0A0A]">
      <Sidebar
        onOpenCalendar={() => setCalendarOpen(true)}
        onOpenProblemSolving={() => setProblemSolvingOpen(true)}
        onOpenNewMe={() => setNewMeOpen(true)}
        onOpenJournal={() => setJournalOpen(true)}
        onOpenSolvedProblems={() => {}} // Already on this page
        onCollapseChange={setSidebarCollapsed}
      />
      
      <div className={cn(
        "flex-1 transition-all duration-300",
        sidebarCollapsed ? "ml-16" : "ml-64"
      )}>
        <TopBar 
          streak={7}
          totalXP={48}
          maxXP={100}
          onOpenJournal={() => setJournalOpen(true)}
        />
        
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Solved Problems
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Review your problem-solving journey and insights
                </p>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {filteredProblems.length} problems
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search problems, behaviors, or categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Problems</option>
                  <option value="recent">Recent (7 days)</option>
                  <option value="daily">Daily Patterns</option>
                  <option value="high-impact">High Impact (70%+)</option>
                </select>
              </div>
            </div>

            {/* Problems Grid */}
            {filteredProblems.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Brain className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No problems found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm ? 'Try adjusting your search or filter criteria.' : 'Start by solving your first problem using the Problem Solving Framework.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredProblems.map((problem) => (
                  <div
                    key={problem.id}
                    onClick={() => setSelectedProblem(problem)}
                    className="bg-white dark:bg-[#191919] rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                            <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {problem.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {problem.wrongThing}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(problem.date)}
                          </div>
                          {problem.isDaily && (
                            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                              Daily
                            </span>
                          )}
                          {problem.problemNature && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                              {problem.problemNature}
                            </span>
                          )}
                          <div className="flex items-center gap-1">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              problem.emotionalImpact >= 80 ? "bg-red-500" :
                              problem.emotionalImpact >= 60 ? "bg-orange-500" :
                              problem.emotionalImpact >= 40 ? "bg-yellow-500" : "bg-green-500"
                            )} />
                            <span className={getImpactColor(problem.emotionalImpact)}>
                              {problem.emotionalImpact}% impact
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
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
        powerSystemTodos={mockPowerSystemTodos}
      />
      
      <ProblemSolvingModal 
        isOpen={problemSolvingOpen}
        onClose={() => setProblemSolvingOpen(false)}
      />
      
      <NewMeModal 
        isOpen={newMeOpen}
        onClose={() => setNewMeOpen(false)}
      />
    </div>
  )
}
