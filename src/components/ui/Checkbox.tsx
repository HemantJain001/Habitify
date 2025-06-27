'use client'

import { HTMLAttributes, ButtonHTMLAttributes } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'checked'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  size?: 'sm' | 'md' | 'lg'
}

function Checkbox({ 
  className, 
  checked = false, 
  onCheckedChange, 
  size = 'md',
  disabled,
  ...props 
}: CheckboxProps) {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-5 h-5'
  }

  const handleClick = () => {
    if (!disabled && onCheckedChange) {
      onCheckedChange(!checked)
    }
  }

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-sm border transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
        checked 
          ? "bg-blue-500 border-blue-500 text-white" 
          : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500",
        disabled && "opacity-50 cursor-not-allowed",
        sizes[size],
        className
      )}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {checked && <Check className="w-full h-full p-0.5" />}
    </button>
  )
}

export { Checkbox }
