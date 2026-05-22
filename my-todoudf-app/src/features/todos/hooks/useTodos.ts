import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { todosApi } from '../api/todos.api'
import { todoKeys } from '../queries/todoKeys'
import type { Todo, CreateTodoDto, UpdateTodoDto } from '../types/todo.types'

export const useTodos = (userId: string) => {
  const queryClient = useQueryClient()
  const key = todoKeys.all(userId)

  const query = useQuery({
    queryKey: key,
    queryFn: () => todosApi.getAll(userId),
    enabled: !!userId,
  })

  // ── Create ─────────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (dto: CreateTodoDto) => todosApi.create(userId, dto),
    onSuccess: (newTodo) => {
      queryClient.setQueryData<Todo[]>(key, (old = []) => [newTodo, ...old])
      toast.success('Task added!')
    },
    onError: () => toast.error('Failed to add task.'),
  })

  // ── Toggle completed (optimistic) ──────────────────────────────────────────
  const toggleMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      todosApi.update(userId, id, { completed }),
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: key })
      const snapshot = queryClient.getQueryData<Todo[]>(key)
      queryClient.setQueryData<Todo[]>(key, (old = []) =>
        old.map((t) => (t.id === id ? { ...t, completed } : t)),
      )
      return { snapshot }
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(key, ctx?.snapshot)
      toast.error('Failed to update task.')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
    onSuccess: (todo) =>
      toast.success(todo.completed ? 'Task completed! 🎉' : 'Task reopened.'),
  })

  // ── Update (optimistic) ────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTodoDto }) =>
      todosApi.update(userId, id, dto),
    onMutate: async ({ id, dto }) => {
      await queryClient.cancelQueries({ queryKey: key })
      const snapshot = queryClient.getQueryData<Todo[]>(key)
      queryClient.setQueryData<Todo[]>(key, (old = []) =>
        old.map((t) => (t.id === id ? { ...t, ...dto } : t)),
      )
      return { snapshot }
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(key, ctx?.snapshot)
      toast.error('Failed to update task.')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
    onSuccess: () => toast.success('Task updated.'),
  })

  // ── Delete (optimistic) ────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id: string) => todosApi.delete(userId, id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: key })
      const snapshot = queryClient.getQueryData<Todo[]>(key)
      queryClient.setQueryData<Todo[]>(key, (old = []) => old.filter((t) => t.id !== id))
      return { snapshot }
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(key, ctx?.snapshot)
      toast.error('Failed to delete task.')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
    onSuccess: () => toast.success('Task deleted.'),
  })

  // ── Clear completed (optimistic) ───────────────────────────────────────────
  const clearCompletedMutation = useMutation({
    mutationFn: () => todosApi.clearCompleted(userId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: key })
      const snapshot = queryClient.getQueryData<Todo[]>(key)
      queryClient.setQueryData<Todo[]>(key, (old = []) => old.filter((t) => !t.completed))
      return { snapshot }
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(key, ctx?.snapshot)
      toast.error('Failed to clear completed tasks.')
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
    onSuccess: () => toast.success('Completed tasks cleared.'),
  })

  return {
    todos: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,

    createTodo: createMutation.mutate,
    toggleTodo: toggleMutation.mutate,
    updateTodo: updateMutation.mutate,
    deleteTodo: deleteMutation.mutate,
    clearCompleted: clearCompletedMutation.mutate,

    isCreating: createMutation.isPending,
    isToggling: toggleMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isClearingCompleted: clearCompletedMutation.isPending,
  }
}
