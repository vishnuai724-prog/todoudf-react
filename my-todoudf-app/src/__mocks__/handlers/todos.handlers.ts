import { http, HttpResponse } from 'msw'
import { env } from '@/shared/lib/env'

const BASE = env.VITE_API_URL

const mockTodos = [
  {
    id: 'todo-1',
    text: 'Write tests',
    completed: false,
    priority: 'high',
    createdAt: new Date().toISOString(),
    userId: 'user-1',
  },
  {
    id: 'todo-2',
    text: 'Ship it',
    completed: true,
    priority: 'medium',
    createdAt: new Date().toISOString(),
    userId: 'user-1',
  },
]

export const todoHandlers = [
  // GET /users/:userId/todos
  http.get(`${BASE}/users/:userId/todos`, () =>
    HttpResponse.json(mockTodos),
  ),

  // POST /users/:userId/todos
  http.post(`${BASE}/users/:userId/todos`, async ({ request, params }) => {
    const body = await request.json() as { text: string; priority: string }
    const newTodo = {
      id: `todo-${Date.now()}`,
      text: body.text,
      completed: false,
      priority: body.priority ?? 'medium',
      createdAt: new Date().toISOString(),
      userId: params.userId as string,
    }
    return HttpResponse.json(newTodo, { status: 201 })
  }),

  // PATCH /users/:userId/todos/:id
  http.patch(`${BASE}/users/:userId/todos/:id`, async ({ request, params }) => {
    const body = await request.json() as Record<string, unknown>
    const todo = mockTodos.find((t) => t.id === params.id)
    if (!todo) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json({ ...todo, ...body })
  }),

  // DELETE /users/:userId/todos/:id
  http.delete(`${BASE}/users/:userId/todos/:id`, () =>
    new HttpResponse(null, { status: 204 }),
  ),
]
