import axios from 'axios'

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://0a61a587-17a2-4b20-9479-87ca58099dc5-00-2s9fegt6oci7z.riker.replit.dev:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const endpoints = {
  // Auth
  login: '/auth/login',
  register: '/auth/register',
  me: '/auth/me',
  
  // Reports
  reports: '/reports',
  report: (id: number) => `/reports/${id}`,
  deleteReport: (id: number) => `/reports/${id}`,
  
  // Analysis
  upload: '/upload',
  spendScore: '/spend-score',
  downloadReport: '/report',
  
  // System
  health: '/health',
  verifyClone: '/verify-clone',
  docs: '/docs'
}

// Generic API functions
export const apiClient = {
  get: (url: string, config = {}) => api.get(url, config),
  post: (url: string, data = {}, config = {}) => api.post(url, data, config),
  put: (url: string, data = {}, config = {}) => api.put(url, data, config),
  delete: (url: string, config = {}) => api.delete(url, config),
  patch: (url: string, data = {}, config = {}) => api.patch(url, data, config),
}

export default api
