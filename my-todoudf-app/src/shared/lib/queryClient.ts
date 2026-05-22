import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,   // 5 min — data stays fresh
      gcTime: 1000 * 60 * 10,     // 10 min — cache garbage collected
      retry: (failureCount, error: unknown) => {
        const status = (error as { response?: { status: number } })?.response?.status
        if (status && status >= 400 && status < 500) return false
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
      throwOnError: false,
    },
    mutations: {
      retry: 0, // mutations must never auto-retry
    },
  },
})

export default queryClient
