import apiClient from '@/shared/api/apiClient'
import type { User, LoginCredentials, RegisterCredentials } from '../types/auth.types'

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; accessToken: string }> => {
    const { data } = await apiClient.post<{ user: User; accessToken: string }>(
      '/auth/login',
      credentials,
    )
    return data
  },

  register: async (credentials: RegisterCredentials): Promise<void> => {
    await apiClient.post('/auth/register', credentials)
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout') // clears HttpOnly refresh token cookie
  },

  getMe: async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/auth/me')
    return data
  },
}
