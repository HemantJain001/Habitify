'use client'

import { useState } from 'react'
import { SolvedProblemsClient } from '@/components/SolvedProblemsClient'
import { Sidebar } from '@/components/Sidebar'
import { TopBar } from '@/components/TopBar'
import { useRouter } from 'next/navigation'

export default function SolvedProblemsPage() {
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleOpenJournal = () => {
    router.push('/?journal=true')
  }

  const handleOpenDashboard = () => {
    router.push('/')
  }

  const handleOpenCalendar = () => {
    // Could open a calendar modal or navigate to calendar page
    console.log('Calendar clicked')
  }

  const handleOpenProblemSolving = () => {
    // Could open problem solving modal or navigate to problem solving page
    console.log('Problem solving clicked')
  }

  const handleOpenTrackYourself = () => {
    // Could open track yourself modal or navigate to track yourself page
    console.log('Track yourself clicked')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-500">
      {/* Sidebar */}
      <Sidebar 
        onOpenDashboard={handleOpenDashboard}
        onOpenCalendar={handleOpenCalendar}
        onOpenProblemSolving={handleOpenProblemSolving}
        onOpenTrackYourself={handleOpenTrackYourself}
        onOpenJournal={handleOpenJournal}
        onCollapseChange={setSidebarCollapsed}
      />

      {/* Main Content Wrapper */}
      <div className={`layout-transition ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Top Bar */}
        <TopBar 
          streak={0} 
          onOpenJournal={handleOpenJournal}
        />

        {/* Main Content */}
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <SolvedProblemsClient />
        </main>
      </div>
    </div>
  )
}
