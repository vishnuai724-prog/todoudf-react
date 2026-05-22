// ─── Typed route constants — single source of truth for all paths ─────────────

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  TODOS: '/todos',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
