import { Target, TrendingUp, Trophy } from 'lucide-react'
import type { Todo } from '../types/todo.types'

interface TodoStatsProps {
  todos: Todo[]
}

// Derives its own counts — no prop drilling of pre-computed values.
// If this becomes a performance concern, memoize at the call site with useMemo.
export function TodoStats({ todos }: TodoStatsProps) {
  const completedCount = todos.filter((t) => t.completed).length
  const activeCount = todos.filter((t) => !t.completed).length

  const stats = [
    {
      icon: Target,
      label: 'Total',
      value: todos.length,
      color: 'text-violet-400',
      bg: 'bg-violet-400/10 border-violet-400/20',
    },
    {
      icon: TrendingUp,
      label: 'Active',
      value: activeCount,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10 border-amber-400/20',
    },
    {
      icon: Trophy,
      label: 'Done',
      value: completedCount,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10 border-emerald-400/20',
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {stats.map((s) => (
        <div key={s.label} className={`p-4 rounded-2xl border ${s.bg} text-center`}>
          <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
          <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
          <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
