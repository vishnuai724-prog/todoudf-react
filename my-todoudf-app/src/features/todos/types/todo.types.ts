// ─── Todo domain types ────────────────────────────────────────────────────────

export type Priority = 'low' | 'medium' | 'high'

export type TodoStatus = 'active' | 'completed'

export interface Todo {
  id: string
  text: string
  completed: boolean
  priority: Priority
  createdAt: string   // ISO string
  updatedAt: string   // ISO string
  userId: string
}

export interface CreateTodoDto {
  text: string
  priority: Priority
}

export interface UpdateTodoDto {
  text?: string
  completed?: boolean
  priority?: Priority
}

export type TodoFilter = 'all' | 'active' | 'completed'
