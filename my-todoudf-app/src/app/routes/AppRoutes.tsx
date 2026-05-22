import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { useAuth } from '@/features/auth/hooks/useAuth'
import LoadingSpinner from '@/shared/components/common/LoadingSpinner'

// ─── Lazy-loaded pages — each page becomes a separate JS chunk ────────────────
const HomePage      = lazy(() => import('@/app/pages/HomePage'))
const LoginPage     = lazy(() => import('@/features/auth/pages/LoginPage'))
const RegisterPage  = lazy(() => import('@/features/auth/pages/RegisterPage'))
const TodoDashboard = lazy(() => import('@/features/todos/pages/TodoDashboard'))

// ─── ProtectedRoute — reads auth state from Zustand via useAuth ──────────────
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />
}

// ─── App routes ───────────────────────────────────────────────────────────────
export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path={ROUTES.HOME}     element={<HomePage />} />
        <Route path={ROUTES.LOGIN}    element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route
          path={ROUTES.TODOS}
          element={
            <ProtectedRoute>
              <TodoDashboard />
            </ProtectedRoute>
          }
        />
        {/* Catch-all */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </Suspense>
  )
}
