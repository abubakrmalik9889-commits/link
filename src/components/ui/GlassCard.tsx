'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  intensity?: 'light' | 'medium' | 'heavy'
}

export function GlassCard({
  children,
  className = '',
  hover = true,
  glow = false,
  intensity = 'medium',
}: GlassCardProps) {
  const intensityStyles = {
    light: 'bg-white/5 backdrop-blur-sm border-white/10',
    medium: 'bg-white/10 backdrop-blur-md border-white/20',
    heavy: 'bg-white/20 backdrop-blur-xl border-white/30',
  }

  return (
    <motion.div
      className={cn(
        'relative rounded-2xl border',
        intensityStyles[intensity],
        glow && 'shadow-2xl shadow-emerald-500/10',
        className
      )}
      whileHover={
        hover
          ? {
              scale: 1.01,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }
          : undefined
      }
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
      {glow && (
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-emerald-500/20 via-sapphire-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
      )}
    </motion.div>
  )
}
