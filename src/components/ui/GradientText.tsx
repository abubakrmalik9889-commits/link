'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GradientTextProps {
  children: ReactNode
  className?: string
  variant?: 'emerald' | 'sapphire' | 'sunset' | 'aurora'
  animate?: boolean
}

export function GradientText({
  children,
  className = '',
  variant = 'emerald',
  animate = false,
}: GradientTextProps) {
  const variants = {
    emerald: 'from-emerald-400 via-emerald-500 to-teal-500',
    sapphire: 'from-blue-400 via-blue-500 to-indigo-500',
    sunset: 'from-orange-400 via-pink-500 to-purple-500',
    aurora: 'from-emerald-400 via-blue-500 to-purple-500',
  }

  return (
    <span
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent',
        variants[variant],
        animate && 'animate-gradient bg-[length:200%_auto]',
        className
      )}
    >
      {children}
    </span>
  )
}
