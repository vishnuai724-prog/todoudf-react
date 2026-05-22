import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Badge } from '@/shared/components/ui/badge'
import { PRIORITY_CONFIG } from '../constants/priorityConfig'
import type { Todo } from '../types/todo.types'
import { Trash2 } from 'lucide-react'

dayjs.extend(relativeTime)

interface TodoRowProps {
  todo: Todo
  onToggle: (args: { id: string; completed: boolean }) => void
  onDelete: (id: string) => void
}

export function TodoRow({ todo, onToggle, onDelete }: TodoRowProps) {
  const priority = PRIORITY_CONFIG[todo.priority]

  return (
    <div
      className={`group/row flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
        todo.completed
          ? 'bg-white/[0.02] border-white/5 opacity-60'
          : 'bg-white/5 border-white/10 hover:border-violet-500/30 hover:bg-violet-500/5'
      }`}
      id={`todo-item-${todo.id}`}
    >
      <Checkbox
        id={`todo-check-${todo.id}`}
        checked={todo.completed}
        onCheckedChange={() => onToggle({ id: todo.id, completed: !todo.completed })}
      />

      <span
        className={`flex-1 text-sm ${
          todo.completed ? 'line-through text-slate-500' : 'text-slate-200'
        }`}
      >
        {todo.text}
      </span>

      <span className={`hidden sm:flex items-center gap-1.5 text-xs ${priority.color}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
        {priority.label}
      </span>

      <span className="hidden md:block text-xs text-slate-500 shrink-0">
        {dayjs(todo.createdAt).fromNow()}
      </span>

      {todo.completed && (
        <Badge variant="success" className="text-xs hidden sm:inline-flex">
          Done
        </Badge>
      )}

      <button
        onClick={() => onDelete(todo.id)}
        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer opacity-0 group-hover/row:opacity-100"
        id={`todo-delete-${todo.id}`}
        aria-label={`Delete "${todo.text}"`}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
