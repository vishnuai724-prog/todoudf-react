import { useMutation } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'
import { useAuthStore } from '../store/authStore'

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser)
  const setAccessToken = useAuthStore((s) => s.setAccessToken)

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ user, accessToken }) => {
      setUser(user)
      setAccessToken(accessToken)
    },
  })
}
