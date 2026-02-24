'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, Mail, Lock, User, Github, Linkedin, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Input } from '@/components/ui/Input'
import { GlowButton } from '@/components/animations/GlowButton'
import { FadeIn } from '@/components/animations/FadeIn'
import { GradientText } from '@/components/ui/GradientText'

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate signup
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setStep(2)
  }

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden py-20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md mx-auto px-4">
        <FadeIn>
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
              ResumAI
            </span>
          </Link>

          <GlassCard className="p-8">
            {step === 1 ? (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold mb-2">
                    Create Your <GradientText variant="emerald">Account</GradientText>
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Start building your professional resume today
                  </p>
                </div>

                {/* Social Signup */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <motion.button
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Github className="w-5 h-5" />
                    <span className="text-sm font-medium">GitHub</span>
                  </motion.button>
                  <motion.button
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Linkedin className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </motion.button>
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-[#1c1c1e] text-gray-500">Or sign up with email</span>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      placeholder="John"
                      icon={<User className="w-4 h-4" />}
                      required
                    />
                    <Input
                      label="Last Name"
                      placeholder="Doe"
                      required
                    />
                  </div>
                  
                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    icon={<Mail className="w-4 h-4" />}
                    required
                  />
                  
                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      icon={<Lock className="w-4 h-4" />}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1 rounded border-gray-300" required />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      I agree to the{' '}
                      <Link href="/terms" className="text-emerald-500 hover:text-emerald-600">Terms of Service</Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="text-emerald-500 hover:text-emerald-600">Privacy Policy</Link>
                    </span>
                  </div>

                  <GlowButton type="submit" className="w-full justify-center" disabled={isLoading}>
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </GlowButton>
                </form>

                <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-emerald-500 hover:text-emerald-600 font-medium">
                    Sign in
                  </Link>
                </p>
              </>
            ) : (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">Welcome to ResumAI!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your account has been created successfully. Start building your resume now!
                </p>
                <Link href="/builder">
                  <GlowButton className="w-full justify-center">
                    Start Building
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </GlowButton>
                </Link>
              </div>
            )}
          </GlassCard>
        </FadeIn>
      </div>
    </main>
  )
}
