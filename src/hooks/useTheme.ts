'use client'

import { useEffect } from 'react'
import { useResumeStore } from '@/store/resumeStore'

export function useTheme() {
  const { isDarkMode, toggleDarkMode } = useResumeStore()

  useEffect(() => {
    const root = window.document.documentElement
    
    if (isDarkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDarkMode])

  return { isDarkMode, toggleDarkMode }
}
