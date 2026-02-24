import { Resume, Experience, Education, Skill, Certification, PersonalInfo, Project } from '@/types'
import { generateId } from './utils'

// Extract text from PDF using pdfjs (dynamic import to avoid SSR issues)
async function extractTextFromPdf(arrayBuffer: ArrayBuffer): Promise<string> {
    // @ts-expect-error - pdfjs dynamic import may not have type definitions
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf')
    try {
        // If worker needed in future: pdfjsLib.GlobalWorkerOptions.workerSrc = '...'
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        let fullText = ''
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const content = await page.getTextContent({ normalizeWhitespace: false, disableCombineTextItems: false })
            const items = content.items as Array<{ str?: string; transform?: number[] }>

            const cleanItems = items
                .map((it) => {
                    const text = (it.str || '').trim()
                    if (!text) return null
                    const t = it.transform || []
                    return { text, x: t[4] ?? 0, y: t[5] ?? 0 }
                })
                .filter(Boolean) as Array<{ text: string; x: number; y: number }>

            const xs = cleanItems.map((it) => it.x)
            const minX = xs.length ? Math.min(...xs) : 0
            const maxX = xs.length ? Math.max(...xs) : 0
            const midX = (minX + maxX) / 2
            const leftCount = cleanItems.filter((it) => it.x < midX - 5).length
            const rightCount = cleanItems.filter((it) => it.x >= midX - 5).length
            const useTwoColumns =
                cleanItems.length > 40 &&
                leftCount > cleanItems.length * 0.2 &&
                rightCount > cleanItems.length * 0.2

            const buildLines = (source: Array<{ text: string; x: number; y: number }>) => {
                const lines = new Map<number, Array<{ x: number; text: string }>>()
                for (const it of source) {
                    const key = Math.round(it.y / 2) * 2
                    const line = lines.get(key) || []
                    line.push({ x: it.x, text: it.text })
                    lines.set(key, line)
                }

                const sortedKeys = Array.from(lines.keys()).sort((a, b) => b - a)
                const out: string[] = []
                for (const key of sortedKeys) {
                    const line = lines.get(key) || []
                    line.sort((a, b) => a.x - b.x)
                    const lineText = line.map((t) => t.text).join(' ').trim()
                    if (lineText) out.push(lineText)
                }
                return out.join('\n')
            }

            if (useTwoColumns) {
                const leftText = buildLines(cleanItems.filter((it) => it.x < midX))
                const rightText = buildLines(cleanItems.filter((it) => it.x >= midX))
                fullText += `${leftText}\n\n${rightText}\n\n`
            } else {
                fullText += `${buildLines(cleanItems)}\n\n`
            }
        }
        return fullText
    } catch (err) {
        console.error('PDF parsing failed:', err)
        return ''
    }
}

// Extract text from DOCX using mammoth (dynamic import)
async function extractTextFromDocx(arrayBuffer: ArrayBuffer): Promise<string> {
    try {
        const mammoth = await import('mammoth')
        const result = await mammoth.extractRawText({ arrayBuffer })
        return result.value
    } catch (err) {
        console.error('DOCX parsing failed:', err)
        return ''
    }
}

export async function extractTextFromFile(file: File): Promise<string> {
    const ext = file.name.split('.').pop()?.toLowerCase()
    const arrayBuffer = await file.arrayBuffer()

    if (ext === 'pdf') {
        return extractTextFromPdf(arrayBuffer)
    }

    if (ext === 'docx') {
        return extractTextFromDocx(arrayBuffer)
    }

    // try reading as plain text
    try {
        return new TextDecoder().decode(arrayBuffer)
    } catch (e) {
        console.warn('Failed to decode as text', e)
        return ''
    }
}

