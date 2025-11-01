// Утилиты для работы с авторизацией
import { authAPI } from './api'

const ACCESS_TOKEN_KEY = "access_token"
const REFRESH_TOKEN_KEY = "refresh_token"

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export const setTokens = (accessToken: string, refreshToken: string): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export const clearTokens = (): void => {
  if (typeof window === "undefined") return
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export const isAuthenticated = (): boolean => {
  return !!getAccessToken()
}

// Обновление токена
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null

  try {
    const data = await authAPI.refresh(refreshToken)
    setTokens(data.access_token, data.refresh_token)
    return data.access_token
  } catch (error) {
    clearTokens()
    return null
  }
}

// Вход в систему
export const login = async (email: string, password: string): Promise<void> => {
  const data = await authAPI.login({ email, password })
  setTokens(data.access_token, data.refresh_token)
}

// Регистрация
export const register = async (registerData: {
  email: string
  password: string
  full_name: string
  company_name: string
  inn: string
}): Promise<void> => {
  const data = await authAPI.register(registerData)
  setTokens(data.access_token, data.refresh_token)
}

// Получение текущего пользователя
export const getCurrentUser = async () => {
  return await authAPI.getCurrentUser()
}

// Выход из системы
export const logout = (): void => {
  clearTokens()
  if (typeof window !== "undefined") {
    window.location.href = "/login"
  }
}


