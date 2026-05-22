// ─── Auth query key factory ───────────────────────────────────────────────────
// Co-located with the auth feature. Typed with `as const` for tuple inference —
// enables precise prefix-matching in invalidateQueries({ queryKey: authKeys.all }).

export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'currentUser'] as const,
} as const
