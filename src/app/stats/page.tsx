'use client'

import { AuthGuard } from '@/components/AuthGuard'
import { TopBar } from '@/components/TopBar'
import { StatsDashboard } from '@/components/StatsDashboard'
import { Sidebar } from '@/components/Sidebar'
import { useState } from 'react'

export default function StatsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleOpenJournal = () => {
    // Navigate to journal page or open journal modal
    console.log('Opening journal...')
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar 
          onCollapseChange={(collapsed: boolean) => setSidebarCollapsed(collapsed)}
        />
        
        <div className={`transition-all duration-300 ${
          sidebarCollapsed ? 'ml-0 lg:ml-16' : 'ml-0 lg:ml-64'
        }`}>
          <TopBar 
            streak={7} // Mock streak data - replace with actual data
            onOpenJournal={handleOpenJournal}
          />
          
          <main className="p-6">
            <StatsDashboard />
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
