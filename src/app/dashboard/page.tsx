'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Plus, 
  FileText, 
  Download, 
  Edit2, 
  Trash2, 
  Copy, 
  Sparkles,
  TrendingUp,
  Eye,
  Search,
  Filter
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlowButton } from '@/components/animations/GlowButton'
import { SlideIn } from '@/components/animations/SlideIn'
import { GradientText } from '@/components/ui/GradientText'
import { Badge } from '@/components/ui/Badge'
import { useResumeStore } from '@/store/resumeStore'

// Mock data for demonstration
const mockResumes = [
  {
    id: '1',
    name: 'Software Engineer Resume',
    templateId: 'modern-teal',
    lastModified: '2 hours ago',
    views: 45,
    downloads: 12,
    atsScore: 92,
  },
  {
    id: '2',
    name: 'Product Manager Resume',
    templateId: 'executive-navy',
    lastModified: '1 day ago',
    views: 28,
    downloads: 8,
    atsScore: 88,
  },
  {
    id: '3',
    name: 'UX Designer Resume',
    templateId: 'creative-sidebar',
    lastModified: '3 days ago',
    views: 15,
    downloads: 3,
    atsScore: 85,
  },
]

const recentActivity = [
  { action: 'Resume viewed', item: 'Software Engineer Resume', time: '2 hours ago' },
  { action: 'Downloaded PDF', item: 'Product Manager Resume', time: '5 hours ago' },
  { action: 'ATS score improved', item: 'UX Designer Resume', time: '1 day ago' },
  { action: 'New resume created', item: 'Data Analyst Resume', time: '2 days ago' },
]

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { resumes: _resumes } = useResumeStore()

  const displayResumes = mockResumes.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <SlideIn>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-1">
                  My <GradientText variant="emerald">Resumes</GradientText>
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage and track your resumes
                </p>
              </div>
              <Link href="/builder">
                <GlowButton>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Resume
                </GlowButton>
              </Link>
            </div>
          </SlideIn>

          {/* Stats Overview */}
          <SlideIn delay={0.1}>
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Resumes</p>
                    <p className="text-2xl font-bold">{displayResumes.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-emerald-500" />
                  </div>
                </div>
              </GlassCard>
              
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                    <p className="text-2xl font-bold">88</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </GlassCard>
              
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Downloads</p>
                    <p className="text-2xl font-bold">23</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Download className="w-6 h-6 text-purple-500" />
                  </div>
                </div>
              </GlassCard>
              
              <GlassCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg ATS Score</p>
                    <p className="text-2xl font-bold">88.3</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-amber-500" />
                  </div>
                </div>
              </GlassCard>
            </div>
          </SlideIn>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content - Resumes List */}
            <div className="lg:col-span-2">
              <SlideIn delay={0.2}>
                <GlassCard className="p-6">
                  {/* Search & Filter */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search resumes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                    <motion.button
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Filter className="w-4 h-4" />
                      Filter
                    </motion.button>
                  </div>

                  {/* Resumes Grid */}
                  <div className="space-y-4">
                    {displayResumes.map((resume, index) => (
                      <motion.div
                        key={resume.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-emerald-500/30 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            {/* Thumbnail */}
                            <div className="w-20 h-28 bg-gray-100 dark:bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden">
                              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
                            </div>
                            
                            {/* Info */}
                            <div>
                              <h3 className="font-semibold text-lg mb-1">{resume.name}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Modified {resume.lastModified}
                              </p>
                              <div className="flex items-center gap-3">
                                <Badge variant={resume.atsScore >= 90 ? 'success' : 'warning'}>
                                  ATS: {resume.atsScore}%
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {resume.views} views • {resume.downloads} downloads
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <motion.button
                              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Duplicate"
                            >
                              <Copy className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {displayResumes.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">No resumes found</p>
                      <Link href="/builder">
                        <GlowButton variant="outline" className="mt-4">
                          Create Your First Resume
                        </GlowButton>
                      </Link>
                    </div>
                  )}
                </GlassCard>
              </SlideIn>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AI Suggestions */}
              <SlideIn delay={0.3}>
                <GlassCard className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-semibold">AI Suggestions</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-sm">
                      <p className="font-medium text-emerald-700 dark:text-emerald-400 mb-1">
                        Improve your ATS score
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Add more keywords from the job description to increase your match rate.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-sm">
                      <p className="font-medium text-blue-700 dark:text-blue-400 mb-1">
                        Quantify achievements
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Add numbers and metrics to make your experience more impactful.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </SlideIn>

              {/* Recent Activity */}
              <SlideIn delay={0.4}>
                <GlassCard className="p-6">
                  <h3 className="font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                        <div>
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{activity.item}</p>
                          <p className="text-xs text-gray-400">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </SlideIn>

              {/* Upgrade CTA */}
              <SlideIn delay={0.5}>
                <GlassCard className="p-6 bg-gradient-to-br from-emerald-500/10 to-blue-500/10">
                  <h3 className="font-semibold mb-2">Upgrade to Pro</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Get unlimited resumes, AI writing assistant, and advanced analytics.
                  </p>
                  <Link href="/pricing">
                    <GlowButton size="sm" className="w-full justify-center">
                      View Plans
                    </GlowButton>
                  </Link>
                </GlassCard>
              </SlideIn>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
