'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import { useResume } from '@/hooks/useResume'
import { ResumeCard } from '@/components/ResumeCard'
import { GlassCard } from '@/components/ui/GlassCard'
import { Input } from '@/components/ui/Input'
import { GlowButton } from '@/components/animations/GlowButton'
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer'
import { Resume } from '@/types'

export function ResumePreview() {
    const { resumes, loading, error, fetchResumes, deleteResume } = useResume()
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredResumes, setFilteredResumes] = useState<Resume[]>([])

    useEffect(() => {
        fetchResumes()
    }, [fetchResumes])

    // Filter resumes based on search term
    useEffect(() => {
        if (!resumes) {
            setFilteredResumes([])
            return
        }

        const filtered = resumes.filter(
            (resume: Resume) =>
                resume.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resume.personalInfo?.firstName
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                resume.personalInfo?.lastName
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
        )
        setFilteredResumes(filtered)
    }, [searchTerm, resumes])

    const handleEdit = (resumeId: string) => {
        window.location.href = `/builder?id=${resumeId}`
    }

    const handleDelete = async (resumeId: string) => {
        const success = await deleteResume(resumeId)
        if (success) {
            setFilteredResumes(filteredResumes.filter((r) => (r.id || r._id) !== resumeId))
        }
    }

    return (
        <div className="w-full py-8">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent mb-2">
                            My Resumes
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage and preview all your resumes
                        </p>
                    </div>
                    <Link href="/builder">
                        <GlowButton className="flex items-center gap-2">
                            <Plus className="w-5 h-5" />
                            New Resume
                        </GlowButton>
                    </Link>
                </div>

                {/* Search and Filter */}
                <div className="flex gap-4 items-center">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="Search by name, title, or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12"
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </motion.button>
                </div>
            </motion.div>

            {/* Loading State */}
            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center items-center py-12"
                >
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                </motion.div>
            )}

            {/* Error State */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <GlassCard className="bg-red-50/50 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-6">
                        <p className="text-red-700 dark:text-red-300 font-semibold">{error}</p>
                    </GlassCard>
                </motion.div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredResumes.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <GlassCard className="p-12 text-center">
                        <div className="text-6xl mb-4">📄</div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {searchTerm ? 'No resumes found' : 'No resumes yet'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {searchTerm
                                ? 'Try adjusting your search terms'
                                : 'Create your first resume to get started'}
                        </p>
                        {!searchTerm && (
                            <Link href="/builder">
                                <GlowButton>Create First Resume</GlowButton>
                            </Link>
                        )}
                    </GlassCard>
                </motion.div>
            )}

            {/* Resume Cards Grid */}
            {!loading && !error && filteredResumes.length > 0 && (
                <StaggerContainer>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResumes.map((resume) => (
                            <StaggerItem key={resume.id || resume._id}>
                                <ResumeCard
                                    resume={{
                                        ...resume,
                                        id: (resume.id ?? resume._id ?? ''),
                                    }}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            </StaggerItem>
                        ))}
                    </div>
                </StaggerContainer>
            )}

            {/* Stats Footer */}
            {!loading && !error && filteredResumes.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <GlassCard className="p-4 text-center">
                            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                {filteredResumes.length}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Total Resumes
                            </p>
                        </GlassCard>
                        <GlassCard className="p-4 text-center">
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {filteredResumes.reduce((sum, r) => sum + (r.experience?.length || 0), 0)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Jobs Listed
                            </p>
                        </GlassCard>
                        <GlassCard className="p-4 text-center">
                            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                {filteredResumes.reduce((sum, r) => sum + (r.education?.length || 0), 0)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Education
                            </p>
                        </GlassCard>
                        <GlassCard className="p-4 text-center">
                            <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                                {filteredResumes.reduce((sum, r) => sum + (r.skills?.length || 0), 0)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Skills
                            </p>
                        </GlassCard>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
