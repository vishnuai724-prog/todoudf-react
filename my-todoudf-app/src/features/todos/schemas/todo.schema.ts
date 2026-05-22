import { z } from 'zod'
import { type Priority } from '../types/todo.types'

// ─── Priority enum ────────────────────────────────────────────────────────────
export const priorityEnum = z.enum(['low', 'medium', 'high'] as [Priority, ...Priority[]])

// ─── Create todo schema ───────────────────────────────────────────────────────
export const createTodoSchema = z.object({
  text: z
    .string()
    .min(1, 'Task description is required')
    .max(200, 'Task description must be at most 200 characters')
    .trim(),
  priority: priorityEnum,
})

export type CreateTodoFormData = z.infer<typeof createTodoSchema>
