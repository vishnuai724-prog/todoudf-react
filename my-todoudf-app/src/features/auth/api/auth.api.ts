import apiClient from '@/shared/api/apiClient'
import type { User, LoginCredentials, RegisterCredentials, LoginResponse } from '../types/auth.types'

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', credentials)
    return data
  },

  register: async (credentials: RegisterCredentials): Promise<void> => {
    await apiClient.post('/auth/register', credentials)
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout') // clears HttpOnly refresh-token cookie
  },

  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/auth/me')
    return data
  },
}
