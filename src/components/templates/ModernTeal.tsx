'use client'

import { Resume } from '@/types'
import { forwardRef } from 'react'

interface TemplateProps {
  resume: Resume
}

export const ModernTeal = forwardRef<HTMLDivElement, TemplateProps>(
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
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-6 bg-[#0d7377]"></div>
                <h2 className="text-xl font-bold text-black">SUMMARY</h2>
              </div>
              <p className="text-sm leading-relaxed text-justify ml-6">{summary}</p>
            </div>
          )}

          {/* Areas of Expertise */}
          {skills.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-6 bg-[#0d7377]"></div>
                <h2 className="text-xl font-bold text-black">AREAS OF EXPERTISE</h2>
              </div>
              <div className="text-sm ml-6">
                {skills.map((skill, index) => (
                  <span key={skill.id}>
                    {skill.name}
                    {index < skills.length - 1 && (
                      <span className="mx-2">▪</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Professional Experience */}
          {experience.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-6 bg-[#0d7377]"></div>
                <h2 className="text-xl font-bold text-black">PROFESSIONAL EXPERIENCE</h2>
              </div>
              <div className="space-y-5 ml-6">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="font-bold text-base">
                        {exp.position} | <span className="font-normal">{exp.company}</span>
                      </h3>
                      <span className="text-sm italic">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <ul className="text-sm space-y-1 ml-4">
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex">
                          <span className="mr-2">▪</span>
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
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-6 bg-[#0d7377]"></div>
                <h2 className="text-xl font-bold text-black">CERTIFICATIONS</h2>
              </div>
              <ul className="text-sm space-y-1 ml-6">
                {certifications.map((cert) => (
                  <li key={cert.id} className="flex">
                    <span className="mr-2">▪</span>
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
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-6 bg-[#0d7377]"></div>
              <h2 className="text-xl font-bold text-black">PROFESSIONAL AFFILIATIONS</h2>
            </div>
            <p className="text-sm ml-6">
              Member, American Public Health Association (APHA) ▪ Board Member, National Association for Home Care & Hospice
            </p>
            <p className="text-sm ml-6">
              Fellow, American College of Healthcare Executives (FACHE)
            </p>
          </div>

          {/* Education */}
          {education.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-6 bg-[#0d7377]"></div>
                <h2 className="text-xl font-bold text-black">EDUCATION</h2>
              </div>
              <div className="text-sm ml-6 space-y-1">
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

ModernTeal.displayName = 'ModernTeal'
