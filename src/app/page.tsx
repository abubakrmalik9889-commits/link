'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Sparkles,
  Zap,
  Shield,
  Palette,
  FileText,
  TrendingUp,
  Star,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { FadeIn } from '@/components/animations/FadeIn'
import { SlideIn } from '@/components/animations/SlideIn'
import { FloatingElement } from '@/components/animations/FloatingElement'
import { GlowButton } from '@/components/animations/GlowButton'
import { TiltCard } from '@/components/animations/TiltCard'
import { ParticleBackground } from '@/components/animations/ParticleBackground'
import { GlassCard } from '@/components/ui/GlassCard'
import { GradientText } from '@/components/ui/GradientText'
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer'
import { createSampleResume } from '@/components/templates'
import { Resume } from '@/types'

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Content',
    description: 'Generate professional summaries, bullet points, and ATS-optimized keywords with our advanced AI.',
  },
  {
    icon: Shield,
    title: 'ATS Optimization',
    description: 'Ensure your resume passes Applicant Tracking Systems with our built-in ATS scoring and suggestions.',
  },
  {
    icon: Palette,
    title: 'Premium Templates',
    description: 'Choose from 7+ professionally designed templates, each crafted for different industries and roles.',
  },
  {
    icon: Zap,
    title: 'Real-time Preview',
    description: 'See your changes instantly with our live preview feature as you build your resume.',
  },
  {
    icon: FileText,
    title: 'Multiple Formats',
    description: 'Export your resume as PDF, DOCX, or share via a unique link with potential employers.',
  },
  {
    icon: TrendingUp,
    title: 'Analytics Dashboard',
    description: 'Track views, downloads, and engagement with your resume through our analytics.',
  },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Manager at Google',
    content: 'ResumAI helped me land interviews at top tech companies. The AI suggestions were incredibly helpful!',
    rating: 5,
  },
  {
    name: 'Michael Roberts',
    role: 'Senior Developer at Microsoft',
    content: 'The ATS optimization feature is a game-changer. I finally started getting callbacks after using ResumAI.',
    rating: 5,
  },
  {
    name: 'Emily Watson',
    role: 'Marketing Director',
    content: 'Beautiful templates and the AI writing assistant saved me hours of work. Highly recommended!',
    rating: 5,
  },
]

const stats = [
  { value: '500K+', label: 'Resumes Created' },
  { value: '95%', label: 'Success Rate' },
  { value: '50+', label: 'Countries' },
  { value: '4.9', label: 'User Rating' },
]

const buildPreviewResume = (overrides: Partial<Resume>): Resume => {
  const base = createSampleResume()
  return {
    ...base,
    ...overrides,
    personalInfo: { ...base.personalInfo, ...overrides.personalInfo },
    experience: overrides.experience ?? base.experience,
    education: overrides.education ?? base.education,
    skills: overrides.skills ?? base.skills,
    certifications: overrides.certifications ?? base.certifications,
  }
}

