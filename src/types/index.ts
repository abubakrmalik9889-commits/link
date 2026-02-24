export interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  linkedIn?: string
  website?: string
  title: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  achievements: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa?: string
}

export interface Skill {
  id: string
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  link?: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  expiry?: string
}

export interface CustomSection {
  id: string
  title: string
  items: string[]
}

export interface Resume {
  _id?: string
  id: string
  name: string
  templateId: string
  personalInfo: PersonalInfo
  summary: string
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  certifications: Certification[]
  customSections: CustomSection[]
  createdAt: string
  updatedAt: string
}

export interface Template {
  id: string
  name: string
  category: 'Modern' | 'Executive' | 'Creative' | 'Minimal' | 'Tech'
  thumbnail: string
  description: string
  premium: boolean
  colors: string[]
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  plan: 'Free' | 'Pro' | 'Premium' | 'Enterprise'
  resumes: Resume[]
}

export interface Theme {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textMuted: string
}
