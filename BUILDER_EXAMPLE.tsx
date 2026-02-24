'use client'

/**
 * EXAMPLE: Updated Builder Page with Sticky Preview
 * 
 * This shows how to implement StickyBuilderLayout
 * to keep preview fixed while form scrolls
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, User, Sparkles, Briefcase, GraduationCap, Wrench, Award } from 'lucide-react'

// New layout components
import { StickyBuilderLayout } from '@/components/StickyBuilderLayout'
import { PreviewContainer } from '@/components/PreviewContainer'
import { LivePreviewHeader } from '@/components/LivePreviewHeader'
import { StepNavigator } from '@/components/StepNavigator'
import { FormSection } from '@/components/FormSection'
import { GlowButton } from '@/components/animations/GlowButton'

// Existing components
import { Navbar } from '@/components/Navbar'
import { ResumeTemplate } from '@/components/templates'

const steps = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'summary', label: 'Summary', icon: Sparkles },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Wrench },
    { id: 'certifications', label: 'Certifications', icon: Award },
]

export default function Builder() {
    const [currentStep, setCurrentStep] = useState(0)
    const [isExporting, setIsExporting] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    // Your state and handlers here
    const handleExportPDF = async () => {
        setIsExporting(true)
        // Your export logic
        setTimeout(() => setIsExporting(false), 1000)
    }

    const handleExportATS = async () => {
        setIsExporting(true)
        // Your export logic
        setTimeout(() => setIsExporting(false), 1000)
    }

    const handleExportJSON = () => {
        // Your export logic
    }

    const handleUploadResume = () => {
        // Your upload logic
    }

    // LEFT SIDEBAR - Scrollable Form
    const sidebarContent = (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-b from-white to-transparent dark:from-gray-900 dark:to-transparent pt-6 pb-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                    Build Your Resume
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Step {currentStep + 1} of {steps.length}
                </p>
            </div>

            {/* Step Navigator */}
            <StepNavigator
                steps={steps}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
            />

            {/* Form Content */}
            <div className="space-y-6">
                {currentStep === 0 && (
                    <FormSection
                        icon={User}
                        title="Personal Information"
                        description="Let's start with your basic information"
                        step={currentStep}
                        totalSteps={steps.length}
                    >
                        <div className="space-y-4">
                            {/* Your form fields here */}
                            <input
                                type="text"
                                placeholder="First Name"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                            />
                        </div>
                    </FormSection>
                )}

                {currentStep === 1 && (
                    <FormSection
                        icon={Sparkles}
                        title="Professional Summary"
                        description="Write a brief overview of your career"
                        step={currentStep}
                        totalSteps={steps.length}
                    >
                        <textarea
                            placeholder="Your professional summary..."
                            rows={5}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                        />
                    </FormSection>
                )}

                {currentStep === 2 && (
                    <FormSection
                        icon={Briefcase}
                        title="Work Experience"
                        description="Add your professional experience"
                        step={currentStep}
                        totalSteps={steps.length}
                    >
                        <p className="text-gray-600 dark:text-gray-400">Experience form here...</p>
                    </FormSection>
                )}

                {currentStep === 3 && (
                    <FormSection
                        icon={GraduationCap}
                        title="Education"
                        description="Add your educational background"
                        step={currentStep}
                        totalSteps={steps.length}
                    >
                        <p className="text-gray-600 dark:text-gray-400">Education form here...</p>
                    </FormSection>
                )}

                {currentStep === 4 && (
                    <FormSection
                        icon={Wrench}
                        title="Skills"
                        description="List your professional skills"
                        step={currentStep}
                        totalSteps={steps.length}
                    >
                        <p className="text-gray-600 dark:text-gray-400">Skills form here...</p>
                    </FormSection>
                )}

                {currentStep === 5 && (
                    <FormSection
                        icon={Award}
                        title="Certifications"
                        description="Add your certifications and awards"
                        step={currentStep}
                        totalSteps={steps.length}
                    >
                        <p className="text-gray-600 dark:text-gray-400">Certifications form here...</p>
                    </FormSection>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-all"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                </motion.button>

                {currentStep < steps.length - 1 ? (
                    <motion.button
                        onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
                    >
                        Next
                        <ChevronRight className="w-5 h-5" />
                    </motion.button>
                ) : (
                    <GlowButton className="flex-1">
                        Preview Resume
                    </GlowButton>
                )}
            </div>
        </div>
    )

    // RIGHT PREVIEW - Fixed (Never Scrolls!)
    const previewContent = (
        <PreviewContainer>
            <LivePreviewHeader
                onExportPDF={handleExportPDF}
                onExportATS={handleExportATS}
                onExportJSON={handleExportJSON}
                onUploadResume={handleUploadResume}
                isExporting={isExporting}
                isUploading={isUploading}
            />

            {/* Resume Preview Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Your resume template here */}
                    <div className="p-8 space-y-4 text-gray-800 dark:text-gray-200">
                        <h2 className="text-3xl font-bold">Resume Preview</h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Your live resume preview will appear here
                        </p>
                    </div>
                </motion.div>
            </div>
        </PreviewContainer>
    )

    // MAIN LAYOUT
    return (
        <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
            <Navbar />

            <StickyBuilderLayout
                sidebar={sidebarContent}
                preview={previewContent}
            />
        </main>
    )
}
