import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { configureApiClient } from '@/shared/api/apiClient'
import { useAuthStore } from '@/features/auth'
import queryClient from '@/shared/lib/queryClient'
import AppRoutes from './routes/AppRoutes'
import { ErrorBoundary } from '@/shared/components/common/ErrorBoundary'

configureApiClient({
  getAccessToken: () => useAuthStore.getState().accessToken,
  onTokenRefreshed: (token) => useAuthStore.getState().setAccessToken(token),
  onUnauthorized: () => {
    useAuthStore.getState().logout()
    window.location.replace('/login')
  },
})

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                background: 'rgba(15, 15, 36, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#f1f5f9',
              },
            }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
