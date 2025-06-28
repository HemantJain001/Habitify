'use client'

import { useSession } from 'next-auth/react'

export function DebugSession() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="p-2 bg-yellow-100 text-yellow-800 rounded">Loading session...</div>
  }

  return (
    <div className="p-2 bg-blue-100 text-blue-800 rounded mb-4">
      <div>Session Status: {status}</div>
      <div>User: {session?.user?.email || 'Not signed in'}</div>
      <div>Session: {session ? 'Authenticated' : 'Not authenticated'}</div>
    </div>
  )
}
