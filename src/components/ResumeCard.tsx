'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Trash2, Edit2, Eye, Share2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Resume } from '@/types'

interface ResumeCardProps {
    resume: Resume
    onDelete?: (id: string) => void
    onEdit?: (id: string) => void
}

// Helper function to format date
function getTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`
    return `${Math.floor(seconds / 2592000)}m ago`
}

export function ResumeCard({ resume, onDelete, onEdit }: ResumeCardProps) {
    // Handle both MongoDB _id and standard id
    const resumeId = resume._id || resume.id

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault()
        if (onDelete && confirm('Are you sure you want to delete this resume?')) {
            onDelete(resumeId)
        }
    }

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault()
        if (onEdit) {
            onEdit(resumeId)
        }
    }

    const createdDate = resume.createdAt
        ? getTimeAgo(resume.createdAt)
        : 'Recently'

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="group"
        >
            <Link href={`/builder?id=${resumeId}`}>
                <GlassCard className="h-full cursor-pointer overflow-hidden hover:border-emerald-500/50 dark:hover:border-emerald-400/50 transition-all">
                    {/* Header with gradient */}
                    <div className="h-24 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 flex items-center justify-between px-6">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {resume.name || 'Untitled Resume'}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {createdDate}
                            </p>
                        </div>
                        <div className="text-3xl opacity-20">📄</div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                        {/* Personal Info Preview */}
                        {resume.personalInfo && (
                            <div className="space-y-2">
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    {resume.personalInfo.firstName} {resume.personalInfo.lastName}
                                </p>
                                {resume.personalInfo.title && (
                                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                                        {resume.personalInfo.title}
                                    </p>
                                )}
                                {resume.personalInfo.email && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {resume.personalInfo.email}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-center">
                                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                    {resume.experience?.length || 0}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Jobs</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                    {resume.education?.length || 0}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Education</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                    {resume.skills?.length || 0}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Skills</p>
                            </div>
                        </div>

                        {/* Template Badge */}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                Template: <span className="text-emerald-600 dark:text-emerald-400">{resume.templateId}</span>
                            </p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
                        <div className="flex gap-2">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleEdit}
                                className="p-2 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                                title="Edit resume"
                            >
                                <Edit2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => e.preventDefault()}
                                className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                title="Preview resume"
                            >
                                <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => e.preventDefault()}
                                className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                                title="Share resume"
                            >
                                <Share2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </motion.button>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleDelete}
                            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                            title="Delete resume"
                        >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </motion.button>
                    </div>
                </GlassCard>
            </Link>
        </motion.div>
    )
}
