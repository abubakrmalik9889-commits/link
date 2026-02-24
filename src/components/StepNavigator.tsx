'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface Step {
    id: string
    label: string
    icon: LucideIcon
}

interface StepNavigatorProps {
    steps: Step[]
    currentStep: number
    onStepClick: (index: number) => void
}

export function StepNavigator({
    steps,
    currentStep,
    onStepClick,
}: StepNavigatorProps) {
    return (
        <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 px-2">
                Build Progress
            </h3>
            <div className="space-y-2">
                {steps.map((step, index) => {
                    const Icon = step.icon
                    const isActive = index === currentStep
                    const isCompleted = index < currentStep

                    return (
                        <motion.button
                            key={step.id}
                            onClick={() => onStepClick(index)}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl
                transition-all duration-200
                ${isActive
                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                    : isCompleted
                                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }
              `}
                        >
                            <motion.div
                                animate={{
                                    scale: isActive ? 1.1 : 1,
                                    rotate: isActive ? 5 : 0,
                                }}
                                className={`
                  p-2 rounded-lg transition-all
                  ${isActive
                                        ? 'bg-white/20'
                                        : isCompleted
                                            ? 'bg-emerald-200 dark:bg-emerald-800/50'
                                            : 'bg-gray-200 dark:bg-gray-700'
                                    }
                `}
                            >
                                <Icon className="w-5 h-5" />
                            </motion.div>

                            <div className="flex-1 text-left">
                                <p className={`
                  text-sm font-semibold
                  ${isActive ? 'text-white' : 'text-inherit'}
                `}>
                                    {step.label}
                                </p>
                            </div>

                            {isCompleted && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-emerald-600 dark:text-emerald-400"
                                >
                                    ✓
                                </motion.div>
                            )}

                            {isActive && (
                                <motion.div
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="w-2 h-2 rounded-full bg-white"
                                />
                            )}
                        </motion.button>
                    )
                })}
            </div>

            {/* Progress Bar */}
            <motion.div className="mt-4 space-y-2">
                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                    />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    {currentStep + 1} of {steps.length} completed
                </p>
            </motion.div>
        </div>
    )
}