const templatePreviews = [
  {
    name: 'Executive Rose',
    templateId: 'executive-rose',
    resume: buildPreviewResume({}),
  },
  {
    name: 'Modern Teal',
    templateId: 'modern-teal',
    resume: buildPreviewResume({}),
  },
  {
    name: 'Creative Sidebar',
    templateId: 'creative-sidebar',
    resume: buildPreviewResume({}),
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <ParticleBackground />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Badge */}
            <FadeIn delay={0.1}>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  AI-Powered Resume Builder
                </span>
              </motion.div>
            </FadeIn>

            {/* Main Headline */}
            <FadeIn delay={0.2}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                Craft Resumes That{' '}
                <GradientText variant="emerald" animate className="text-6xl sm:text-7xl lg:text-8xl">
                  Open Doors
                </GradientText>
              </h1>
            </FadeIn>

            {/* Subheadline */}
            <FadeIn delay={0.3}>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
                AI-powered, ATS-optimized, job-winning resumes. Build your professional story
                with cinematic design and intelligent suggestions.
              </p>
            </FadeIn>

            {/* CTAs */}
            <FadeIn delay={0.4}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/builder">
                  <GlowButton size="lg" className="group">
                    Build Your Resume
                    <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
                  </GlowButton>
                </Link>
                <Link href="/templates">
                  <motion.button
                    className="px-8 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 font-medium hover:border-emerald-500 hover:text-emerald-500 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Templates
                  </motion.button>
                </Link>
              </div>
            </FadeIn>

            {/* Stats */}
            <FadeIn delay={0.5}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-3xl mx-auto">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="text-3xl sm:text-4xl font-bold text-emerald-500">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Floating Resume Preview */}
        <FloatingElement className="absolute right-10 top-1/3 hidden xl:block" duration={5} distance={15}>
          <TiltCard className="w-64 h-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 opacity-60">
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              <div className="h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded mt-4" />
              <div className="space-y-2 mt-4">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
              </div>
            </div>
          </TiltCard>
        </FloatingElement>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SlideIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to{' '}
              <GradientText variant="sapphire">Stand Out</GradientText>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to help you create professional resumes that get noticed by recruiters and pass ATS systems.
            </p>
          </SlideIn>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <StaggerItem key={feature.title}>
                <TiltCard className="h-full">
                  <GlassCard className="p-6 h-full hover:border-emerald-500/30 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
                  </GlassCard>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Templates Preview Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SlideIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Premium{' '}
              <GradientText variant="aurora" animate>Templates</GradientText>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose from our collection of professionally designed templates, each optimized for different industries and career levels.
            </p>
          </SlideIn>

          <div className="grid md:grid-cols-3 gap-8">
            {templatePreviews.map((template, index) => (
              <SlideIn key={template.name} delay={index * 0.1}>
                <motion.div
                  className="relative group h-full"
                  whileHover={{ y: -10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <GlassCard className="p-4 overflow-hidden h-full">
                    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-inner overflow-hidden" style={{ height: '360px' }}>
                      <div className="absolute inset-0">
                        <div className="h-12 bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-gray-900 dark:to-gray-800" />
                        <div className="p-6 space-y-3">
                          <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
                          <div className="h-3 w-1/2 bg-gray-100 dark:bg-gray-800 rounded" />
                          <div className="space-y-2 pt-4">
                            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded" />
                            <div className="h-2 w-5/6 bg-gray-100 dark:bg-gray-800 rounded" />
                            <div className="h-2 w-4/6 bg-gray-100 dark:bg-gray-800 rounded" />
                          </div>
                          <div className="space-y-2 pt-2">
                            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded" />
                            <div className="h-2 w-10/12 bg-gray-100 dark:bg-gray-800 rounded" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <motion.div
                      className="absolute inset-0 bg-emerald-500/90 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      initial={false}
                    >
                      <span className="text-white font-semibold">Preview Template</span>
                    </motion.div>
                  </GlassCard>
                  <p className="text-center mt-4 font-medium">{template.name}</p>
                </motion.div>
              </SlideIn>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/templates">
              <GlowButton variant="outline">View All Templates</GlowButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SlideIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Loved by{' '}
              <GradientText variant="sunset" animate>Professionals</GradientText>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              See what our users have to say about their experience with ResumAI.
            </p>
          </SlideIn>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <StaggerItem key={testimonial.name}>
                <GlassCard className="p-6 h-full">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SlideIn>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Ready to Build Your{' '}
              <GradientText variant="emerald" animate>Dream Resume?</GradientText>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">
              Join 500,000+ professionals who have already transformed their careers with ResumAI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/builder">
                <GlowButton size="lg">
                  Get Started Free
                </GlowButton>
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>No credit card required</span>
              </div>
            </div>
          </SlideIn>
        </div>
      </section>

      <Footer />
    </main>
  )
}
