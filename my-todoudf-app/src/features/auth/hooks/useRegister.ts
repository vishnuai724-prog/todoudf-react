import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authApi } from '../api/auth.api'
import { ROUTES } from '@/shared/constants/routes'
import type { ApiError } from '@/shared/lib/apiError'
import type { RegisterFormData } from '../schemas/auth.schema'

export function useRegister() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ confirmPassword: _cp, ...credentials }: RegisterFormData) =>
      authApi.register(credentials),
    onSuccess: () => {
      toast.success('Account created! Please log in.')
      navigate(ROUTES.LOGIN)
    },
    onError: (error: ApiError) => {
      const firstDetail = error.details
        ? Object.values(error.details).flat()[0]
        : undefined
      toast.error(firstDetail ?? error.message)
    },
  })
}
