import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { TodoFilter, Priority } from '../types/todo.types'

// ─── UI-only state for the todo dashboard ─────────────────────────────────────
// Server/async state (the actual todo list) lives in TanStack Query.
// This store holds ephemeral filter/search preferences, kept in Zustand
// so Redux DevTools can inspect them during development.

interface TodoUIState {
  filter: TodoFilter
  search: string
  selectedPriority: Priority | 'all'

  // Actions
  setFilter: (filter: TodoFilter) => void
  setSearch: (search: string) => void
  setSelectedPriority: (p: Priority | 'all') => void
  reset: () => void
}

const initialState = {
  filter: 'all' as TodoFilter,
  search: '',
  selectedPriority: 'all' as Priority | 'all',
}

export const useTodoStore = create<TodoUIState>()(
  devtools(
    (set) => ({
      ...initialState,

      setFilter: (filter) =>
        set({ filter }, false, 'todo/setFilter'),

      setSearch: (search) =>
        set({ search }, false, 'todo/setSearch'),

      setSelectedPriority: (selectedPriority) =>
        set({ selectedPriority }, false, 'todo/setSelectedPriority'),

      reset: () =>
        set(initialState, false, 'todo/reset'),
    }),
    { name: 'TodoUIStore' },
  ),
)
