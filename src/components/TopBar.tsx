'use client'

import { BookOpen, LogOut, User } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'

interface TopBarProps {
  streak: number
  onOpenJournal: () => void
}

interface GreetingSectionProps {
  streak: number
  userName?: string
}

function GreetingSection({ streak, userName }: GreetingSectionProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-1">
        {getGreeting()}, {userName || "Warrior"} 👋
      </h1>
      <div className="flex items-center gap-2">
        <span className="text-lg">🔥</span>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Day {streak} streak
        </span>
      </div>
    </div>
  )
}

export function TopBar({ streak, onOpenJournal }: TopBarProps) {
  const { data: session } = useSession()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/signin" })
  }

  return (
    <header className="glass sticky top-0 z-30 flex items-center justify-between px-8 py-5 backdrop-blur-md border-b border-white/20 dark:border-gray-800/30 shadow-sm">
      {/* Left Side - Greeting & Streak */}
      <div className="flex items-center gap-6">
        <GreetingSection streak={streak} userName={session?.user?.name || undefined} />
      </div>

      {/* Center - Journal Button */}
      <div className="flex items-center gap-2">
        <Button
          onClick={onOpenJournal}
          variant="primary"
          size="md"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Journal
        </Button>
      </div>

      {/* Right Side - Profile */}
      <div className="flex items-center gap-4">
        {session?.user ? (
          <div className="flex items-center gap-2">
            {/* User Info */}
            <div className="flex items-center gap-2 px-3 py-2 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
              {session.user.image ? (
                <img 
                  src={session.user.image} 
                  alt="Profile" 
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <User className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">{session.user.name}</span>
            </div>
            
            {/* Sign Out Button */}
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-800"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
            <span className="text-sm">👤</span>
          </div>
        )}
      </div>
    </header>
  )
}
