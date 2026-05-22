import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authApi } from '../api/auth.api'
import { authKeys } from '../queries/authKeys'
import { useAuthStore } from '../store/authStore'
import type { LoginCredentials, RegisterCredentials } from '../types/auth.types'

export const useAuth = () => {
  const { user, isAuthenticated, setUser, setAccessToken, logout: clearStore } = useAuthStore()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // ── Fetch current user on boot ─────────────────────────────────────────────
  // BUG FIX: onSuccess was removed from useQuery in TanStack Query v5.
  // Side-effects on query data must use useEffect.
  const { data: serverUser, isLoading: isLoadingUser } = useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: authApi.getMe,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (serverUser) setUser(serverUser)
  }, [serverUser, setUser])

  // ── Login ──────────────────────────────────────────────────────────────────
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: ({ user, accessToken }) => {
      setUser(user)
      setAccessToken(accessToken)
      toast.success(`Welcome back, ${user.name}!`)
      navigate('/todos')
    },
    onError: () => toast.error('Invalid credentials. Please try again.'),
  })

  // ── Register ───────────────────────────────────────────────────────────────
  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) => authApi.register(credentials),
    onSuccess: () => {
      toast.success('Account created! Please log in.')
      navigate('/login')
    },
    onError: () => toast.error('Registration failed. Please try again.'),
  })

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      // Always clear local state and cache regardless of API response
      clearStore()
      queryClient.clear()
      navigate('/login')
    },
  })

  return {
    user,
    isAuthenticated,
    isLoadingUser,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  }
}
