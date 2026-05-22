import type { Priority } from '../types/todo.types'

export interface PriorityMeta {
  label: string
  dot: string    // Tailwind bg class for the dot indicator
  color: string  // Tailwind text class for the label
  badge: 'default' | 'secondary' | 'warning' | 'destructive'
}

// Single source of truth for priority display across all todo components.
// Previously this was an inline constant inside TodoDashboard — moving it
// here makes it importable by TodoRow, AddTodoForm, and any future components.
export const PRIORITY_CONFIG: Record<Priority, PriorityMeta> = {
  low:    { label: 'Low',    dot: 'bg-slate-400', color: 'text-slate-400', badge: 'secondary' },
  medium: { label: 'Medium', dot: 'bg-amber-400', color: 'text-amber-400', badge: 'warning' },
  high:   { label: 'High',   dot: 'bg-red-400',   color: 'text-red-400',   badge: 'destructive' },
}
