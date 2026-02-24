'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, Twitter, Linkedin, Github, Instagram, Mail } from 'lucide-react'
import { GlassCard } from './ui/GlassCard'
import { Input } from './ui/Input'
import { GlowButton } from './animations/GlowButton'

const footerLinks = {
  product: [
    { label: 'Templates', href: '/templates' },
    { label: 'Builder', href: '/builder' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'My Resumes', href: '/resumes' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Sign In', href: '/auth/login' },
    { label: 'Create Account', href: '/auth/signup' },
  ],
  resources: [
    { label: 'Resume Templates', href: '/templates' },
    { label: 'Build a Resume', href: '/builder' },
    { label: 'Pricing Plans', href: '/pricing' },
    { label: 'Resume Library', href: '/resumes' },
  ],
}

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Instagram, href: '#', label: 'Instagram' },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/50 to-gray-100 dark:from-transparent dark:via-gray-900/50 dark:to-gray-900" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        {/* Newsletter Section */}
        <GlassCard className="p-8 lg:p-12 mb-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-3">
                Get Resume Tips & Updates
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Join 50,000+ professionals who receive our weekly career insights and AI resume tips.
              </p>
            </div>
            <div className="flex gap-3">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <Input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email"
                className="flex-1"
                icon={<Mail className="w-4 h-4" />}
                aria-label="Email address"
              />
              <GlowButton>Subscribe</GlowButton>
            </div>
          </div>
        </GlassCard>

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                ResumAI
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 max-w-xs">
              AI-powered resume builder that helps you craft job-winning resumes with cinematic design and ATS optimization.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/signup"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  Create Account
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/resumes"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors"
                >
                  My Resumes
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} ResumAI. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/pricing" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-500">
                Pricing
              </Link>
              <Link href="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-500">
                About
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
