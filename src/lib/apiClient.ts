// API client for communicating with Fastify backend
import { Resume } from '@/types'

const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : '')

interface ApiResponse<T> {
    data?: T
    error?: string
    message?: string
}

class ApiClient {
    private token: string | null = null

    constructor() {
        // Get token from localStorage on initialization
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('authToken')
        }
    }

    setToken(token: string) {
        this.token = token
        localStorage.setItem('authToken', token)
    }

    getToken(): string | null {
        return this.token
    }

    clearToken() {
        this.token = null
        localStorage.removeItem('authToken')
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        if (!API_URL) {
            return { error: 'Missing NEXT_PUBLIC_API_URL in production environment' }
        }
        const url = `${API_URL}${endpoint}`

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        }

        if (this.token) {
            headers.Authorization = `Bearer ${this.token}`
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            })

            const data = await response.json()

            if (!response.ok) {
                return {
                    error: data.error || 'An error occurred',
                }
            }

            return { data }
        } catch (error) {
            return {
                error: error instanceof Error ? error.message : 'Failed to connect to server',
            }
        }
    }

    // Auth endpoints
    async signup(credentials: {
        email: string
        password: string
        firstName: string
        lastName: string
    }) {
        return this.request<{ token: string; user: Resume['personalInfo'] & { id: string } }>('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(credentials),
        })
    }

    async login(credentials: { email: string; password: string }) {
        return this.request<{ token: string; user: Resume['personalInfo'] & { id: string } }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        })
    }

    async getCurrentUser() {
        return this.request<{ user: Resume['personalInfo'] & { id: string } }>('/auth/me', {
            method: 'GET',
        })
    }

    // Resume endpoints
    async createResume(resume: Partial<Resume>) {
        return this.request<Resume>('/resumes', {
            method: 'POST',
            body: JSON.stringify(resume),
        })
    }

    async getResumes() {
        return this.request<Resume[]>('/resumes', {
            method: 'GET',
        })
    }

    async getResume(id: string) {
        return this.request<Resume>(`/resumes/${id}`, {
            method: 'GET',
        })
    }

    async updateResume(id: string, updates: Partial<Resume>) {
        return this.request<Resume>(`/resumes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        })
    }

    async deleteResume(id: string) {
        return this.request<{ success: boolean }>(`/resumes/${id}`, {
            method: 'DELETE',
        })
    }

    async getPublicResume(shareableLink: string) {
        return this.request<Resume>(`/resumes/public/${shareableLink}`, {
            method: 'GET',
        })
    }
}

export const apiClient = new ApiClient()
