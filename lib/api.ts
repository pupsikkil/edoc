// API клиент для работы с backend
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { getAccessToken, getRefreshToken, clearTokens, setTokens } from './auth'

// Базовый URL для API (в продакшене должен быть в env переменных)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Создаём экземпляр axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Для CORS
})

// Интерсептор для добавления токена авторизации
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Интерсептор для обработки ошибок и обновления токенов
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (error?: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Если ошибка 401 и это не повторная попытка
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Если уже идёт обновление токена, добавляем запрос в очередь
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return apiClient(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        clearTokens()
        processQueue(new Error('Нет refresh token'), null)
        isRefreshing = false
        return Promise.reject(error)
      }

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          null,
          {
            params: { refresh_token: refreshToken },
          }
        )

        const { access_token, refresh_token } = response.data
        setTokens(access_token, refresh_token)

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`
        }

        processQueue(null, access_token)
        isRefreshing = false

        return apiClient(originalRequest)
      } catch (refreshError) {
        clearTokens()
        processQueue(refreshError, null)
        isRefreshing = false
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Типы для API запросов
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  full_name: string
  company_name: string
  inn: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface UserResponse {
  id: number
  email: string
  full_name: string
  role: string
  is_active: boolean
  company_id: number
}

export interface Document {
  id: number
  title: string
  document_type: string
  number: string
  status: string
  created_at: string
  updated_at: string
  // Добавить остальные поля
}

// API методы
export const authAPI = {
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const formData = new URLSearchParams()
    formData.append('username', data.email)
    formData.append('password', data.password)
    
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  },

  register: async (data: RegisterRequest): Promise<TokenResponse> => {
    const response = await apiClient.post('/api/auth/register', data)
    return response.data
  },

  refresh: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/refresh`,
      null,
      { params: { refresh_token: refreshToken } }
    )
    return response.data
  },

  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await apiClient.get('/api/auth/me')
    return response.data
  },
}

export const documentsAPI = {
  getAll: async (params?: {
    skip?: number
    limit?: number
    status?: string
    document_type?: string
  }): Promise<Document[]> => {
    const response = await apiClient.get('/api/documents', { params })
    return response.data
  },

  getById: async (id: number): Promise<Document> => {
    const response = await apiClient.get(`/api/documents/${id}`)
    return response.data
  },

  create: async (data: Partial<Document>): Promise<Document> => {
    const response = await apiClient.post('/api/documents', data)
    return response.data
  },

  update: async (id: number, data: Partial<Document>): Promise<Document> => {
    const response = await apiClient.put(`/api/documents/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/documents/${id}`)
  },
}

export const partnersAPI = {
  getAll: async () => {
    const response = await apiClient.get('/api/partners')
    return response.data
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/api/partners/${id}`)
    return response.data
  },

  create: async (data: any) => {
    const response = await apiClient.post('/api/partners', data)
    return response.data
  },

  update: async (id: number, data: any) => {
    const response = await apiClient.put(`/api/partners/${id}`, data)
    return response.data
  },

  delete: async (id: number) => {
    await apiClient.delete(`/api/partners/${id}`)
  },
}

export const companiesAPI = {
  getCurrentCompany: async () => {
    const response = await apiClient.get('/api/companies/me')
    return response.data
  },

  update: async (data: any) => {
    const response = await apiClient.put('/api/companies/me', data)
    return response.data
  },
}

export const filesAPI = {
  upload: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post('/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  download: async (fileId: string) => {
    const response = await apiClient.get(`/api/files/${fileId}`, {
      responseType: 'blob',
    })
    return response.data
  },

  delete: async (fileId: string) => {
    await apiClient.delete(`/api/files/${fileId}`)
  },
}

export const signatureAPI = {
  uploadCertificate: async (data: FormData) => {
    const response = await apiClient.post('/api/signature/certificate', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  signDocument: async (documentId: number, password: string) => {
    const response = await apiClient.post(`/api/signature/sign/${documentId}`, {
      password,
    })
    return response.data
  },

  verifySignature: async (documentId: number) => {
    const response = await apiClient.post(`/api/signature/verify/${documentId}`)
    return response.data
  },
}

export { apiClient }

