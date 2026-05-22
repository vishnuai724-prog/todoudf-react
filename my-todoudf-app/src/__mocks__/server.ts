import { setupServer } from 'msw/node'
import { authHandlers } from './handlers/auth.handlers'
import { todoHandlers } from './handlers/todos.handlers'

export const server = setupServer(...authHandlers, ...todoHandlers)
