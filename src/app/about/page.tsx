'use client'

import { motion } from 'framer-motion'
import { Target, Eye, Heart, Users, Award, Globe } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { SlideIn } from '@/components/animations/SlideIn'
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer'
import { GlassCard } from '@/components/ui/GlassCard'
import { GradientText } from '@/components/ui/GradientText'
import { TiltCard } from '@/components/animations/TiltCard'

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To democratize career success by making professional resume building accessible to everyone, everywhere.',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description: 'A world where every professional can confidently present their skills and land their dream job.',
  },
  {
    icon: Heart,
    title: 'Our Values',
    description: 'We believe in innovation, accessibility, and putting our users first in everything we do.',
  },
]

const team = [
  {
    name: 'Alex Chen',
    role: 'CEO & Co-Founder',
    bio: 'Former Google PM with a passion for democratizing career tools.',
    color: 'from-emerald-400 to-emerald-600',
  },
  {
    name: 'Sarah Miller',
    role: 'CTO & Co-Founder',
    bio: 'Ex-Microsoft engineer building AI that understands careers.',
    color: 'from-blue-400 to-blue-600',
  },
  {
    name: 'James Wilson',
    role: 'Head of Design',
    bio: 'Award-winning designer crafting beautiful resume experiences.',
    color: 'from-purple-400 to-purple-600',
  },
  {
    name: 'Emily Zhang',
    role: 'Head of AI',
    bio: 'PhD in ML, building the future of intelligent career assistance.',
    color: 'from-pink-400 to-pink-600',
  },
]

const stats = [
  { icon: Users, value: '500K+', label: 'Active Users' },
  { icon: Award, value: '2M+', label: 'Resumes Created' },
  { icon: Globe, value: '50+', label: 'Countries' },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SlideIn className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Building the Future of{' '}
              <GradientText variant="emerald" animate>Career Success</GradientText>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We&apos;re a team of passionate engineers, designers, and career experts on a mission 
              to help professionals worldwide unlock their full potential.
            </p>
          </SlideIn>

          {/* Stats */}
          <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-24">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <GlassCard className="p-6 text-center">
                  <stat.icon className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Values */}
          <div className="mb-24">
            <SlideIn className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Drives Us</h2>
            </SlideIn>
            
            <StaggerContainer className="grid md:grid-cols-3 gap-8">
              {values.map((value) => (
                <StaggerItem key={value.title}>
                  <TiltCard className="h-full">
                    <GlassCard className="p-8 h-full text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto mb-6">
                        <value.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                    </GlassCard>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* Team */}
          <div className="mb-24">
            <SlideIn className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet the Team</h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                The passionate people behind ResumAI working to transform how professionals present themselves.
              </p>
            </SlideIn>
            
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member) => (
                <StaggerItem key={member.name}>
                  <TiltCard className="h-full">
                    <GlassCard className="p-6 h-full text-center group">
                      <motion.div
                        className={`w-24 h-24 rounded-full bg-gradient-to-br ${member.color} mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {member.name[0]}
                      </motion.div>
                      <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                      <p className="text-sm text-emerald-500 mb-3">{member.role}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{member.bio}</p>
                    </GlassCard>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          {/* Story Section */}
          <SlideIn>
            <GlassCard className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                  <div className="space-y-4 text-gray-600 dark:text-gray-400">
                    <p>
                      ResumAI was born from a simple observation: talented professionals were struggling 
                      to get interviews because their resumes weren&apos;t effectively communicating their value.
                    </p>
                    <p>
                      Founded in 2023 by Alex Chen and Sarah Miller, we set out to combine cutting-edge 
                      AI with beautiful design to create a resume builder that actually works.
                    </p>
                    <p>
                      Today, we&apos;ve helped over 500,000 professionals land their dream jobs, and we&apos;re 
                      just getting started. Our AI continues to learn and improve, ensuring every resume 
                      we help create is better than the last.
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-emerald-500/20 via-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <motion.div
                      className="text-6xl font-bold bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      2023
                    </motion.div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </SlideIn>
        </div>
      </section>

      <Footer />
    </main>
  )
}
