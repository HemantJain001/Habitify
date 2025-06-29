'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Metadata } from 'next'
import { BehaviorHistoryClient } from '@/components/BehaviorHistoryClient'
import { Sidebar } from '@/components/Sidebar'
import { TopBar } from '@/components/TopBar'
import { CalendarModal } from '@/components/CalendarModal'
import { ProblemSolvingModal } from '@/components/ProblemSolvingModal'
import { SimpleBehaviorModal } from '@/components/SimpleBehaviorModal'
import { useUserStats } from '@/lib/hooks'

export default function BehaviorHistoryPage() {
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  // Modal states
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [problemSolvingOpen, setProblemSolvingOpen] = useState(false)
  const [trackYourselfOpen, setTrackYourselfOpen] = useState(false)

  // Get user stats for streak display
  const { data: statsData } = useUserStats()
  const stats = statsData || { streak: 0, brain: { today: 0, week: 0, month: 0, progress: 0 }, muscle: { today: 0, week: 0, month: 0, progress: 0 }, money: { today: 0, week: 0, month: 0, progress: 0 } }

  // Navigation handlers
  const handleOpenDashboard = () => {
    router.push('/')
  }

  const handleOpenJournal = () => {
    router.push('/?journal=true')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        onOpenDashboard={handleOpenDashboard}
        onOpenCalendar={() => setCalendarOpen(true)}
        onOpenProblemSolving={() => setProblemSolvingOpen(true)}
        onOpenTrackYourself={() => setTrackYourselfOpen(true)}
        onOpenJournal={handleOpenJournal}
        onOpenSolvedProblems={() => router.push('/solved-problems')}
        onCollapseChange={setSidebarCollapsed}
      />

      {/* Main Content Wrapper */}
      <div className={`layout-transition ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Top Bar */}
        <TopBar 
          streak={stats.streak}
          onOpenJournal={handleOpenJournal}
        />

        {/* Behavior History Content */}
        <BehaviorHistoryClient />
      </div>

      {/* Modals */}
      <CalendarModal
        isOpen={calendarOpen}
        onClose={() => setCalendarOpen(false)}
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
