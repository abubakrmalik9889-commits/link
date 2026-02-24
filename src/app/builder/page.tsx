'use client'

import { useState, useRef, useEffect, useMemo, Suspense, useDeferredValue, type ChangeEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Award,
  ChevronRight,
  ChevronLeft,
  Download,
  Sparkles,
  Eye,
  LayoutTemplate,
  Search,
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { GlassCard } from '@/components/ui/GlassCard'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { GlowButton } from '@/components/animations/GlowButton'
import { FadeIn } from '@/components/animations/FadeIn'
import { ResumeTemplate } from '@/components/templates'
import { useResumeStore } from '@/store/resumeStore'
import { useAutosave } from '@/hooks/useAutosave'
import { generateId } from '@/lib/utils'
import { templates } from '@/lib/templates'
import { Resume, Experience, Education, Skill, Certification, CustomSection } from '@/types'

const steps = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'summary', label: 'Summary', icon: Sparkles },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'custom', label: 'Custom Sections', icon: Award },
]

const A4_WIDTH_PX = 794
const A4_HEIGHT_PX = 1123

const createBlankResume = (templateId: string): Resume => ({
  id: generateId(),
  name: 'My Resume',
  templateId,
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    website: '',
    title: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  customSections: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

function resumeHasContent(resume: Resume) {
  const p = resume.personalInfo
  if (
    p.firstName ||
    p.lastName ||
    p.email ||
    p.phone ||
    p.location ||
    p.title ||
    p.linkedIn ||
    p.website
  ) return true
  if (resume.summary) return true
  if (resume.experience.length) return true
  if (resume.education.length) return true
  if (resume.skills.length) return true
  if (resume.projects.length) return true
  if (resume.certifications.length) return true
  if (resume.customSections.length) return true
  return false
}

function TemplateThumbnail({ templateId }: { templateId: string }) {
  const t = templates.find((x) => x.id === templateId)
  const bg = t?.colors?.[0] || '#f3f4f6'
  const accent = t?.colors?.[2] || '#111827'

  return (
    <div
      className="w-full h-full rounded-lg border border-gray-200/60 overflow-hidden bg-white"
      style={{ background: `linear-gradient(180deg, ${bg} 0%, #ffffff 55%)` }}
    >
      <div className="h-10" style={{ backgroundColor: bg }} />
      <div className="p-4 space-y-3">
        <div className="h-3 rounded w-3/5" style={{ backgroundColor: accent, opacity: 0.25 }} />
        <div className="h-2 rounded w-2/5" style={{ backgroundColor: accent, opacity: 0.18 }} />
        <div className="pt-2 space-y-2">
          <div className="h-2 rounded w-full bg-black/10" />
          <div className="h-2 rounded w-11/12 bg-black/10" />
          <div className="h-2 rounded w-10/12 bg-black/10" />
        </div>
        <div className="pt-2 space-y-2">
          <div className="h-2 rounded w-full bg-black/10" />
          <div className="h-2 rounded w-5/6 bg-black/10" />
        </div>
      </div>
    </div>
  )
}

function ScaledResumePreview({
  templateId,
  resume,
  className,
}: {
  templateId: string
  resume: Resume
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.6)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const update = () => {
      const width = el.clientWidth
      const next = Math.max(0.35, Math.min(1, (width - 16) / A4_WIDTH_PX))
      setScale(next)
    }

    update()
    const ro = new ResizeObserver(() => update())
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={containerRef} className={className || ''}>
      <ScaledResumePreviewFixed templateId={templateId} resume={resume} scale={scale} />
    </div>
  )
}

function ScaledResumePreviewFixed({
  templateId,
  resume,
  scale,
}: {
  templateId: string
  resume: Resume
  scale: number
}) {
  return (
    <div className="flex justify-center">
      <div
        className="bg-white shadow-2xl rounded-lg overflow-hidden"
        style={{ width: Math.round(A4_WIDTH_PX * scale), height: Math.round(A4_HEIGHT_PX * scale) }}
      >
        <div
          style={{
            width: A4_WIDTH_PX,
            height: A4_HEIGHT_PX,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <ResumeTemplate templateId={templateId} resume={resume} />
        </div>
      </div>
    </div>
  )
}

function BuilderContent() {
  const searchParams = useSearchParams()
  const urlTemplate = searchParams.get('template')

  const { currentResume, setCurrentResume, lastSaved } = useResumeStore()
  const [isMounted, setIsMounted] = useState(false)
  const [hasAppliedUrlTemplate, setHasAppliedUrlTemplate] = useState(false)

  // Prefer selected resume template; URL template is applied once when opening from templates page.
  const templateId = currentResume?.templateId || urlTemplate || 'executive-rose'
  const previewParam = searchParams.get('preview')
  const previewMode = previewParam === '1' || previewParam === 'true'
  const [currentStep, setCurrentStep] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [showTemplatePicker, setShowTemplatePicker] = useState(false)
  const [templateQuery, setTemplateQuery] = useState('')
  const [hoverTemplateId, setHoverTemplateId] = useState<string | null>(null)
  const [isAiBusy, setIsAiBusy] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const resumeRef = useRef<HTMLDivElement>(null)
  const resumeFileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)
  const [exportError, setExportError] = useState<string | null>(null)

  // Ensure component is mounted (fixes hydration issues with Zustand persist)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleUploadResumeClick = () => resumeFileInputRef.current?.click()

  const onUploadResumeChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setUploadMessage(null)
    if (!file) {
      return
    }
    if (!currentResume) {
      console.warn('No currentResume in state; cannot import')
      setUploadMessage('No active resume to import into. Please create or open a resume first.')
      if (e.target) e.target.value = ''
      return
    }

    setIsUploading(true)
    console.log('Uploading file for parsing:', { name: file.name, type: file.type, size: file.size })

    try {
      // Dynamic import so heavy libs load only in browser
      const parser = await import('@/lib/resumeParser')
      const parsed = await parser.parseResumeFile(file)

      // Replace old resume data completely with parsed data (don't merge with old values)
      const next = {
        ...currentResume,
        name: parsed.name || 'Imported Resume',
        personalInfo: parsed.personalInfo || {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          location: '',
          linkedIn: '',
          website: '',
          title: '',
        },
        summary: parsed.summary || '',
        skills: parsed.skills || [],
        experience: parsed.experience || [],
        education: parsed.education || [],
        certifications: parsed.certifications || [],
        projects: parsed.projects || [],
        customSections: parsed.customSections || [],
        updatedAt: new Date().toISOString(),
      }

      setCurrentResume(next)
      const parsedCounts = {
        experience: parsed.experience?.length || 0,
        education: parsed.education?.length || 0,
        skills: parsed.skills?.length || 0,
        certifications: parsed.certifications?.length || 0,
        projects: parsed.projects?.length || 0,
      }
      setUploadMessage(
        `Imported: ${parsedCounts.experience} experience, ${parsedCounts.education} education, ${parsedCounts.skills} skills, ${parsedCounts.certifications} certifications, ${parsedCounts.projects} projects.`
      )
    } catch (err) {
      console.error('Failed to parse resume', err)
      setUploadMessage('Could not parse uploaded resume. Try a PDF or DOCX file.')
    } finally {
      setIsUploading(false)
      // reset input so same file can be re-selected
      if (e.target) e.target.value = ''
    }
  }

  // Initialize resume with template
  useEffect(() => {
    if (isMounted && (!currentResume || currentResume.id === '')) {
      setCurrentResume(createBlankResume(templateId))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])

  // Apply URL template once (useful when user lands from /templates)
  useEffect(() => {
    if (!currentResume) return

    if (!hasAppliedUrlTemplate && urlTemplate && currentResume.templateId !== urlTemplate) {
      const blank = createBlankResume(urlTemplate)
      setCurrentResume({
        ...blank,
        id: currentResume.id || blank.id,
        name: currentResume.name || blank.name,
      })
      setHasAppliedUrlTemplate(true)
      return
    }

    if (!hasAppliedUrlTemplate) {
      setHasAppliedUrlTemplate(true)
    }

    // If URL requested an immediate preview, open it once the resume is available
    if (previewMode) {
      setShowPreview(true)
    }
  }, [urlTemplate, currentResume, setCurrentResume, previewMode, hasAppliedUrlTemplate])

  // Autosave
  useAutosave(currentResume, 3000)

  const handleExportPDF = async () => {
    if (!currentResume) return
    setIsExporting(true)
    setExportError(null)
    try {
      const previewNode = resumeRef.current
      if (!previewNode) throw new Error('Preview is not available for export')

      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ])

      const canvas = await html2canvas(previewNode, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      })
      const imageData = canvas.toDataURL('image/png')
      const pdfDoc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
      const pageWidth = pdfDoc.internal.pageSize.getWidth()
      const pageHeight = pdfDoc.internal.pageSize.getHeight()
      const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height)
      const renderWidth = canvas.width * ratio
      const renderHeight = canvas.height * ratio
      const x = (pageWidth - renderWidth) / 2
      const y = (pageHeight - renderHeight) / 2
      pdfDoc.addImage(imageData, 'PNG', x, y, renderWidth, renderHeight)
      pdfDoc.save(`${currentResume.name || 'resume'}.pdf`)
    } catch (error) {
      console.error('Export failed:', error)
      setExportError('Export failed. Please keep preview visible and try again.')
    }
    setIsExporting(false)
  }

  const handleExportATSPDF = async () => {
    if (!currentResume) return
    setIsExporting(true)
    setExportError(null)
    try {
      // Lazy-load PDF libraries on first export (not on page load)
      const { pdf } = await import('@react-pdf/renderer')
      const { AtsPdf } = await import('@/components/pdf-templates/AtsPdf')

      const blob = await pdf(<AtsPdf resume={currentResume} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${currentResume.name || 'resume'}_ats.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export ATS PDF failed:', error)
      setExportError('ATS export failed. Please try again.')
    }
    setIsExporting(false)
  }

  const updateResume = (updates: Partial<Resume>) => {
    if (currentResume) {
      setCurrentResume({ ...currentResume, ...updates, updatedAt: new Date().toISOString() })
    }
  }

  const callAi = async (action: 'summary' | 'skills') => {
    if (!currentResume) return
    setAiError(null)
    setIsAiBusy(true)
    try {
      const resp = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, resume: currentResume }),
      })
      const data = await resp.json().catch(() => null)
      if (!resp.ok) {
        setAiError(data?.error || 'AI request failed')
        return
      }

      const content = String(data?.content || '').trim()
      if (!content) {
        setAiError('AI returned empty response')
        return
      }

      if (action === 'summary') {
        updateResume({ summary: content })
        return
      }

      const items = content
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 24)

      const nextSkills: Skill[] = items.map((name) => ({
        id: generateId(),
        name,
        level: 'Intermediate',
      }))

      updateResume({ skills: nextSkills })
    } catch (e) {
      console.error(e)
      setAiError('AI request failed')
    } finally {
      setIsAiBusy(false)
    }
  }

  const deferredResume = useDeferredValue(currentResume)
  const filteredTemplates = useMemo(() => {
    const q = templateQuery.trim().toLowerCase()
    if (!q) return templates
    return templates.filter((t) => {
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      )
    })
  }, [templateQuery])

  if (!isMounted || !currentResume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      <Navbar />

      <div className="pt-20 flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-[#1c1c1e] border-r border-gray-200 dark:border-gray-800 hidden lg:block">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Resume Sections
            </h2>
            <nav className="space-y-1">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <motion.button
                    key={step.id}
                    onClick={() => setCurrentStep(index)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${currentStep === index
                      ? 'bg-emerald-500 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{step.label}</span>
                    {currentStep > index && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                        <Sparkles className="w-3 h-3" />
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </nav>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Last saved</span>
              <span>{lastSaved ? new Date(lastSaved).toLocaleTimeString() : 'Never'}</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Form Area */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-8">
            <FadeIn key={currentStep}>
              <GlassCard className="max-w-2xl mx-auto p-6 lg:p-8">
                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex items-center justify-between lg:hidden text-sm text-gray-500">
                    <span>Step {currentStep + 1} of {steps.length}</span>
                    <span className="font-medium text-emerald-600">{steps[currentStep].label}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Template
                      </label>
                      <select
                        value={currentResume.templateId}
                        onChange={(e) => {
                          const nextTemplateId = e.target.value
                          if (nextTemplateId === currentResume.templateId) return
                          const dirty = resumeHasContent(currentResume)
                          if (dirty) {
                            const ok = window.confirm('Changing templates will reset your form. Continue?')
                            if (!ok) return
                          }
                          setCurrentResume(createBlankResume(nextTemplateId))
                          setCurrentStep(0)
                        }}
                        className="px-3 py-2 rounded-lg border bg-white dark:bg-gray-900 text-sm"
                      >
                        {templates.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="text-xs text-gray-500">
                      {lastSaved ? `Saved ${new Date(lastSaved).toLocaleTimeString()}` : 'Saving...'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                      {steps[currentStep].label}
                    </h1>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        Step {currentStep + 1} of {steps.length}
                      </span>
                    </div>
                  </div>
                  {exportError && <div className="text-sm text-red-600">{exportError}</div>}
                </div>

                {/* Form Content */}
                <div className="space-y-6">
                  {currentStep === 0 && (
                    <PersonalInfoForm
                      data={currentResume.personalInfo}
                      onChange={(personalInfo) => updateResume({ personalInfo })}
                    />
                  )}
                  {currentStep === 1 && (
                    <SummaryForm
                      data={currentResume.summary}
                      onChange={(summary) => updateResume({ summary })}
                      onGenerate={() => callAi('summary')}
                      isBusy={isAiBusy}
                      error={aiError}
                    />
                  )}
                  {currentStep === 2 && (
                    <ExperienceForm
                      data={currentResume.experience}
                      onChange={(experience) => updateResume({ experience })}
                    />
                  )}
                  {currentStep === 3 && (
                    <EducationForm
                      data={currentResume.education}
                      onChange={(education) => updateResume({ education })}
                    />
                  )}
                  {currentStep === 4 && (
                    <SkillsForm
                      data={currentResume.skills}
                      onChange={(skills) => updateResume({ skills })}
                      onSuggest={() => callAi('skills')}
                      isBusy={isAiBusy}
                      error={aiError}
                    />
                  )}
                  {currentStep === 5 && (
                    <CertificationsForm
                      data={currentResume.certifications}
                      onChange={(certifications) => updateResume({ certifications })}
                    />
                  )}
                  {currentStep === 6 && (
                    <CustomSectionsForm
                      data={currentResume.customSections}
                      onChange={(customSections) => updateResume({ customSections })}
                    />
                  )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <GlowButton
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </GlowButton>

                  {currentStep < steps.length - 1 ? (
                    <GlowButton
                      onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </GlowButton>
                  ) : (
                    <GlowButton onClick={() => setShowPreview(true)}>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </GlowButton>
                  )}
                </div>
              </GlassCard>
            </FadeIn>
          </div>

          {/* Preview Area */}
          <div className="hidden xl:block w-[45%] bg-gray-100 dark:bg-gray-900 p-8 overflow-y-auto">
            <div className="sticky top-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Live Preview</h3>
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <motion.button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download className="w-4 h-4" />
                    {isExporting ? 'Exporting...' : 'Export PDF'}
                  </motion.button>
                  <motion.button
                    onClick={handleExportATSPDF}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download className="w-4 h-4" />
                    Export ATS
                  </motion.button>
                  <motion.button
                    onClick={handleUploadResumeClick}
                    disabled={isUploading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-900 border text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isUploading ? 'Uploading...' : 'Upload Resume'}
                  </motion.button>
                  <motion.button
                    onClick={() => setShowTemplatePicker(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-900 border text-sm font-medium hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <LayoutTemplate className="w-4 h-4" />
                    Templates
                  </motion.button>
                  <input
                    ref={resumeFileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    onChange={onUploadResumeChange}
                    className="hidden"
                  />

                  {uploadMessage && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{uploadMessage}</p>
                  )}
                </div>
              </div>

              <div ref={resumeRef}>
                <ScaledResumePreview templateId={templateId} resume={deferredResume || currentResume} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Picker Modal */}
      <AnimatePresence>
        {showTemplatePicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowTemplatePicker(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="mx-auto max-w-6xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b flex items-center gap-3">
                <div className="flex-1">
                  <div className="text-lg font-semibold">Choose a Template</div>
                  <div className="text-sm text-gray-600">Click a template to apply it to your resume.</div>
                </div>
                <div className="relative w-[360px] max-w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={templateQuery}
                    onChange={(e) => setTemplateQuery(e.target.value)}
                    placeholder="Search templates..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                  />
                </div>
                <button
                  onClick={() => setShowTemplatePicker(false)}
                  className="px-3 py-2 rounded-xl border text-sm hover:bg-gray-50"
                >
                  Close
                </button>
              </div>

              <div className="p-4 overflow-y-auto max-h-[calc(90vh-72px)]">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map((t) => (
                    <button
                      key={t.id}
                      className="text-left group"
                      onMouseEnter={() => setHoverTemplateId(t.id)}
                      onMouseLeave={() => setHoverTemplateId((cur) => (cur === t.id ? null : cur))}
                      onFocus={() => setHoverTemplateId(t.id)}
                      onBlur={() => setHoverTemplateId((cur) => (cur === t.id ? null : cur))}
                      onClick={() => {
                        const dirty = resumeHasContent(currentResume)
                        if (dirty) {
                          const ok = window.confirm('Changing templates will reset your form. Continue?')
                          if (!ok) return
                        }
                        setCurrentResume(createBlankResume(t.id))
                        setCurrentStep(0)
                        setShowTemplatePicker(false)
                      }}
                    >
                      <div className="rounded-2xl border bg-gray-50 overflow-hidden">
                        <div className="aspect-[210/297] p-3 flex items-center justify-center">
                          <div className="w-full h-full rounded-lg overflow-hidden shadow">
                            {hoverTemplateId === t.id ? (
                              <ScaledResumePreviewFixed templateId={t.id} resume={createBlankResume(t.id)} scale={0.22} />
                            ) : (
                              <TemplateThumbnail templateId={t.id} />
                            )}
                          </div>
                        </div>
                        <div className="p-4 bg-white">
                          <div className="flex items-center justify-between gap-3">
                            <div className="font-semibold">{t.name}</div>
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">{t.category}</span>
                          </div>
                          <div className="text-sm text-gray-600 mt-2 line-clamp-2">{t.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm xl:hidden"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="absolute inset-x-0 bottom-0 h-[90vh] bg-white dark:bg-gray-900 rounded-t-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">Preview</h3>
                <div className="flex gap-2">
                  <GlowButton size="sm" onClick={handleExportPDF}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </GlowButton>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="h-full overflow-y-auto p-4" ref={resumeRef}>
                <ScaledResumePreview templateId={templateId} resume={deferredResume || currentResume} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main >
  )
}

// Form Components
function PersonalInfoForm({ data, onChange }: { data: Resume['personalInfo'], onChange: (data: Resume['personalInfo']) => void }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Input
        label="First Name"
        value={data.firstName}
        onChange={(e) => onChange({ ...data, firstName: e.target.value })}
        placeholder="John"
        required
      />
      <Input
        label="Last Name"
        value={data.lastName}
        onChange={(e) => onChange({ ...data, lastName: e.target.value })}
        placeholder="Doe"
        required
      />
      <Input
        label="Professional Title"
        value={data.title}
        onChange={(e) => onChange({ ...data, title: e.target.value })}
        placeholder="Senior Software Engineer"
        className="md:col-span-2"
        required
      />
      <Input
        label="Email"
        type="email"
        value={data.email}
        onChange={(e) => onChange({ ...data, email: e.target.value })}
        placeholder="john@example.com"
        required
      />
      <Input
        label="Phone"
        value={data.phone}
        onChange={(e) => onChange({ ...data, phone: e.target.value })}
        placeholder="+1 234 567 890"
        required
      />
      <Input
        label="Location"
        value={data.location}
        onChange={(e) => onChange({ ...data, location: e.target.value })}
        placeholder="New York, NY"
        className="md:col-span-2"
        required
      />
      <Input
        label="LinkedIn (optional)"
        value={data.linkedIn || ''}
        onChange={(e) => onChange({ ...data, linkedIn: e.target.value })}
        placeholder="linkedin.com/in/johndoe"
        className="md:col-span-2"
      />
      <Input
        label="Website (optional)"
        value={data.website || ''}
        onChange={(e) => onChange({ ...data, website: e.target.value })}
        placeholder="https://yourportfolio.com"
        className="md:col-span-2"
      />
    </div>
  )
}

function SummaryForm({
  data,
  onChange,
  onGenerate,
  isBusy,
  error,
}: {
  data: string
  onChange: (data: string) => void
  onGenerate: () => void
  isBusy: boolean
  error: string | null
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">Professional Summary</label>
        <motion.button
          onClick={onGenerate}
          disabled={isBusy}
          className="flex items-center gap-1 text-sm text-emerald-500 hover:text-emerald-600"
          whileHover={{ scale: 1.02 }}
        >
          <Sparkles className="w-4 h-4" />
          {isBusy ? 'Generating...' : 'AI Generate'}
        </motion.button>
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <Textarea
        value={data}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write a compelling summary of your professional background and key achievements..."
        rows={6}
      />
      <p className="text-sm text-gray-500">
        Tip: Keep your summary concise (3-5 sentences) and highlight your most relevant skills and achievements.
      </p>
    </div>
  )
}

function ExperienceForm({ data, onChange }: { data: Experience[], onChange: (data: Experience[]) => void }) {
  const addExperience = () => {
    onChange([
      ...data,
      {
        id: generateId(),
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        achievements: [''],
      },
    ])
  }

  const updateExperience = (index: number, updates: Partial<Experience>) => {
    const newData = [...data]
    newData[index] = { ...newData[index], ...updates }
    onChange(newData)
  }

  const removeExperience = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const duplicateExperience = (index: number) => {
    const target = data[index]
    const copy: Experience = { ...target, id: generateId() }
    onChange([...data.slice(0, index + 1), copy, ...data.slice(index + 1)])
  }

  return (
    <div className="space-y-6">
      {data.map((exp, index) => (
        <GlassCard key={exp.id} className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Experience {index + 1}</h4>
            <div className="flex items-center gap-3">
              <button
                onClick={() => duplicateExperience(index)}
                className="text-emerald-600 hover:text-emerald-700 text-sm"
              >
                Duplicate
              </button>
              <button
                onClick={() => removeExperience(index)}
                className="text-red-500 hover:text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Company"
              value={exp.company}
              onChange={(e) => updateExperience(index, { company: e.target.value })}
              placeholder="Company Name"
            />
            <Input
              label="Position"
              value={exp.position}
              onChange={(e) => updateExperience(index, { position: e.target.value })}
              placeholder="Job Title"
            />
            <Input
              label="Start Date"
              value={exp.startDate}
              onChange={(e) => updateExperience(index, { startDate: e.target.value })}
              placeholder="Jan 2020"
            />
            <Input
              label="End Date"
              value={exp.endDate}
              onChange={(e) => updateExperience(index, { endDate: e.target.value })}
              placeholder="Dec 2023 or Present"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Key Achievements</label>
            {exp.achievements.map((achievement, achIndex) => (
              <div key={achIndex} className="flex gap-2 mb-2">
                <Input
                  value={achievement}
                  onChange={(e) => {
                    const newAchievements = [...exp.achievements]
                    newAchievements[achIndex] = e.target.value
                    updateExperience(index, { achievements: newAchievements })
                  }}
                  placeholder="Describe your achievement..."
                />
              </div>
            ))}
            <motion.button
              onClick={() => updateExperience(index, { achievements: [...exp.achievements, ''] })}
              className="text-sm text-emerald-500 hover:text-emerald-600"
              whileHover={{ scale: 1.02 }}
            >
              + Add Achievement
            </motion.button>
          </div>
        </GlassCard>
      ))}
      <GlowButton variant="outline" onClick={addExperience} className="w-full">
        + Add Experience
      </GlowButton>
    </div>
  )
}

function EducationForm({ data, onChange }: { data: Education[], onChange: (data: Education[]) => void }) {
  const addEducation = () => {
    onChange([
      ...data,
      {
        id: generateId(),
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
      },
    ])
  }

  const updateEducation = (index: number, updates: Partial<Education>) => {
    const newData = [...data]
    newData[index] = { ...newData[index], ...updates }
    onChange(newData)
  }

  const removeEducation = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const duplicateEducation = (index: number) => {
    const target = data[index]
    const copy: Education = { ...target, id: generateId() }
    onChange([...data.slice(0, index + 1), copy, ...data.slice(index + 1)])
  }

  return (
    <div className="space-y-6">
      {data.map((edu, index) => (
        <GlassCard key={edu.id} className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Education {index + 1}</h4>
            <div className="flex items-center gap-3">
              <button
                onClick={() => duplicateEducation(index)}
                className="text-emerald-600 hover:text-emerald-700 text-sm"
              >
                Duplicate
              </button>
              <button
                onClick={() => removeEducation(index)}
                className="text-red-500 hover:text-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Institution"
              value={edu.institution}
              onChange={(e) => updateEducation(index, { institution: e.target.value })}
              placeholder="University Name"
              className="md:col-span-2"
            />
            <Input
              label="Degree"
              value={edu.degree}
              onChange={(e) => updateEducation(index, { degree: e.target.value })}
              placeholder="Bachelor of Science"
            />
            <Input
              label="Field of Study"
              value={edu.field}
              onChange={(e) => updateEducation(index, { field: e.target.value })}
              placeholder="Computer Science"
            />
            <Input
              label="Graduation Year"
              value={edu.endDate}
              onChange={(e) => updateEducation(index, { endDate: e.target.value })}
              placeholder="2023"
            />
          </div>
        </GlassCard>
      ))}
      <GlowButton variant="outline" onClick={addEducation} className="w-full">
        + Add Education
      </GlowButton>
    </div>
  )
}

function SkillsForm({
  data,
  onChange,
  onSuggest,
  isBusy,
  error,
}: {
  data: Skill[]
  onChange: (data: Skill[]) => void
  onSuggest: () => void
  isBusy: boolean
  error: string | null
}) {
  const addSkill = () => {
    onChange([
      ...data,
      { id: generateId(), name: '', level: 'Intermediate' },
    ])
  }

  const updateSkill = (index: number, updates: Partial<Skill>) => {
    const newData = [...data]
    newData[index] = { ...newData[index], ...updates }
    onChange(newData)
  }

  const removeSkill = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">Skills</label>
        <motion.button
          onClick={onSuggest}
          disabled={isBusy}
          className="flex items-center gap-1 text-sm text-emerald-500 hover:text-emerald-600"
          whileHover={{ scale: 1.02 }}
        >
          <Sparkles className="w-4 h-4" />
          {isBusy ? 'Suggesting...' : 'AI Suggest'}
        </motion.button>
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}

      {data.map((skill, index) => (
        <div key={skill.id} className="flex gap-2">
          <Input
            value={skill.name}
            onChange={(e) => updateSkill(index, { name: e.target.value })}
            placeholder="e.g., React, Project Management, Data Analysis"
            className="flex-1"
          />
          <select
            value={skill.level}
            onChange={(e) => updateSkill(index, { level: e.target.value as Skill['level'] })}
            className="px-4 py-2 rounded-xl border bg-white dark:bg-gray-900 text-sm"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
          <button
            onClick={() => removeSkill(index)}
            className="px-3 text-red-500 hover:text-red-600"
          >
            Remove
          </button>
        </div>
      ))}

      <GlowButton variant="outline" onClick={addSkill} className="w-full">
        + Add Skill
      </GlowButton>
    </div>
  )
}

function CertificationsForm({ data, onChange }: { data: Certification[], onChange: (data: Certification[]) => void }) {
  const addCertification = () => {
    onChange([
      ...data,
      { id: generateId(), name: '', issuer: '', date: '' },
    ])
  }

  const updateCertification = (index: number, updates: Partial<Certification>) => {
    const newData = [...data]
    newData[index] = { ...newData[index], ...updates }
    onChange(newData)
  }

  const removeCertification = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {data.map((cert, index) => (
        <GlassCard key={cert.id} className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Certification {index + 1}</h4>
            <button
              onClick={() => removeCertification(index)}
              className="text-red-500 hover:text-red-600 text-sm"
            >
              Remove
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Certification Name"
              value={cert.name}
              onChange={(e) => updateCertification(index, { name: e.target.value })}
              placeholder="e.g., AWS Certified Solutions Architect"
              className="md:col-span-2"
            />
            <Input
              label="Issuing Organization"
              value={cert.issuer}
              onChange={(e) => updateCertification(index, { issuer: e.target.value })}
              placeholder="e.g., Amazon Web Services"
            />
            <Input
              label="Date Obtained"
              value={cert.date}
              onChange={(e) => updateCertification(index, { date: e.target.value })}
              placeholder="Jan 2023"
            />
          </div>
        </GlassCard>
      ))}
      <GlowButton variant="outline" onClick={addCertification} className="w-full">
        + Add Certification
      </GlowButton>
    </div>
  )
}

function CustomSectionsForm({ data, onChange }: { data: CustomSection[], onChange: (data: CustomSection[]) => void }) {
  const addSection = () => {
    onChange([
      ...data,
      { id: generateId(), title: 'Custom Section', items: [''] },
    ])
  }

  const updateSection = (index: number, updates: Partial<CustomSection>) => {
    const next = [...data]
    next[index] = { ...next[index], ...updates }
    onChange(next)
  }

  const removeSection = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {data.map((section, index) => (
        <GlassCard key={section.id} className="p-4">
          <div className="flex items-center justify-between mb-4 gap-3">
            <Input
              label={`Section Title ${index + 1}`}
              value={section.title}
              onChange={(e) => updateSection(index, { title: e.target.value })}
              placeholder="e.g., Projects, Awards, Publications"
              className="flex-1"
              required
            />
            <button
              onClick={() => removeSection(index)}
              className="text-red-500 hover:text-red-600 text-sm mt-7"
            >
              Remove
            </button>
          </div>

          <div className="mt-2">
            <label className="block text-sm font-medium mb-2">Items</label>
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex gap-2 mb-2">
                <Input
                  value={item}
                  onChange={(e) => {
                    const items = [...section.items]
                    items[itemIndex] = e.target.value
                    updateSection(index, { items })
                  }}
                  placeholder="Add a bullet point..."
                  className="flex-1"
                />
                <button
                  onClick={() => {
                    const items = section.items.filter((_, i) => i !== itemIndex)
                    updateSection(index, { items: items.length ? items : [''] })
                  }}
                  className="px-3 text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => updateSection(index, { items: [...section.items, ''] })}
              className="text-sm text-emerald-600 hover:text-emerald-700"
            >
              + Add Item
            </button>
          </div>
        </GlassCard>
      ))}

      <GlowButton variant="outline" onClick={addSection} className="w-full">
        + Add Custom Section
      </GlowButton>
    </div>
  )
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
    </div>}>
      <BuilderContent />
    </Suspense>
  )
}
