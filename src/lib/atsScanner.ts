const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'have', 'in', 'is', 'it', 'its',
  'of', 'on', 'or', 'that', 'the', 'to', 'was', 'were', 'will', 'with', 'you', 'your',
])

export interface AtsBreakdown {
  contact: number
  sections: number
  keywords: number
  formatting: number
}

export interface AtsSignals {
  email: boolean
  phone: boolean
  linkedin: boolean
  hasSummary: boolean
  hasExperience: boolean
  hasEducation: boolean
  hasSkills: boolean
  hasCerts: boolean
  hasBullets: boolean
  quantifiedBulletCount: number
  keywordCoverage: number
}

export interface AtsScanResult {
  score: number
  breakdown: AtsBreakdown
  signals: AtsSignals
  wordCount: number
  matchedKeywords: string[]
  missingKeywords: string[]
  suggestions: string[]
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+\-/#.\s]/g, ' ')
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
}

export function extractKeywordsFromJobDescription(jobDescription: string, max = 20): string[] {
  const tokens = tokenize(jobDescription)
  const counts = new Map<string, number>()
  for (const token of tokens) {
    if (token.length < 3) continue
    if (STOPWORDS.has(token)) continue
    counts.set(token, (counts.get(token) || 0) + 1)
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([w]) => w)
    .slice(0, max)
}

export function scanAts(args: { resumeText: string; jobDescription?: string }): AtsScanResult {
  const resumeText = (args.resumeText || '').trim()
  const jd = (args.jobDescription || '').trim()

  const lower = resumeText.toLowerCase()
  const wordCount = tokenize(resumeText).length

  // Contact (20)
  const email = /[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}/.test(resumeText)
  const phone = /(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText)
  const linkedin = /linkedin\.com\/in\/|linkedin/i.test(resumeText)
  const contact = clamp((email ? 8 : 0) + (phone ? 6 : 0) + (linkedin ? 6 : 0), 0, 20)

  // Sections (40)
  const hasSummary = /\b(summary|professional summary|profile)\b/i.test(resumeText)
  const hasExperience = /\b(experience|work experience|professional experience|employment)\b/i.test(resumeText)
  const hasEducation = /\b(education)\b/i.test(resumeText)
  const hasSkills = /\b(skills|technical skills|core competencies)\b/i.test(resumeText)
  const hasCerts = /\b(certifications?|certificates?)\b/i.test(resumeText)
  const sections = clamp(
    (hasSummary ? 10 : 0) +
      (hasExperience ? 14 : 0) +
      (hasEducation ? 8 : 0) +
      (hasSkills ? 8 : 0) +
      (hasCerts ? 4 : 0),
    0,
    40
  )

  // Keywords (30)
  const keywords = jd ? extractKeywordsFromJobDescription(jd, 25) : []
  const matchedKeywords = keywords.filter((k) => lower.includes(k))
  const missingKeywords = keywords.filter((k) => !lower.includes(k))
  const keywordCoverage = keywords.length ? matchedKeywords.length / keywords.length : 0
  const keywordScore = keywords.length
    ? clamp(Math.round((matchedKeywords.length / keywords.length) * 30), 0, 30)
    : 0

  // Formatting (10)
  const hasBullets = /(^|\n)\s*[-*]\s+/.test(resumeText) || /\u2022/.test(resumeText)
  const reasonableLength = wordCount >= 250 && wordCount <= 1200
  const formatting = clamp((hasBullets ? 5 : 0) + (reasonableLength ? 5 : 0), 0, 10)

  // Quantified impact signal (does not affect score directly)
  const bulletLines = resumeText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('-') || l.startsWith('*') || l.startsWith('\u2022'))

  const quantifiedBulletCount = bulletLines.filter((l) => /(\$|%|\b\d+\b)/.test(l)).length

  const breakdown: AtsBreakdown = {
    contact,
    sections,
    keywords: keywordScore,
    formatting,
  }

  const score = clamp(breakdown.contact + breakdown.sections + breakdown.keywords + breakdown.formatting, 0, 100)

  const suggestions: string[] = []
  if (!email) suggestions.push('Add a professional email address in the header.')
  if (!phone) suggestions.push('Add a phone number in the header.')
  if (!linkedin) suggestions.push('Add a LinkedIn URL (optional but recommended).')
  if (!hasSummary) suggestions.push('Add a short "Summary" section (3-5 lines).')
  if (!hasExperience) suggestions.push('Add an "Experience" section with role, company, dates, and bullet achievements.')
  if (!hasEducation) suggestions.push('Add an "Education" section (degree, school, year).')
  if (!hasSkills) suggestions.push('Add a "Skills" section aligned with the job description.')
  if (!hasBullets) suggestions.push('Use bullet points for achievements (improves ATS readability).')
  if (hasBullets && quantifiedBulletCount === 0) suggestions.push('Quantify impact in bullets (numbers, %, $, time saved).')
  if (jd && missingKeywords.length) suggestions.push('Add missing keywords naturally into skills and experience bullets.')

  const signals: AtsSignals = {
    email,
    phone,
    linkedin,
    hasSummary,
    hasExperience,
    hasEducation,
    hasSkills,
    hasCerts,
    hasBullets,
    quantifiedBulletCount,
    keywordCoverage,
  }

  return {
    score,
    breakdown,
    signals,
    wordCount,
    matchedKeywords,
    missingKeywords,
    suggestions,
  }
}
