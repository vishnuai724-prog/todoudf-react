import { useAuthStore } from '../store/authStore'
import { useCurrentUser } from './useCurrentUser'
import { useLogin } from './useLogin'
import { useLogout } from './useLogout'
import { useRegister } from './useRegister'

export function useAuth() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const { user, isLoading: isLoadingUser } = useCurrentUser()
  const loginMutation = useLogin()
  const logoutMutation = useLogout()
  const registerMutation = useRegister()

  return {
    user,
    isAuthenticated,
    isLoadingUser,

    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    register: registerMutation.mutate,

    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isRegistering: registerMutation.isPending,
  }
}
