import apiClient from '@/shared/api/apiClient'
import type { Todo, CreateTodoDto, UpdateTodoDto } from '../types/todo.types'

export const todosApi = {
  getAll: async (userId: string): Promise<Todo[]> => {
    const { data } = await apiClient.get<Todo[]>(`/users/${userId}/todos`)
    return data
  },

  getById: async (userId: string, id: string): Promise<Todo> => {
    const { data } = await apiClient.get<Todo>(`/users/${userId}/todos/${id}`)
    return data
  },

  create: async (userId: string, dto: CreateTodoDto): Promise<Todo> => {
    const { data } = await apiClient.post<Todo>(`/users/${userId}/todos`, dto)
    return data
  },

  update: async (userId: string, id: string, dto: UpdateTodoDto): Promise<Todo> => {
    const { data } = await apiClient.patch<Todo>(`/users/${userId}/todos/${id}`, dto)
    return data
  },

  delete: async (userId: string, id: string): Promise<void> => {
    await apiClient.delete(`/users/${userId}/todos/${id}`)
  },

  clearCompleted: async (userId: string): Promise<void> => {
    await apiClient.delete(`/users/${userId}/todos`, { params: { completed: true } })
  },
}
