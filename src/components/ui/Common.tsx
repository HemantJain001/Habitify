'use client'

import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface IconButtonProps extends HTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode
  variant?: 'default' | 'success' | 'danger' | 'warning'
  size?: 'xs' | 'sm' | 'md'
  tooltip?: string
}

function IconButton({ 
  icon, 
  variant = 'default', 
  size = 'sm', 
  className, 
  tooltip,
  ...props 
}: IconButtonProps) {
  const variants = {
    default: 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
    success: 'text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20',
    danger: 'text-gray-600 hover:text-red-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/20',
    warning: 'text-gray-600 hover:text-yellow-600 dark:text-gray-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/20'
  }
  
  const sizes = {
    xs: 'w-4 h-4 p-0.5',
    sm: 'w-5 h-5 p-1',
    md: 'w-6 h-6 p-1.5'
  }

  return (
    <button
      className={cn(
        'rounded transition-colors notion-hover cursor-pointer flex items-center justify-center',
        variants[variant],
        sizes[size],
        className
      )}
      title={tooltip}
      {...props}
    >
      {icon}
    </button>
  )
}

interface GlassContainerProps extends HTMLAttributes<HTMLDivElement> {
  blur?: 'sm' | 'md' | 'lg' | 'xl'
}

function GlassContainer({ 
  children, 
  className, 
  blur = 'sm',
  ...props 
}: GlassContainerProps) {
  const blurLevels = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md', 
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  }

  return (
    <div
      className={cn(
        'glass rounded-2xl border border-white/20 dark:border-gray-800/30 shadow-lg',
        blurLevels[blur],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
}

function Badge({ 
  children, 
  className, 
  variant = 'default', 
  size = 'sm',
  ...props 
}: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export { IconButton, GlassContainer, Badge }
