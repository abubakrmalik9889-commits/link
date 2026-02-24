'use client'

import { motion } from 'framer-motion'
import { Download, Eye, Upload, RefreshCw } from 'lucide-react'

interface LivePreviewProps {
    onExportPDF?: () => void
    onExportATS?: () => void
    onExportJSON?: () => void
    onUploadResume?: () => void
    isExporting?: boolean
    isUploading?: boolean
}

export function LivePreviewHeader({
    onExportPDF,
    onExportATS,
    onExportJSON,
    onUploadResume,
    isExporting = false,
    isUploading = false,
}: LivePreviewProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 py-4 px-6 rounded-t-2xl"
        >
            <div className="flex flex-col gap-4">
                {/* Title Section */}
                <div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent flex items-center gap-2">
                        <Eye className="w-5 h-5 text-emerald-600" />
                        Live Preview
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Export, import, or download your resume in multiple formats
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {/* Export PDF Button */}
                    <motion.button
                        onClick={onExportPDF}
                        disabled={isExporting}
                        whileHover={!isExporting ? { scale: 1.05 } : {}}
                        whileTap={!isExporting ? { scale: 0.95 } : {}}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-xs sm:text-sm font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">PDF</span>
                    </motion.button>

                    {/* Export ATS Button */}
                    <motion.button
                        onClick={onExportATS}
                        disabled={isExporting}
                        whileHover={!isExporting ? { scale: 1.05 } : {}}
                        whileTap={!isExporting ? { scale: 0.95 } : {}}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs sm:text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">ATS</span>
                    </motion.button>

                    {/* Export JSON Button */}
                    <motion.button
                        onClick={onExportJSON}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 text-white text-xs sm:text-sm font-semibold hover:shadow-lg hover:shadow-gray-700/30 transition-all dark:from-gray-600 dark:to-gray-700"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span className="hidden sm:inline">JSON</span>
                    </motion.button>

                    {/* Upload Resume Button */}
                    <motion.button
                        onClick={onUploadResume}
                        disabled={isUploading}
                        whileHover={!isUploading ? { scale: 1.05 } : {}}
                        whileTap={!isUploading ? { scale: 0.95 } : {}}
                        className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-semibold hover:border-emerald-500 dark:hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all disabled:opacity-50"
                    >
                        <Upload className="w-4 h-4" />
                        <span className="hidden sm:inline">Import</span>
                    </motion.button>

                    {/* Status Indicator */}
                    <motion.div className="flex items-center justify-center">
                        {isExporting || isUploading ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                <RefreshCw className="w-5 h-5 text-amber-500" />
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2.5 h-2.5 rounded-full bg-emerald-500"
                            />
                        )}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}
