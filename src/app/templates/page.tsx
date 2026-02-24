'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Search, Crown, Sparkles, Eye, Check } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { SlideIn } from '@/components/animations/SlideIn'
import { TiltCard } from '@/components/animations/TiltCard'
import { GlowButton } from '@/components/animations/GlowButton'
import { GlassCard } from '@/components/ui/GlassCard'
import { GradientText } from '@/components/ui/GradientText'
import { Badge } from '@/components/ui/Badge'
import { templates } from '@/lib/templates'
import { sampleResumeData } from '@/lib/sampleResumeData'
import { Template } from '@/types'

const ResumeTemplate = dynamic(
  () => import('@/components/templates').then((m) => m.ResumeTemplate),
  { ssr: false }
)

const categories = ['All', 'Modern', 'Executive', 'Creative', 'Minimal', 'Tech'] as const

// Live scaled preview that renders the real template with sample data
function ScaledTemplatePreview({ templateId, scale = 0.33 }: { templateId: string; scale?: number }) {
  return (
    <div
      className="relative"
      style={{ width: `calc(${scale} * 210mm)`, height: `calc(${scale} * 297mm)`, overflow: 'hidden' }}
    >
      <div
        style={{ width: '210mm', height: '297mm', transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        <ResumeTemplate templateId={templateId} />
      </div>
    </div>
  )
}

function LazyScaledTemplatePreview({ templateId, scale }: { templateId: string; scale: number }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = hostRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(true)
            observer.disconnect()
            break
          }
        }
      },
      { root: null, rootMargin: '250px', threshold: 0.01 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const template = templates.find((t) => t.id === templateId)

  return (
    <div ref={hostRef} className="w-full h-full flex items-center justify-center">
      {active || !template ? (
        <ScaledTemplatePreview templateId={templateId} scale={scale} />
      ) : (
        <TemplateThumbnail template={template} />
      )}
    </div>
  )
}

function TemplateThumbnail({ template }: { template: Template }) {
  const bg = template.colors?.[0] || '#f3f4f6'
  const accent = template.colors?.[2] || '#111827'
  const name = `${sampleResumeData.personalInfo.firstName} ${sampleResumeData.personalInfo.lastName}`.trim()
  const title = sampleResumeData.personalInfo.title
  const contact = [
    sampleResumeData.personalInfo.email,
    sampleResumeData.personalInfo.phone,
    sampleResumeData.personalInfo.location,
  ]
    .filter(Boolean)
    .join(' | ')
  const summary = sampleResumeData.summary
  const skills = sampleResumeData.skills.slice(0, 6).map((s) => s.name).join(' | ')

  return (
    <div
      className="w-full h-full rounded-lg border border-gray-200/60 dark:border-gray-700/60 overflow-hidden bg-white"
      style={{ background: `linear-gradient(180deg, ${bg} 0%, #ffffff 55%)` }}
    >
      <div className="px-4 py-3" style={{ backgroundColor: bg }}>
        <div className="text-[11px] font-semibold tracking-wide text-gray-900">{name || 'Your Name'}</div>
        <div className="text-[10px] text-gray-700 mt-0.5">{title || 'Your Title'}</div>
        <div className="text-[9px] text-gray-600 mt-1 truncate">{contact || 'email | phone | location'}</div>
      </div>
      <div className="p-4">
        <div className="text-[9px] font-semibold text-gray-700 mb-1" style={{ color: accent, opacity: 0.9 }}>
          SUMMARY
        </div>
        <div className="text-[9px] text-gray-700 leading-snug h-[54px] overflow-hidden">
          {summary || 'Write a short professional summary...'}
        </div>

        <div className="mt-3 text-[9px] font-semibold text-gray-700 mb-1" style={{ color: accent, opacity: 0.9 }}>
          SKILLS
        </div>
        <div className="text-[9px] text-gray-700 leading-snug h-[28px] overflow-hidden">
          {skills || 'Skill 1 | Skill 2 | Skill 3'}
        </div>
      </div>
    </div>
  )
}

