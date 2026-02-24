'use client'

import { Resume } from '@/types'
import { ExecutiveRose } from './ExecutiveRose'
import { ExecutiveNavy } from './ExecutiveNavy'
import { ModernTeal } from './ModernTeal'
import { ModernSlate } from './ModernSlate'
import { CorporateNavy } from './CorporateNavy'
import { MinimalTerracotta } from './MinimalTerracotta'
import { CreativeSidebar } from './CreativeSidebar'
import { sampleResumeData } from '@/lib/sampleResumeData'
import { generateId } from '@/lib/utils'

export const templateComponents = {
  'executive-rose': ExecutiveRose,
  'executive-navy': ExecutiveNavy,
  'modern-teal': ModernTeal,
  'modern-slate': ModernSlate,
  'corporate-navy': CorporateNavy,
  'minimal-terracotta': MinimalTerracotta,
  'creative-sidebar': CreativeSidebar,
}

export type TemplateId = keyof typeof templateComponents

// Create sample resume with the data
export const createSampleResume = (): Resume => ({
  id: generateId(),
  name: 'Sample Resume',
  templateId: 'executive-rose',
  personalInfo: sampleResumeData.personalInfo,
  summary: sampleResumeData.summary,
  experience: sampleResumeData.experience,
  education: sampleResumeData.education,
  skills: sampleResumeData.skills,
  projects: [],
  certifications: sampleResumeData.certifications,
  customSections: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

interface ResumeTemplateProps {
  templateId: string
  resume?: Resume
}

import { forwardRef } from 'react'

export const ResumeTemplate = forwardRef<HTMLDivElement, ResumeTemplateProps>(
  ({ templateId, resume }, ref) => {
    const TemplateComponent = templateComponents[templateId as TemplateId] || ExecutiveRose
    const sampleResume = resume || createSampleResume()

    return <TemplateComponent ref={ref} resume={sampleResume} />
  }
)

ResumeTemplate.displayName = 'ResumeTemplate'

// Export individual templates
export {
  ExecutiveRose,
  ExecutiveNavy,
  ModernTeal,
  ModernSlate,
  CorporateNavy,
  MinimalTerracotta,
  CreativeSidebar,
}
