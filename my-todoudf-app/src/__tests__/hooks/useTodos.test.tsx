import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { useTodos } from '@/features/todos/hooks/useTodos'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useTodos', () => {
  it('fetches and returns todos for a user', async () => {
    const { result } = renderHook(() => useTodos('user-1'), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.todos).toEqual([])

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.todos).toHaveLength(2)
    expect(result.current.todos[0].text).toBe('Write tests')
    expect(result.current.todos[1].text).toBe('Ship it')
  })

  it('returns empty array and does not fetch when userId is empty', () => {
    const { result } = renderHook(() => useTodos(''), {
      wrapper: createWrapper(),
    })
    expect(result.current.isLoading).toBe(false)
    expect(result.current.todos).toEqual([])
  })

  it('exposes correct loading state during fetch', () => {
    const { result } = renderHook(() => useTodos('user-1'), {
      wrapper: createWrapper(),
    })
    expect(result.current.isLoading).toBe(true)
  })
})
