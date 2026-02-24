'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, Sparkles, Zap, Crown, Building2 } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { SlideIn } from '@/components/animations/SlideIn'
import { GlowButton } from '@/components/animations/GlowButton'
import { GlassCard } from '@/components/ui/GlassCard'
import { GradientText } from '@/components/ui/GradientText'
import { TiltCard } from '@/components/animations/TiltCard'

const plans = [
  {
    name: 'Free',
    icon: Sparkles,
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '1 Resume',
      '3 Basic Templates',
      'PDF Export',
      'Basic ATS Check',
      'Email Support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    icon: Zap,
    price: '$12',
    period: 'per month',
    description: 'Best for job seekers',
    features: [
      'Unlimited Resumes',
      'All Templates',
      'AI Content Suggestions',
      'Advanced ATS Optimization',
      'Cover Letter Builder',
      'Priority Support',
      'Analytics Dashboard',
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Premium',
    icon: Crown,
    price: '$29',
    period: 'per month',
    description: 'For serious professionals',
    features: [
      'Everything in Pro',
      'AI Resume Writer',
      'LinkedIn Optimization',
      'Interview Prep',
      'Career Coaching (1hr)',
      'Custom Domain',
      'API Access',
    ],
    cta: 'Go Premium',
    popular: false,
  },
  {
    name: 'Enterprise',
    icon: Building2,
    price: 'Custom',
    period: 'contact us',
    description: 'For teams & organizations',
    features: [
      'Everything in Premium',
      'Team Management',
      'Custom Branding',
      'SSO Integration',
      'Dedicated Support',
      'SLA Guarantee',
      'Custom Integrations',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

const comparisons = [
  { feature: 'Resume Templates', free: '3', pro: 'All 15+', premium: 'All 15+', enterprise: 'Custom' },
  { feature: 'AI Suggestions', free: 'Basic', pro: 'Advanced', premium: 'Full AI Writer', enterprise: 'Custom AI' },
  { feature: 'ATS Optimization', free: 'Basic', pro: 'Advanced', premium: 'Premium', enterprise: 'Enterprise' },
  { feature: 'Cover Letters', free: '-', pro: 'Yes', premium: 'Yes', enterprise: 'Yes' },
  { feature: 'Analytics', free: '-', pro: 'Basic', premium: 'Advanced', enterprise: 'Custom' },
  { feature: 'Support', free: 'Email', pro: 'Priority', premium: '24/7 Premium', enterprise: 'Dedicated' },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SlideIn className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Simple, Transparent Pricing
              </span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Choose Your{' '}
              <GradientText variant="emerald" animate>Perfect Plan</GradientText>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Start free and scale as you grow. All plans include core features with no hidden fees.
            </p>
          </SlideIn>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {plans.map((plan, index) => (
              <SlideIn key={plan.name} delay={index * 0.1}>
                <TiltCard className="h-full">
                  <GlassCard 
                    className={`h-full p-6 relative ${
                      plan.popular 
                        ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10' 
                        : ''
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-4 py-1 rounded-full bg-emerald-500 text-white text-sm font-medium">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <div className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center ${
                        plan.popular 
                          ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' 
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        <plan.icon className={`w-6 h-6 ${plan.popular ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-gray-500">/{plan.period}</span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-sm">
                          <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href="/auth/signup" className="block">
                      <GlowButton 
                        variant={plan.popular ? 'primary' : 'outline'} 
                        className="w-full justify-center"
                      >
                        {plan.cta}
                      </GlowButton>
                    </Link>
                  </GlassCard>
                </TiltCard>
              </SlideIn>
            ))}
          </div>

          {/* Comparison Table */}
          <SlideIn>
            <GlassCard className="p-8 overflow-hidden">
              <h2 className="text-2xl font-bold text-center mb-8">
                Compare All Features
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left py-4 px-4 font-semibold">Feature</th>
                      <th className="text-center py-4 px-4 font-semibold">Free</th>
                      <th className="text-center py-4 px-4 font-semibold text-emerald-500">Pro</th>
                      <th className="text-center py-4 px-4 font-semibold">Premium</th>
                      <th className="text-center py-4 px-4 font-semibold">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisons.map((row, index) => (
                      <motion.tr
                        key={row.feature}
                        className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        viewport={{ once: true }}
                      >
                        <td className="py-4 px-4 font-medium">{row.feature}</td>
                        <td className="text-center py-4 px-4 text-gray-600 dark:text-gray-400">{row.free}</td>
                        <td className="text-center py-4 px-4 text-emerald-600 dark:text-emerald-400 font-medium">{row.pro}</td>
                        <td className="text-center py-4 px-4 text-gray-600 dark:text-gray-400">{row.premium}</td>
                        <td className="text-center py-4 px-4 text-gray-600 dark:text-gray-400">{row.enterprise}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </SlideIn>

          {/* FAQ Section */}
          <SlideIn className="mt-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Everything you need to know about our pricing
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  q: 'Can I switch plans anytime?',
                  a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.',
                },
                {
                  q: 'Is there a free trial?',
                  a: 'Paid plans may include a limited trial period depending on current offers.',
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.',
                },
                {
                  q: 'Can I get a refund?',
                  a: 'Yes, we offer a 30-day money-back guarantee on all paid plans.',
                },
              ].map((faq, index) => (
                <GlassCard key={index} className="p-6">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{faq.a}</p>
                </GlassCard>
              ))}
            </div>
          </SlideIn>
        </div>
      </section>

      <Footer />
    </main>
  )
}
