'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface NeumorphicCardProps {
  children: ReactNode
  className?: string
  pressed?: boolean
  inset?: boolean
}

export function NeumorphicCard({
  children,
  className = '',
  pressed = false,
  inset = false,
}: NeumorphicCardProps) {
  return (
    <motion.div
      className={cn(
        'rounded-2xl transition-all duration-300',
        inset || pressed
          ? 'shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.05)]'
          : 'shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),-8px_-8px_16px_rgba(255,255,255,0.05)]',
        'bg-[#f5f5f7] dark:bg-[#1c1c1e]',
        className
      )}
      whileHover={!inset && !pressed ? { scale: 1.02 } : undefined}
      whileTap={!inset ? { scale: 0.98 } : undefined}
    >
      {children}
    </motion.div>
  )
}
