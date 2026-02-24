'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface PreviewContainerProps {
    children: ReactNode
    className?: string
}

export function PreviewContainer({
    children,
    className = ''
}: PreviewContainerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`
        hidden md:flex md:flex-col
        h-screen fixed right-0 top-0
        w-full md:w-[50%] lg:w-[45%]
        bg-gradient-to-br from-white via-gray-50 to-gray-100
        dark:from-gray-950 dark:via-gray-900 dark:to-gray-800
        border-l border-gray-200 dark:border-gray-700
        backdrop-blur-sm z-40
        ${className}
      `}
        >
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative flex flex-col h-full overflow-hidden">
                {children}
            </div>
        </motion.div>
    )
}
