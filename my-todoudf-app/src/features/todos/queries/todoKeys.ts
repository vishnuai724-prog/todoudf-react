// ─── Todo query key factory ───────────────────────────────────────────────────
// Co-located with the todos feature. All keys are rooted at ['todos', userId],
// so invalidateQueries({ queryKey: todoKeys.all(userId) }) busts the entire
// user's todo cache (list + detail + filtered views) in one call.

export const todoKeys = {
  all: (userId: string) => ['todos', userId] as const,
  detail: (userId: string, id: string) => ['todos', userId, id] as const,
  byFilter: (userId: string, filter: string) => ['todos', userId, 'filter', filter] as const,
} as const
