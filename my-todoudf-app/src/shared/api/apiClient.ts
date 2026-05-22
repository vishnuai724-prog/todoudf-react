import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { env } from '@/shared/lib/env'
import { ApiError } from '@/shared/lib/apiError'

let _getAccessToken: () => string | null = () => null
let _onUnauthorized: () => void = () => window.location.replace('/login')
let _onTokenRefreshed: (token: string) => void = () => {}

export interface ApiClientConfig {
  getAccessToken: () => string | null
  onUnauthorized: () => void
  onTokenRefreshed?: (token: string) => void
}

export function configureApiClient(config: ApiClientConfig): void {
  _getAccessToken = config.getAccessToken
  _onUnauthorized = config.onUnauthorized
  _onTokenRefreshed = config.onTokenRefreshed ?? (() => {})
}

const apiClient = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = _getAccessToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

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

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return apiClient(original)
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(
          `${env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        )
        const newToken: string = data.accessToken
        _onTokenRefreshed(newToken)
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
        processQueue(null, newToken)
        original.headers.Authorization = `Bearer ${newToken}`
        return apiClient(original)
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        _onUnauthorized()
        const apiErr = refreshErr instanceof AxiosError
          ? ApiError.fromAxiosError(refreshErr)
          : ApiError.unknown()
        return Promise.reject(apiErr)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(ApiError.fromAxiosError(error))
  },
)

export default apiClient
