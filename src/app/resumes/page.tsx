'use client'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ResumePreview } from '@/components/ResumePreview'
import { motion } from 'framer-motion'

export default function ResumesPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-[#0a0a0a]">
            <Navbar />

            {/* Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 -left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-20 -right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20"
            >
                <ResumePreview />
            </motion.div>

            <Footer />
        </main>
    )
}
