import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import queryClient from '@/shared/lib/queryClient'
import AppRoutes from './routes/AppRoutes'
import { ErrorBoundary } from '@/shared/components/common/ErrorBoundary'

// ─── App — provider shell only. No business logic here. ──────────────────────
export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
          {/* Sonner toast portal — renders outside the component tree */}
          <Toaster
            position="bottom-right"
            theme="dark"
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
