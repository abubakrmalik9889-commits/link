'use client'

import { useMemo, useState, type ChangeEvent } from 'react'
import { motion } from 'framer-motion'
import { Upload, Sparkles, ClipboardList, FileText, ClipboardPaste, CheckCircle2, XCircle } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlowButton } from '@/components/animations/GlowButton'
import { Textarea } from '@/components/ui/Textarea'
import { Input } from '@/components/ui/Input'
import { extractTextFromFile } from '@/lib/resumeParser'
import { scanAts } from '@/lib/atsScanner'
import { useResumeStore } from '@/store/resumeStore'
import { resumeToText } from '@/lib/resumeToText'

export default function AtsScannerPage() {
  const { currentResume } = useResumeStore()
  const [jobDescription, setJobDescription] = useState('')
  const [source, setSource] = useState<'builder' | 'upload' | 'paste'>('builder')
  const [file, setFile] = useState<File | null>(null)
  const [pastedText, setPastedText] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resumeText, setResumeText] = useState<string>('')
  const [showExtracted, setShowExtracted] = useState(false)

  const result = useMemo(() => {
    if (!resumeText.trim()) return null
    return scanAts({ resumeText, jobDescription })
  }, [resumeText, jobDescription])

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null
    setFile(f)
    setError(null)
    setResumeText('')
  }

  const onScan = async () => {
    setError(null)
    setIsScanning(true)
    try {
      if (source === 'builder') {
        if (!currentResume) {
          setError('No resume found in Builder. Open /builder and create a resume first.')
          return
        }
        setResumeText(resumeToText(currentResume))
        setShowExtracted(false)
        return
      }

      if (source === 'paste') {
        if (!pastedText.trim()) {
          setError('Paste your resume text first.')
          return
        }
        setResumeText(pastedText)
        setShowExtracted(false)
        return
      }

      // upload
      if (!file) {
        setError('Please upload a PDF or DOCX resume.')
        return
      }

      const text = await extractTextFromFile(file)
      if (!text.trim()) {
        setError('Could not extract any text. Try a different PDF/DOCX (not scanned images).')
        return
      }
      setResumeText(text)
      setShowExtracted(true)
    } catch (e) {
      console.error(e)
      setError('Failed to scan resume. Try again with a different file.')
    } finally {
      setIsScanning(false)
    }
  }

  const scoreLabel =
    !result
      ? ''
      : result.score >= 85
        ? 'Excellent'
        : result.score >= 70
          ? 'Good'
          : result.score >= 55
            ? 'Needs Work'
            : 'Poor'

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      <Navbar />

      <section className="pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">ATS Scanner</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
                Upload your resume and optionally paste a job description. We extract text and score ATS-readiness with practical fixes.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="w-5 h-5 text-emerald-600" />
                <h2 className="font-semibold">Inputs</h2>
              </div>

              <div className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => setSource('builder')}
                    className={`p-3 rounded-xl border text-sm flex items-center justify-center gap-2 ${source === 'builder' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white hover:bg-gray-50'}`}
                  >
                    <FileText className="w-4 h-4" />
                    Builder Resume
                  </button>
                  <button
                    onClick={() => setSource('upload')}
                    className={`p-3 rounded-xl border text-sm flex items-center justify-center gap-2 ${source === 'upload' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white hover:bg-gray-50'}`}
                  >
                    <Upload className="w-4 h-4" />
                    Upload PDF/DOCX
                  </button>
                  <button
                    onClick={() => setSource('paste')}
                    className={`p-3 rounded-xl border text-sm flex items-center justify-center gap-2 ${source === 'paste' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white hover:bg-gray-50'}`}
                  >
                    <ClipboardPaste className="w-4 h-4" />
                    Paste Text
                  </button>
                </div>

                {source === 'upload' && (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">Upload a text-based resume (not scanned images).</div>
                    <Input type="file" accept=".pdf,.docx" onChange={onFileChange} />
                  </div>
                )}

                {source === 'paste' && (
                  <Textarea
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste your resume text here..."
                    rows={10}
                  />
                )}

                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here (optional, improves keyword matching)..."
                  rows={10}
                />

                {error && (
                  <div className="text-sm text-red-600">{error}</div>
                )}

                <GlowButton onClick={onScan} disabled={isScanning}>
                  {isScanning ? 'Scanning...' : 'Scan ATS'}
                </GlowButton>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList className="w-5 h-5 text-emerald-600" />
                <h2 className="font-semibold">Results</h2>
              </div>

              {!result ? (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Upload a resume and click Scan to see your ATS score and suggestions.
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm text-gray-500">ATS Score</div>
                      <div className="text-4xl font-bold">{result.score}/100</div>
                      <div className="text-sm text-gray-600 mt-1">{scoreLabel}</div>
                      <div className="text-xs text-gray-500 mt-1">Words: {result.wordCount}</div>
                    </div>
                    <motion.div
                      className="w-28 h-28 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center"
                      initial={{ scale: 0.98, opacity: 0.9 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sparkles className="w-10 h-10 text-emerald-600" />
                    </motion.div>
                  </div>

                  <div className="h-3 rounded-full bg-gray-100 overflow-hidden border">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-blue-500"
                      style={{ width: `${Math.min(100, Math.max(0, result.score))}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-3 rounded-xl bg-gray-50 border">
                      <div className="text-gray-500">Contact</div>
                      <div className="font-semibold">{result.breakdown.contact}/20</div>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50 border">
                      <div className="text-gray-500">Sections</div>
                      <div className="font-semibold">{result.breakdown.sections}/40</div>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50 border">
                      <div className="text-gray-500">Keywords</div>
                      <div className="font-semibold">{result.breakdown.keywords}/30</div>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50 border">
                      <div className="text-gray-500">Formatting</div>
                      <div className="font-semibold">{result.breakdown.formatting}/10</div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="p-4 rounded-xl border bg-white">
                      <div className="font-semibold mb-2">Checks</div>
                      <div className="space-y-2 text-gray-700">
                        <div className="flex items-center gap-2">
                          {result.signals.email ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
                          <span>Email</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {result.signals.phone ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
                          <span>Phone</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {result.signals.hasExperience ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
                          <span>Experience section</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {result.signals.hasSkills ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
                          <span>Skills section</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border bg-white">
                      <div className="font-semibold mb-2">Signals</div>
                      <div className="space-y-2 text-gray-700">
                        <div className="flex items-center justify-between">
                          <span>Keyword coverage</span>
                          <span className="font-semibold">{Math.round(result.signals.keywordCoverage * 100)}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Quantified bullets</span>
                          <span className="font-semibold">{result.signals.quantifiedBulletCount}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Tip: Add numbers (%, $, time) to show impact.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold mb-2">Suggestions</div>
                    <ul className="text-sm text-gray-700 space-y-2">
                      {result.suggestions.slice(0, 8).map((s) => (
                        <li key={s} className="flex gap-2">
                          <span className="text-emerald-600 mt-0.5">-</span>
                          <span>{s}</span>
                        </li>
                      ))}
                      {!result.suggestions.length && (
                        <li className="text-gray-600">Looks good. Try matching more keywords from the job description.</li>
                      )}
                    </ul>
                  </div>

                  {jobDescription.trim() && (
                    <div>
                      <div className="text-sm font-semibold mb-2">Keywords</div>
                      {!!result.matchedKeywords.length && (
                        <div className="mb-3">
                          <div className="text-xs text-gray-500 mb-2">Matched</div>
                          <div className="flex flex-wrap gap-2">
                            {result.matchedKeywords.slice(0, 18).map((k) => (
                              <span key={k} className="text-xs px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mb-2">Missing</div>
                      <div className="flex flex-wrap gap-2">
                        {result.missingKeywords.slice(0, 18).map((k) => (
                          <span key={k} className="text-xs px-2 py-1 rounded-full bg-gray-100 border text-gray-700">
                            {k}
                          </span>
                        ))}
                        {!result.missingKeywords.length && (
                          <span className="text-sm text-gray-600">No missing keywords detected.</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          </div>

          {showExtracted && resumeText.trim() && (
            <GlassCard className="p-6 mt-6">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="text-sm font-semibold">Extracted Text</div>
                <button
                  onClick={() => setShowExtracted(false)}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Hide
                </button>
              </div>
              <pre className="text-xs whitespace-pre-wrap break-words bg-white border rounded-xl p-4 max-h-[360px] overflow-y-auto">
                {resumeText}
              </pre>
            </GlassCard>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
