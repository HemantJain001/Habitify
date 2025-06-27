'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'ghost'
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', error, ...props }, ref) => {
    const baseClasses = "w-full rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
    
    const variants = {
      default: "px-3 py-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400",
      ghost: "bg-transparent border-none text-gray-900 dark:text-gray-100 focus:ring-0 notion-input"
    }

    return (
      <div className="w-full">
        <input
          className={cn(
            baseClasses,
            variants[variant],
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
