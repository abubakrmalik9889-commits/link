import { useState, useCallback, useEffect } from 'react'
import { apiClient } from '@/lib/apiClient'
import { User } from '@/types'

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Check if user is already logged in
    useEffect(() => {
        const checkAuth = async () => {
            const token = apiClient.getToken()
            if (token) {
                const response = await apiClient.getCurrentUser()
                if (response.data) {
                    const u = response.data.user
                    const mapped: User = {
                        id: u.id,
                        email: u.email,
                        name: [u.firstName, u.lastName].filter(Boolean).join(' ').trim() || u.email,
                        plan: 'Free',
                        resumes: [],
                        avatar: undefined,
                    }
                    setUser(mapped)
                } else {
                    apiClient.clearToken()
                }
            }
            setLoading(false)
        }

        checkAuth()
    }, [])

    const signup = useCallback(
        async (email: string, password: string, firstName: string, lastName: string) => {
            setLoading(true)
            setError(null)
            try {
                const response = await apiClient.signup({
                    email,
                    password,
                    firstName,
                    lastName,
                })

                if (response.error) {
                    setError(response.error)
                    return false
                }

                if (response.data) {
                    apiClient.setToken(response.data.token)
                    const u = response.data.user
                    const mapped: User = {
                        id: u.id,
                        email: u.email,
                        name: [u.firstName, u.lastName].filter(Boolean).join(' ').trim() || u.email,
                        plan: 'Free',
                        resumes: [],
                        avatar: undefined,
                    }
                    setUser(mapped)
                    return true
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Signup failed'
                setError(message)
            } finally {
                setLoading(false)
            }
            return false
        },
        []
    )

    const login = useCallback(
        async (email: string, password: string) => {
            setLoading(true)
            setError(null)
            try {
                const response = await apiClient.login({
                    email,
                    password,
                })

                if (response.error) {
                    setError(response.error)
                    return false
                }

                if (response.data) {
                    apiClient.setToken(response.data.token)
                    const u = response.data.user
                    const mapped: User = {
                        id: u.id,
                        email: u.email,
                        name: [u.firstName, u.lastName].filter(Boolean).join(' ').trim() || u.email,
                        plan: 'Free',
                        resumes: [],
                        avatar: undefined,
                    }
                    setUser(mapped)
                    return true
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Login failed'
                setError(message)
            } finally {
                setLoading(false)
            }
            return false
        },
        []
    )

    const logout = useCallback(() => {
        apiClient.clearToken()
        setUser(null)
    }, [])

    return {
        user,
        loading,
        error,
        signup,
        login,
        logout,
        isAuthenticated: !!user,
    }
}
