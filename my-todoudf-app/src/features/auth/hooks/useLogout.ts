import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth.api'
import { useAuthStore } from '../store/authStore'
import { ROUTES } from '@/shared/constants/routes'
import type { ApiError } from '@/shared/lib/apiError'

export function useLogout() {
  const logout = useAuthStore((s) => s.logout)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      logout()
      queryClient.clear()
      navigate(ROUTES.LOGIN, { replace: true })
    },
    onError: (error: ApiError) => {
      if (error.isServerError) {
        console.error('[logout] Server error:', error.message)
      }
    },
  })
}
