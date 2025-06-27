'use client'

import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'gradient'
  showLabel?: boolean
  label?: string
}

function ProgressBar({ 
  className, 
  value, 
  max = 100, 
  size = 'md', 
  variant = 'gradient',
  showLabel = false,
  label,
  ...props 
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const sizes = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2'
  }
  
  const variants = {
    default: 'bg-blue-500',
    gradient: 'bg-gradient-to-r from-blue-500 to-purple-500'
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {label || `${value} of ${max} completed`}
          </span>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className={cn(
        "w-full bg-gray-200 dark:bg-gray-700 rounded-full",
        sizes[size]
      )}>
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            variants[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export { ProgressBar }
