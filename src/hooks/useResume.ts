import { useState, useCallback } from 'react'
import { apiClient } from '@/lib/apiClient'
import { Resume } from '@/types'

export function useResume() {
    const [resumes, setResumes] = useState<Resume[]>([])
    const [currentResume, setCurrentResume] = useState<Resume | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchResumes = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await apiClient.getResumes()

            if (response.error) {
                setError(response.error)
                // Fallback: load from local storage if API not available
                if (typeof window !== 'undefined') {
                    const raw = localStorage.getItem('resume-storage')
                    if (raw) {
                        try {
                            const parsed = JSON.parse(raw)
                            const localResumes = parsed?.state?.resumes as Resume[] | undefined
                            if (localResumes && Array.isArray(localResumes)) {
                                setResumes(localResumes)
                                return true
                            }
                        } catch { /* ignore */ }
                    }
                }
                return false
            }

            if (response.data) {
                setResumes(response.data)
                return true
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch resumes'
            setError(message)
            // Fallback: try local storage
            if (typeof window !== 'undefined') {
                const raw = localStorage.getItem('resume-storage')
                if (raw) {
                    try {
                        const parsed = JSON.parse(raw)
                        const localResumes = parsed?.state?.resumes as Resume[] | undefined
                        if (localResumes && Array.isArray(localResumes)) {
                            setResumes(localResumes)
                            return true
                        }
                    } catch { /* ignore */ }
                }
            }
        } finally {
            setLoading(false)
        }
        return false
    }, [])

    const fetchResume = useCallback(async (id: string) => {
        setLoading(true)
        setError(null)
        try {
            const response = await apiClient.getResume(id)

            if (response.error) {
                setError(response.error)
                return false
            }

            if (response.data) {
                setCurrentResume(response.data)
                return true
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch resume'
            setError(message)
        } finally {
            setLoading(false)
        }
        return false
    }, [])

    const createResume = useCallback(
        async (resumeData: Partial<Resume>) => {
            setLoading(true)
            setError(null)
            try {
                const response = await apiClient.createResume(resumeData)

                if (response.error) {
                    setError(response.error)
                    return false
                }

                if (response.data) {
                    const newResume = response.data
                    setResumes([newResume, ...resumes])
                    setCurrentResume(newResume)
                    return true
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to create resume'
                setError(message)
            } finally {
                setLoading(false)
            }
            return false
        },
        [resumes]
    )

    const updateResume = useCallback(
        async (id: string, updates: Partial<Resume>) => {
            setLoading(true)
            setError(null)
            try {
                const response = await apiClient.updateResume(id, updates)

                if (response.error) {
                    setError(response.error)
                    return false
                }

                if (response.data) {
                    const updatedResume = response.data
                    setResumes(
                        resumes.map((r) =>
                            r.id === id ? updatedResume : r
                        )
                    )
                    setCurrentResume(updatedResume)
                    return true
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to update resume'
                setError(message)
            } finally {
                setLoading(false)
            }
            return false
        },
        [resumes]
    )

    const deleteResume = useCallback(
        async (id: string) => {
            setLoading(true)
            setError(null)
            try {
                const response = await apiClient.deleteResume(id)

                if (response.error) {
                    setError(response.error)
                    return false
                }

                setResumes(resumes.filter((r) => r.id !== id))
                if (currentResume?.id === id) {
                    setCurrentResume(null)
                }
                return true
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to delete resume'
                setError(message)
            } finally {
                setLoading(false)
            }
            return false
        },
        [resumes, currentResume]
    )

    const getPublicResume = useCallback(async (shareableLink: string) => {
        setLoading(true)
        setError(null)
        try {
            const response = await apiClient.getPublicResume(shareableLink)

            if (response.error) {
                setError(response.error)
                return null
            }

            return response.data as Resume | undefined
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch resume'
            setError(message)
            return null
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        resumes,
        currentResume,
        loading,
        error,
        fetchResumes,
        fetchResume,
        createResume,
        updateResume,
        deleteResume,
        getPublicResume,
    }
}
