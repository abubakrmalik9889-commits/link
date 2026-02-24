'use client'

import { Resume } from '@/types'
import { forwardRef } from 'react'
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'

interface TemplateProps {
  resume: Resume
}

export const CreativeSidebar = forwardRef<HTMLDivElement, TemplateProps>(
  ({ resume }, ref) => {
    const { personalInfo, summary, experience, education, skills } = resume

    return (
      <div
        ref={ref}
        className="w-full max-w-[210mm] mx-auto bg-white text-black font-sans flex"
        style={{ minHeight: '297mm' }}
      >
        {/* Left Sidebar */}
        <div className="w-[35%] bg-[#d4d4d8] p-8">
          {/* Profile Image Placeholder */}
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center">
              <div className="w-28 h-28 rounded-full border-4 border-[#d4d4d8] flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800">Contact</h3>
            <div className="space-y-3 text-sm">
              {personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="break-all">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.linkedIn && (
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>Portfolio</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800">Skills</h3>
              <ul className="space-y-2 text-sm">
                {skills.slice(0, 6).map((skill) => (
                  <li key={skill.id} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-700 rounded-full"></span>
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Software/Expertise */}
          <div className="mb-8">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800">Software</h3>
            <div className="space-y-3">
              {['Adobe Suite', 'AutoCAD', 'Figma'].map((software) => (
                <div key={software}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{software}</span>
                  </div>
                  <div className="h-2 bg-gray-400 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-700 rounded-full"
                      style={{ width: `${Math.random() * 30 + 70}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-800">Languages</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span>English</span>
                <span className="text-xs text-gray-600">(Native)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Spanish</span>
                <span className="text-xs text-gray-600">(Proficient)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>French</span>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-700 rounded-full"></span>
                  <span className="w-2 h-2 bg-gray-700 rounded-full"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-[65%] p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p className="text-lg text-gray-600 uppercase tracking-wide">
              {personalInfo.title}
            </p>
          </div>

          {/* Profile */}
          {summary && (
            <div className="mb-8">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b-2 border-gray-800 pb-2 mb-4">
                Profile
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {experience.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b-2 border-gray-800 pb-2 mb-4">
                Work Experience
              </h2>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="mb-2">
                      <h3 className="font-bold text-sm">{exp.position}</h3>
                      <p className="text-sm text-gray-600">
                        {exp.company} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </p>
                    </div>
                    <ul className="text-sm space-y-1 text-gray-700">
                      {exp.achievements.slice(0, 2).map((achievement, idx) => (
                        <li key={idx} className="flex">
                          <span className="mr-2">•</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider border-b-2 border-gray-800 pb-2 mb-4">
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-bold text-sm">{edu.degree}</h3>
                    <p className="text-sm text-gray-600">
                      {edu.institution} | {edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
)

CreativeSidebar.displayName = 'CreativeSidebar'