// Basic heuristics to parse text into structured resume fields
export function parseTextToResume(text: string): Partial<Resume> {
    // Normalize whitespace but preserve line structure
    const normalized = text.replace(/\s+/g, ' ').split(/[.\n]/).map(l => l.trim()).filter(Boolean)
    const allLines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean)

    // Personal info
    const personal: Partial<PersonalInfo> = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        title: '',
        linkedIn: '',
        website: '',
    }

    // name: take first non-empty line
    if (normalized.length) {
        const firstLine = normalized[0]
        // Check if it looks like a name (not an email or all caps section header)
        if (!firstLine.includes('@') && firstLine.length < 50) {
            const nameParts = firstLine.split(/\s+/)
            personal.firstName = nameParts[0] || ''
            personal.lastName = nameParts.slice(1).join(' ') || ''
        }
    }

    // email - case insensitive and more lenient
    const emailMatch = text.match(/[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}/i)
    if (emailMatch) personal.email = emailMatch[0]

    // phone - more lenient pattern
    const phoneMatch = text.match(/(\+?1[-.\s]?)?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})/g)
    if (phoneMatch) personal.phone = phoneMatch[0]

    const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/[A-Za-z0-9_\-/%]+/i)
    if (linkedinMatch) personal.linkedIn = linkedinMatch[0]

    const urlMatches = text.match(/https?:\/\/[^\s)]+|www\.[^\s)]+/gi) || []
    const websiteMatch = urlMatches.find((url) => !/linkedin\.com/i.test(url))
    if (websiteMatch) personal.website = websiteMatch

    for (const line of allLines.slice(0, 6)) {
        if (personal.location) break
        if (!line || line.length > 60) continue
        if (line.includes('@') || /\d{3}[-.\s]?\d{3}/.test(line)) continue
        if (/linkedin\.com|https?:\/\//i.test(line)) continue
        if (line.includes(',')) {
            personal.location = line
        }
    }

    // title: try line after name (usually role/title)
    for (let i = 1; i < Math.min(6, allLines.length); i++) {
        const line = allLines[i]
        if (line && !line.includes('@') && line.length < 80 && !line.match(/^\d{4}/) && line.toLowerCase().indexOf('summary') === -1) {
            personal.title = line
            break
        }
    }

    const normalizeHeader = (value: string) =>
        value
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()

    // Sections detection - case insensitive
    const sectionAliases = {
        summary: ['summary', 'professional summary', 'summary of qualifications', 'objective', 'profile', 'professional profile'],
        experience: ['experience', 'work experience', 'work history', 'professional experience', 'employment', 'employment history'],
        education: ['education', 'education and training', 'education & training', 'academic background'],
        skills: [
            'skills',
            'technical skills',
            'core skills',
            'key skills',
            'skills and tools',
            'skills & tools',
            'tools',
            'technologies',
            'technology',
            'core competencies',
            'expertise',
            'areas of expertise',
        ],
        certifications: ['certifications', 'certificates', 'licenses', 'certifications and training'],
        projects: ['projects', 'project experience', 'selected projects'],
        affiliations: ['professional affiliations', 'affiliations', 'memberships', 'professional memberships'],
    }

    const aliasLookup = new Map<string, string>()
    for (const [key, aliases] of Object.entries(sectionAliases)) {
        for (const alias of aliases) {
            aliasLookup.set(normalizeHeader(alias), key)
        }
    }

    const isSectionHeaderLine = (line: string) => {
        const normalizedHeader = normalizeHeader(line)
        if (!normalizedHeader) return false
        if (aliasLookup.has(normalizedHeader)) return true
        for (const alias of Array.from(aliasLookup.keys())) {
            if (normalizedHeader.startsWith(alias)) return true
        }
        return false
    }

    const sectionIdxs: { name: string, idx: number, inline: string }[] = []
    const sectionAliasEntries = Array.from(aliasLookup.entries()).sort((a, b) => b[0].length - a[0].length)
    const getInlineFromRaw = (line: string, alias: string) => {
        const escapedAlias = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')
        const rx = new RegExp(`^[^A-Za-z0-9]*${escapedAlias}\\b\\s*[:|\\-–—]?\\s*(.*)$`, 'i')
        const m = line.match(rx)
        return (m?.[1] || '').trim()
    }

    for (let i = 0; i < allLines.length; i++) {
        const l = allLines[i]
        if (!l) continue
        const normalizedHeader = normalizeHeader(l)
        for (const [alias, key] of sectionAliasEntries) {
            if (normalizedHeader === alias || normalizedHeader.startsWith(`${alias} `)) {
                const inline = getInlineFromRaw(l, alias)
                sectionIdxs.push({ name: key, idx: i, inline })
                break
            }
        }
    }
    // helper to slice section
    function getSection(name: string): string {
        const sec = sectionIdxs.find(s => s.name === name)
        if (!sec) return ''
        const start = sec.idx + 1
        const next = sectionIdxs.filter(s => s.idx > sec.idx).sort((a, b) => a.idx - b.idx)[0]
        const end = next ? next.idx : allLines.length
        const lines: string[] = []
        if (sec.inline) lines.push(sec.inline)
        lines.push(...allLines.slice(start, end))
        const sectionText = lines.join('\n').trim()
        return sectionText
    }

    // summary
    const summaryText = getSection('summary') || ''

    // skills
    let skillsText = getSection('skills')
    if (!skillsText) {
        const inline = allLines.find((l) => /^skills\s*:/i.test(l))
        if (inline) skillsText = inline.split(':').slice(1).join(':')
    }

    const skillsArr: Skill[] = []
    if (skillsText) {
        const tokens = skillsText.split(/[,;\u2022•|\n]+/).map(s => s.trim()).filter(Boolean)
        for (const t of tokens) {
            if (t.length > 1 && t.length < 50) {
                skillsArr.push({ id: generateId(), name: t, level: 'Intermediate' })
            }
        }
    }
    if (!skillsArr.length) {
        const fallbackSkillsLines = allLines.filter((line) => {
            if (line.length < 12 || line.length > 200) return false
            if (isSectionHeaderLine(line)) return false
            if (/summary|experience|education|project|certification|objective|profile/i.test(line)) return false
            const separators = (line.match(/[,;\u2022|]/g) || []).length
            return separators >= 3
        })
        if (fallbackSkillsLines.length) {
            const combined = fallbackSkillsLines.join(' ')
            const tokens = combined.split(/[,;\u2022•|\n]+/).map(s => s.trim()).filter(Boolean)
            for (const t of tokens) {
                if (t.length > 1 && t.length < 50) {
                    skillsArr.push({ id: generateId(), name: t, level: 'Intermediate' })
                }
            }
        }
    }

    const bulletLike = (line: string) => /^[-*•]\s+/.test(line)
    const likelyDateLine = (line: string) =>
        /(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\s*(?:-|–|—|to)\s*(?:Present|Current|\d{4})|\b\d{4}\s*(?:-|–|—|to)\s*(?:Present|Current|\d{4})|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\b|\b\d{4}\b)/i.test(line)
    const extractDates = (line: string) =>
        line.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|Present|Current|\d{4}/gi) || []
    const likelyExpHeader = (line: string) => {
        if (!line || bulletLike(line)) return false
        if (line.length > 120) return false
        if (isSectionHeaderLine(line)) return false
        if (/^(responsibilities|achievements|highlights)\s*:?\s*$/i.test(line)) return false
        return /\s+at\s+/i.test(line) || /\|/.test(line) || /\s[-–—]\s/.test(line)
    }

    // experience
    const expText = getSection('experience')
    const experiences: Experience[] = []
    if (expText) {
        const lines = expText.split(/\n/).map(l => l.trim()).filter(Boolean)
        type PartialExp = {
            header: string
            startDate: string
            endDate: string
            detailLines: string[]
        }
        let current: PartialExp | null = null

        const flushCurrent = () => {
            if (!current) return
            const header = current.header
            let position = ''
            let company = ''

            const atMatch = header.match(/(.+)\s+at\s+(.+)/i)
            if (atMatch) {
                position = atMatch[1].trim()
                company = atMatch[2].trim()
            } else if (header.includes('|')) {
                const pipeParts = header.split('|').map(s => s.trim()).filter(Boolean)
                position = pipeParts[0] || ''
                company = pipeParts[1] || ''
                if (!current.startDate && pipeParts.length > 2) {
                    const moreDates = extractDates(pipeParts.slice(2).join(' '))
                    current.startDate = moreDates[0] || ''
                    current.endDate = moreDates[1] || ''
                }
            } else if (/\s[-–—]\s/.test(header)) {
                const [a, b] = header.split(/\s[-–—]\s/, 2).map(s => s.trim())
                position = a || ''
                company = b || ''
            } else {
                position = header
            }

            const description = current.detailLines.join(' ').trim()
            const achievements = description
                ? description
                    .split(/[\u2022•]+|(?<!\d)-(?!\d)/)
                    .map(s => s.trim())
                    .filter(s => s.length > 5)
                    .slice(0, 5)
                : []

            if (position || company || description) {
                experiences.push({
                    id: generateId(),
                    company,
                    position,
                    startDate: current.startDate,
                    endDate: current.endDate,
                    current: /present|current/i.test(current.endDate),
                    description,
                    achievements,
                })
            }
            current = null
        }

        for (const line of lines) {
            if (!current) {
                current = { header: line, startDate: '', endDate: '', detailLines: [] }
                const dates = extractDates(line)
                if (dates.length) {
                    current.startDate = dates[0] || ''
                    current.endDate = dates[1] || ''
                }
                continue
            }

            if (likelyExpHeader(line) && (current.detailLines.length > 0 || current.header.length > 0)) {
                flushCurrent()
                current = { header: line, startDate: '', endDate: '', detailLines: [] }
                const dates = extractDates(line)
                if (dates.length) {
                    current.startDate = dates[0] || ''
                    current.endDate = dates[1] || ''
                }
                continue
            }

            if (likelyDateLine(line) && !current.startDate) {
                const dates = extractDates(line)
                current.startDate = dates[0] || ''
                current.endDate = dates[1] || ''
                continue
            }

            current.detailLines.push(line)
        }

        flushCurrent()
    }
    if (expText && experiences.length <= 1) {
        const lines = expText.split(/\n/).map(l => l.trim()).filter(Boolean)
        const anchorIdxs = lines
            .map((line, idx) => (likelyDateLine(line) ? idx : -1))
            .filter((idx) => idx >= 0)

        const anchored: Experience[] = []
        for (let i = 0; i < anchorIdxs.length; i++) {
            const dateIdx = anchorIdxs[i]
            const prevIdx = anchorIdxs[i - 1] ?? -1
            const nextIdx = anchorIdxs[i + 1] ?? lines.length

            const headerCandidates: string[] = []
            for (let j = Math.max(prevIdx + 1, dateIdx - 2); j < dateIdx; j++) {
                const line = lines[j]
                if (!line || bulletLike(line) || likelyDateLine(line) || isSectionHeaderLine(line)) continue
                headerCandidates.push(line)
            }
            const header = headerCandidates.join(' | ').trim() || lines[Math.max(0, dateIdx - 1)] || ''

            let position = ''
            let company = ''
            const atMatch = header.match(/(.+)\s+at\s+(.+)/i)
            if (atMatch) {
                position = atMatch[1].trim()
                company = atMatch[2].trim()
            } else if (header.includes('|')) {
                const pipeParts = header.split('|').map(s => s.trim()).filter(Boolean)
                position = pipeParts[0] || ''
                company = pipeParts[1] || ''
            } else if (/\s[-–—]\s/.test(header)) {
                const [a, b] = header.split(/\s[-–—]\s/, 2).map(s => s.trim())
                position = a || ''
                company = b || ''
            } else {
                position = header
            }

            const dates = extractDates(lines[dateIdx])
            const startDate = dates[0] || ''
            const endDate = dates[1] || ''
            const detailLines: string[] = []
            for (let j = dateIdx + 1; j < nextIdx; j++) {
                const line = lines[j]
                if (!line || isSectionHeaderLine(line)) break
                detailLines.push(line)
            }
            const description = detailLines.join(' ').trim()
            const achievements = description
                ? description
                    .split(/[\u2022•]+|(?<!\d)-(?!\d)/)
                    .map(s => s.trim())
                    .filter(s => s.length > 5)
                    .slice(0, 5)
                : []

            if (position || company || description) {
                anchored.push({
                    id: generateId(),
                    company,
                    position,
                    startDate,
                    endDate,
                    current: /present|current/i.test(endDate),
                    description,
                    achievements,
                })
            }
        }

        if (anchored.length > experiences.length) {
            experiences.length = 0
            experiences.push(...anchored)
        }
    }
    if (!experiences.length) {
        const dateRange = /(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\s*(?:-|–|—)\s*(?:Present|\d{4})|\b\d{4}\s*(?:-|–|—)\s*(?:Present|\d{4}))/i
        for (let i = 0; i < allLines.length; i++) {
            const line = allLines[i]
            if (!dateRange.test(line)) continue
            const header = allLines[i - 1] || line
            if (isSectionHeaderLine(header)) continue
            let position = ''
            let company = ''

            const atMatch = header.match(/(.+)\s+at\s+(.+)/i)
            if (atMatch) {
                position = atMatch[1].trim()
                company = atMatch[2].trim()
            } else if (header.includes('|')) {
                const pipeParts = header.split('|').map(s => s.trim()).filter(Boolean)
                position = pipeParts[0] || ''
                company = pipeParts[1] || ''
            } else if (header.includes('-')) {
                const parts = header.split('-')
                position = parts[0].trim()
                company = parts[1]?.trim() || ''
            }

            const startDate = line.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4}/i)?.[0] || ''
            const endDateMatch = line.match(/(?:Present|\d{4})\b/i)
            const endDate = endDateMatch ? endDateMatch[0] : ''

            const descLines: string[] = []
            for (let j = i + 1; j < allLines.length; j++) {
                const nextLine = allLines[j]
                if (isSectionHeaderLine(nextLine)) break
                if (dateRange.test(nextLine)) break
                descLines.push(nextLine)
            }
            const description = descLines.join(' ')
            const achievements = description
                ? description
                    .split(/[\u2022\-]+/)
                    .map(s => s.trim())
                    .filter(s => s.length > 5)
                    .slice(0, 5)
                : []

            if (position || company) {
                experiences.push({
                    id: generateId(),
                    company,
                    position,
                    startDate,
                    endDate,
                    current: /present/i.test(endDate),
                    description,
                    achievements,
                })
            }
        }
    }

    // education
    const eduText = getSection('education')
    const education: Education[] = []
    if (eduText) {
        const lines = eduText.split(/\n/).map(l => l.trim()).filter(Boolean)
        const degreeHint = /(bachelor|master|phd|doctorate|associate|mba|b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?a\.?|diploma|certificate)/i
        const schoolHint = /(university|college|institute|school|academy)/i
        let current: Education | null = null

        const flushEdu = () => {
            if (!current) return
            if (current.institution || current.degree) education.push(current)
            current = null
        }

        for (const line of lines) {
            if (!current) {
                current = { id: generateId(), institution: '', degree: '', field: '', startDate: '', endDate: '' }
            }

            const yearMatches = line.match(/\b\d{4}\b/g) || []
            if (yearMatches.length) {
                if (!current.startDate) current.startDate = yearMatches[0] || ''
                if (yearMatches[1]) current.endDate = yearMatches[1]
                else if (!current.endDate) current.endDate = yearMatches[0] || ''
            }

            const startsNew =
                (schoolHint.test(line) || degreeHint.test(line)) &&
                (current.institution || current.degree) &&
                (schoolHint.test(line) !== schoolHint.test(current.institution || '') || degreeHint.test(line) !== degreeHint.test(current.degree || ''))

            if (startsNew) {
                flushEdu()
                current = { id: generateId(), institution: '', degree: '', field: '', startDate: '', endDate: '' }
            }

            if (!current.institution && schoolHint.test(line)) {
                current.institution = line
            } else if (!current.degree && degreeHint.test(line)) {
                current.degree = line
            } else if (!current.institution) {
                current.institution = line
            } else if (!current.degree) {
                current.degree = line
            }
        }

        flushEdu()
    }
    if (eduText && education.length <= 1) {
        const lines = eduText.split(/\n/).map(l => l.trim()).filter(Boolean)
        const dateIdxs = lines
            .map((line, idx) => (/\b\d{4}\b/.test(line) ? idx : -1))
            .filter((idx) => idx >= 0)

        const anchoredEdu: Education[] = []
        for (const idx of dateIdxs) {
            const dates = lines[idx].match(/\b\d{4}\b/g) || []
            const institution = (lines[idx - 2] || '').trim()
            const degree = (lines[idx - 1] || '').trim()
            if (!institution && !degree) continue
            anchoredEdu.push({
                id: generateId(),
                institution,
                degree,
                field: '',
                startDate: dates[0] || '',
                endDate: dates[1] || dates[0] || '',
            })
        }

        if (anchoredEdu.length > education.length) {
            education.length = 0
            education.push(...anchoredEdu)
        }
    }

    // certifications
    const certText = getSection('certifications')
    const certifications: Certification[] = []
    if (certText) {
        const parts = certText.split(/\n/).map(l => l.trim()).filter(Boolean)
        for (const p of parts) {
            const cleaned = p.replace(/^[-*•]\s*/, '').trim()
            if (cleaned.length > 2) {
                const pipeParts = cleaned.split('|').map(s => s.trim()).filter(Boolean)
                certifications.push({
                    id: generateId(),
                    name: pipeParts[0] || cleaned,
                    issuer: pipeParts[1] || '',
                    date: '',
                })
            }
        }
    }

    const affiliationsText = getSection('affiliations')
    const customSections: Resume['customSections'] = []
    if (affiliationsText) {
        const items = affiliationsText
            .split(/\n|[•\u2022]/)
            .flatMap((chunk) => chunk.split('|'))
            .map((item) => item.replace(/^[-*•]\s*/, '').trim())
            .filter((item) => item.length > 2)

        if (items.length) {
            customSections.push({
                id: generateId(),
                title: 'Professional Affiliations',
                items: Array.from(new Set(items)),
            })
        }
    }

    // projects
    const projectsText = getSection('projects')
    const projects: Project[] = []
    if (projectsText) {
        const lines = projectsText.split(/\n/).map(l => l.trim()).filter(Boolean)
        let cursor: string[] = []

        const flushProject = (buffer: string[]) => {
            if (!buffer.length) return
            const name = buffer[0]
            const descriptionLines: string[] = []
            let technologies: string[] = []
            let link: string | undefined

            for (const line of buffer.slice(1)) {
                const techMatch = line.match(/^(tech|technologies|stack|tools)\s*:\s*(.+)$/i)
                if (techMatch) {
                    technologies = techMatch[2].split(/[,;|]/).map(s => s.trim()).filter(Boolean)
                    continue
                }

                if (!link) {
                    const linkMatch = line.match(/https?:\/\/[^\s)]+|www\.[^\s)]+/i)
                    if (linkMatch) link = linkMatch[0]
                }

                descriptionLines.push(line)
            }

            if (name) {
                projects.push({ id: generateId(), name, description: descriptionLines.join(' '), technologies, link })
            }
        }

        for (const line of lines) {
            if (cursor.length === 0) {
                cursor.push(line)
                continue
            }
            if (!bulletLike(line) && line.length < 90 && !likelyDateLine(line) && (line.includes(':') || /\|/.test(line))) {
                flushProject(cursor)
                cursor = [line]
                continue
            }
            cursor.push(line)
        }
        flushProject(cursor)
    }


    return {
        name: (personal.firstName || '') + (personal.lastName ? ' ' + personal.lastName : ''),
        personalInfo: {
            firstName: personal.firstName || '',
            lastName: personal.lastName || '',
            email: personal.email || '',
            phone: personal.phone || '',
            location: personal.location || '',
            linkedIn: personal.linkedIn || '',
            website: personal.website || '',
            title: personal.title || ''
        },
        summary: summaryText,
        skills: skillsArr,
        experience: experiences,
        education,
        certifications,
        projects,
        customSections,
    }
}

export async function parseResumeFile(file: File): Promise<Partial<Resume>> {
    const text = await extractTextFromFile(file)

    if (!text || text.trim().length === 0) {
        console.warn('No text extracted from file')
    }

    return parseTextToResume(text)
}

