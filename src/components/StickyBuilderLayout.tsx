'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface StickyBuilderLayoutProps {
    sidebar: ReactNode
    preview: ReactNode
    className?: string
}

/**
 * Sticky Builder Layout
 * - Left side: Scrollable form
 * - Right side: Fixed sticky preview
 * - Perfect for resume builder
 */
export function StickyBuilderLayout({
    sidebar,
    preview,
    className = '',
}: StickyBuilderLayoutProps) {
    return (
        <div className={`flex h-screen bg-gray-50 dark:bg-[#0a0a0a] ${className}`}>
            {/* Left Side - Scrollable Form */}
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full md:w-[50%] lg:w-[55%] overflow-y-auto overflow-x-hidden bg-white dark:bg-gray-900"
            >
                <div className="max-w-3xl mx-auto">
                    {sidebar}
                </div>
            </motion.div>

            {/* Right Side - Sticky Preview */}
            <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="hidden md:flex md:w-[50%] lg:w-[45%] fixed right-0 top-0 h-screen"
            >
                {preview}
            </motion.div>

            {/* Mobile - Full width stacked */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-1/3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 overflow-y-auto rounded-t-3xl shadow-2xl">
                <div className="p-4">{preview}</div>
            </div>
        </div>
    )
}
