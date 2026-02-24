import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Resume, Template, User } from '@/types'

interface ResumeState {
  // User State
  user: User | null
  setUser: (user: User | null) => void
  
  // Resume State
  currentResume: Resume | null
  setCurrentResume: (resume: Resume | null) => void
  
  // All Resumes
  resumes: Resume[]
  addResume: (resume: Resume) => void
  updateResume: (id: string, updates: Partial<Resume>) => void
  deleteResume: (id: string) => void
  
  // Templates
  selectedTemplate: Template | null
  setSelectedTemplate: (template: Template | null) => void
  
  // Theme
  isDarkMode: boolean
  toggleDarkMode: () => void
  
  // UI State
  isSidebarOpen: boolean
  toggleSidebar: () => void
  
  // Autosave
  lastSaved: Date | null
  setLastSaved: (date: Date) => void
}

const initialResume: Resume = {
  id: '',
  name: 'Untitled Resume',
  templateId: 'modern',
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  customSections: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),
      
      // Current Resume
      currentResume: initialResume,
      setCurrentResume: (resume) => set({ currentResume: resume }),
      
      // All Resumes
      resumes: [],
      addResume: (resume) => set((state) => ({ 
        resumes: [...state.resumes, resume] 
      })),
      updateResume: (id, updates) => set((state) => ({
        resumes: state.resumes.map((r) =>
          r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
        ),
        currentResume: state.currentResume?.id === id 
          ? { ...state.currentResume, ...updates, updatedAt: new Date().toISOString() }
          : state.currentResume
      })),
      deleteResume: (id) => set((state) => ({
        resumes: state.resumes.filter((r) => r.id !== id)
      })),
      
      // Template
      selectedTemplate: null,
      setSelectedTemplate: (template) => set({ selectedTemplate: template }),
      
      // Theme
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      
      // UI
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      
      // Autosave
      lastSaved: null,
      setLastSaved: (date) => set({ lastSaved: date }),
    }),
    {
      name: 'resume-storage',
    }
  )
)
