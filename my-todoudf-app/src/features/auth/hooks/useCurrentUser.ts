import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'
import { authKeys } from '../queries/authKeys'
import { useAuthStore } from '../store/authStore'

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const setUser = useAuthStore((s) => s.setUser)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: authApi.getMe,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (data) setUser(data)
  }, [data, setUser])

  return {
    user: data ?? null,
    isLoading,
    isError,
    error,
  }
}
