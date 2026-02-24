'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface FormSectionProps {
    title: string
    description?: string
    icon: LucideIcon
    children: ReactNode
    step?: number
    totalSteps?: number
}

export function FormSection({
    title,
    description,
    icon: Icon,
    children,
    step,
    totalSteps,
}: FormSectionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 dark:from-emerald-900/20 dark:to-blue-900/20 border border-emerald-200/30 dark:border-emerald-800/30 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white"
                    >
                        <Icon className="w-6 h-6" />
                    </motion.div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {title}
                            </h2>
                            {step !== undefined && totalSteps !== undefined && (
                                <span className="text-sm font-semibold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                                    Step {step + 1} of {totalSteps}
                                </span>
                            )}
                        </div>
                        {description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
            >
                {children}
            </motion.div>
        </motion.div>
    )
}
