import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { useAuthStore } from '@/features/auth'
import LoadingSpinner from '@/shared/components/common/LoadingSpinner'
import { FeatureBoundary } from '@/shared/components/common/FeatureBoundary'

const HomePage      = lazy(() => import('@/app/pages/HomePage'))
const LoginPage     = lazy(() => import('@/features/auth/pages/LoginPage'))
const RegisterPage  = lazy(() => import('@/features/auth/pages/RegisterPage'))
const TodoDashboard = lazy(() => import('@/features/todos/pages/TodoDashboard'))

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to={ROUTES.LOGIN} replace />
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />

        <Route
          path={ROUTES.LOGIN}
          element={
            <FeatureBoundary feature="Login">
              <LoginPage />
            </FeatureBoundary>
          }
        />

        <Route
          path={ROUTES.REGISTER}
          element={
            <FeatureBoundary feature="Register">
              <RegisterPage />
            </FeatureBoundary>
          }
        />

        <Route
          path={ROUTES.TODOS}
          element={
            <ProtectedRoute>
              <FeatureBoundary feature="Todos">
                <TodoDashboard />
              </FeatureBoundary>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </Suspense>
  )
}
