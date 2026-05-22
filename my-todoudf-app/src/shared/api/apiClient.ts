import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/features/auth/store/authStore'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // send cookies if backend uses HttpOnly
})

// ── Request — inject access token from Zustand (no localStorage parsing) ──────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response — silent token refresh with request queue ────────────────────────
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)))
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return apiClient(original)
        })
        .catch(Promise.reject)
    }

    original._retry = true
    isRefreshing = true

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        {},
        { withCredentials: true }, // refresh token via HttpOnly cookie
      )

      const newAccessToken: string = data.accessToken
      useAuthStore.getState().setAccessToken(newAccessToken)
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`

      processQueue(null, newAccessToken)
      original.headers.Authorization = `Bearer ${newAccessToken}`
      return apiClient(original)
    } catch (err) {
      processQueue(err, null)
      useAuthStore.getState().logout()
      window.location.replace('/login')
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  },
)

export default apiClient
