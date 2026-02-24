'use client'

import { Resume } from '@/types'
import { forwardRef } from 'react'

interface TemplateProps {
  resume: Resume
}

export const ModernSlate = forwardRef<HTMLDivElement, TemplateProps>(
  ({ resume }, ref) => {
    const { personalInfo, summary, experience, education, skills, certifications } = resume

    return (
      <div
        ref={ref}
        className="w-full max-w-[210mm] mx-auto bg-white text-black font-sans"
        style={{ minHeight: '297mm' }}
      >
        {/* Header */}
        <div className="px-12 pt-10 pb-6 text-center">
          <h1 className="text-5xl font-bold tracking-wider text-black mb-3">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <p className="text-xl font-semibold text-black mb-4">
            {personalInfo.title}
          </p>
          <div className="text-sm text-gray-700 flex flex-wrap justify-center gap-x-3 gap-y-1">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.location && <span>• {personalInfo.location}</span>}
            {personalInfo.linkedIn && <span>• {personalInfo.linkedIn}</span>}
          </div>
        </div>

        <div className="px-12 py-6">
          {/* Summary */}
          {summary && (
            <div className="mb-6">
              <div className="bg-[#e2e8f0] py-2 px-4 mb-3">
                <h2 className="text-lg font-bold text-center tracking-wide text-[#334155]">SUMMARY</h2>
              </div>
              <p className="text-sm leading-relaxed text-justify">{summary}</p>
            </div>
          )}

          {/* Areas of Expertise */}
          {skills.length > 0 && (
            <div className="mb-6">
              <div className="bg-[#e2e8f0] py-2 px-4 mb-3">
                <h2 className="text-lg font-bold text-center tracking-wide text-[#334155]">AREAS OF EXPERTISE</h2>
              </div>
              <div className="text-sm text-center">
                {skills.map((skill, index) => (
                  <span key={skill.id}>
                    {skill.name}
                    {index < skills.length - 1 && (
                      <span className="mx-2">•</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Professional Experience */}
          {experience.length > 0 && (
            <div className="mb-6">
              <div className="bg-[#e2e8f0] py-2 px-4 mb-4">
                <h2 className="text-lg font-bold text-center tracking-wide text-[#334155]">PROFESSIONAL EXPERIENCE</h2>
              </div>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-sm">
                        {exp.position} | {exp.company}
                      </h3>
                      <span className="text-sm italic">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <ul className="text-sm space-y-1 ml-4">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex">
                          <span className="mr-2">•</span>
                          <span className="flex-1 text-justify">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="mb-6">
              <div className="bg-[#e2e8f0] py-2 px-4 mb-3">
                <h2 className="text-lg font-bold text-center tracking-wide text-[#334155]">CERTIFICATIONS</h2>
              </div>
              <ul className="text-sm space-y-1 ml-4">
                {certifications.map((cert) => (
                  <li key={cert.id} className="flex">
                    <span className="mr-2">•</span>
                    <span>
                      <strong>{cert.name}</strong> | {cert.issuer}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Professional Affiliations */}
          <div className="mb-6">
            <div className="bg-[#e2e8f0] py-2 px-4 mb-3">
              <h2 className="text-lg font-bold text-center tracking-wide text-[#334155]">PROFESSIONAL AFFILIATIONS</h2>
            </div>
            <p className="text-sm text-center">
              Member, American Public Health Association (APHA) • Board Member, National Association for Home Care & Hospice
            </p>
            <p className="text-sm text-center">
              Fellow, American College of Healthcare Executives (FACHE)
            </p>
          </div>

          {/* Education */}
          {education.length > 0 && (
            <div className="mb-6">
              <div className="bg-[#e2e8f0] py-2 px-4 mb-3">
                <h2 className="text-lg font-bold text-center tracking-wide text-[#334155]">EDUCATION</h2>
              </div>
              <div className="text-center text-sm space-y-1">
                {education.map((edu) => (
                  <p key={edu.id}>
                    <strong>{edu.degree}</strong> | {edu.institution}
                    {edu.endDate && ` | ${edu.endDate}`}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
)

ModernSlate.displayName = 'ModernSlate'