// TemplateStaticPreview removed (unused)

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)

  // Memoize filtered templates for performance
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SlideIn className="text-center mb-12">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Premium Collection
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Choose Your{' '}
              <GradientText variant="emerald" animate>Perfect Template</GradientText>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Professionally designed templates optimized for ATS systems and crafted for different industries.
            </p>
          </SlideIn>

          {/* Search & Filter */}
          <SlideIn delay={0.1}>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between max-w-4xl mx-auto mb-12">
              {/* Search */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </div>
          </SlideIn>

          {/* Templates Grid */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TemplateCard
                    template={template}
                    onPreview={() => setPreviewTemplate(template)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-600 dark:text-gray-400">
                No templates found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* AI Recommendation Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-blue-500/5 to-purple-500/5" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassCard className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    AI-Powered
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Not sure which template to choose?
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Our AI can analyze your industry, experience level, and target role to recommend the perfect template for you.
                </p>
                <GlowButton>
                  Get AI Recommendation
                </GlowButton>
              </div>
              <div className="w-full md:w-64">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-emerald-500" />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Preview Modal - Only render when needed */}
      <AnimatePresence>
        {previewTemplate && (
          <PreviewModal
            template={previewTemplate}
            onClose={() => setPreviewTemplate(null)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}

// Separate component for modal to prevent unnecessary renders
function PreviewModal({ template, onClose }: { template: Template; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">{template.name}</h3>
            <p className="text-sm text-gray-600">{template.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            Close
          </button>
        </div>
        <div className="p-4 bg-gray-100 overflow-y-auto max-h-[70vh] flex justify-center">
          <div className="bg-white shadow-lg p-0 max-w-[210mm] overflow-hidden">
            <ScaledTemplatePreview templateId={template.id} scale={0.9} />
          </div>
        </div>
        <div className="p-6 border-t flex gap-3">
          <Link href={`/builder?template=${template.id}`} className="flex-1">
            <GlowButton className="w-full justify-center">
              <Check className="w-4 h-4 mr-2" />
              Use This Template
            </GlowButton>
          </Link>
          <Link href={`/builder?template=${template.id}&preview=1`} className="flex-1">
            <GlowButton variant="outline" className="w-full justify-center">
              <Eye className="w-4 h-4 mr-2" />
              Preview With My Data
            </GlowButton>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}

function TemplateCard({ template, onPreview }: { template: Template; onPreview: () => void }) {
  return (
    <TiltCard className="group h-full">
      <GlassCard className="h-full overflow-hidden hover:border-emerald-500/30 transition-colors">
        {/* Preview Container */}
        <div className="relative aspect-[210/297] bg-gray-50 dark:bg-gray-900 overflow-hidden p-0">
          <div className="w-full h-full rounded-lg shadow-lg overflow-hidden flex items-center justify-center">
            <LazyScaledTemplatePreview templateId={template.id} scale={0.45} />
          </div>

          {/* Hover Overlay */}
          <motion.div
            className="absolute inset-0 bg-emerald-500/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity p-4 z-10"
            initial={false}
          >
            <Link href={`/builder?template=${template.id}`} className="w-full max-w-[200px]">
              <GlowButton className="w-full justify-center">
                Use Template
              </GlowButton>
            </Link>
            <motion.button
              onClick={onPreview}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white/20 text-white font-medium hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="w-4 h-4" />
              Preview
            </motion.button>
          </motion.div>

          {/* Premium Badge */}
          {template.premium && (
            <div className="absolute top-4 right-4 z-20">
              <Badge variant="warning" className="flex items-center gap-1">
                <Crown className="w-3 h-3" />
                Premium
              </Badge>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold">{template.name}</h3>
            <Badge variant="default" size="sm">{template.category}</Badge>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {template.description}
          </p>

          {/* Color Palette */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Colors:</span>
            <div className="flex gap-1">
              {template.colors.slice(0, 3).map((color, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full border border-gray-200 dark:border-gray-700"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </TiltCard>
  )
}
