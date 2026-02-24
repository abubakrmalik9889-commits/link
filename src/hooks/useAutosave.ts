'use client'

import { useEffect, useCallback } from 'react'
import { useResumeStore } from '@/store/resumeStore'
import { Resume } from '@/types'

export function useAutosave(resume: Resume | null, delay: number = 3000) {
  const { setLastSaved } = useResumeStore()

  const save = useCallback(async () => {
    if (!resume) return

    setLastSaved(new Date())
  }, [resume, setLastSaved])

  useEffect(() => {
    if (!resume) return

    const timer = setTimeout(() => {
      save()
    }, delay)

    return () => clearTimeout(timer)
  }, [resume, delay, save])
}
