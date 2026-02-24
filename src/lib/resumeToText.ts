import { Resume } from '@/types'

function line(parts: Array<string | undefined | null>) {
  return parts.filter(Boolean).join(' ')
}

export function resumeToText(resume: Resume): string {
  const out: string[] = []

  const name = line([resume.personalInfo.firstName, resume.personalInfo.lastName]).trim()
  if (name) out.push(name)
  if (resume.personalInfo.title) out.push(resume.personalInfo.title)

  const contact = [
    resume.personalInfo.email,
    resume.personalInfo.phone,
    resume.personalInfo.location,
    resume.personalInfo.linkedIn,
    resume.personalInfo.website,
  ]
    .filter(Boolean)
    .join(' | ')
  if (contact) out.push(contact)

  if (resume.summary) {
    out.push('')
    out.push('SUMMARY')
    out.push(resume.summary)
  }

  if (resume.skills.length) {
    out.push('')
    out.push('SKILLS')
    out.push(resume.skills.map((s) => s.name).join(' | '))
  }

  if (resume.experience.length) {
    out.push('')
    out.push('EXPERIENCE')
    for (const exp of resume.experience) {
      const dates = [exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' - ')
      out.push(line([exp.position, '-', exp.company, dates ? `(${dates})` : '']).trim())
      for (const a of exp.achievements) {
        if (a.trim()) out.push(`- ${a}`)
      }
      if (exp.description?.trim()) out.push(`- ${exp.description}`)
      out.push('')
    }
  }

  if (resume.education.length) {
    out.push('')
    out.push('EDUCATION')
    for (const edu of resume.education) {
      const dates = [edu.startDate, edu.endDate].filter(Boolean).join(' - ')
      out.push(line([edu.institution, dates ? `(${dates})` : '']).trim())
      out.push(line([edu.degree, edu.field ? `in ${edu.field}` : '']).trim())
      out.push('')
    }
  }

  if (resume.certifications.length) {
    out.push('')
    out.push('CERTIFICATIONS')
    for (const cert of resume.certifications) {
      const when = [cert.date, cert.expiry ? `- ${cert.expiry}` : ''].filter(Boolean).join(' ')
      out.push(line([cert.name, cert.issuer ? `| ${cert.issuer}` : '', when ? `| ${when}` : '']).trim())
    }
  }

  if (resume.customSections.length) {
    for (const section of resume.customSections) {
      if (!section.title.trim()) continue
      out.push('')
      out.push(section.title.toUpperCase())
      for (const item of section.items) {
        if (item.trim()) out.push(`- ${item}`)
      }
    }
  }

  return out.join('\n').trim() + '\n'
}

