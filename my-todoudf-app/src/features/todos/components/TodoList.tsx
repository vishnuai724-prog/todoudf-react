import { useMemo } from 'react'
import { Input } from '@/shared/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/tabs'
import { TodoRow } from './TodoRow'
import { Search, Target, Trophy } from 'lucide-react'
import type { Todo, TodoFilter } from '../types/todo.types'

interface TodoListProps {
  todos: Todo[]
  isLoading: boolean
  filter: TodoFilter
  search: string
  onToggle: (args: { id: string; completed: boolean }) => void
  onDelete: (id: string) => void
  onClearCompleted: () => void
  onFilterChange: (filter: TodoFilter) => void
  onSearchChange: (search: string) => void
}

const SKELETON_COUNT = 3
const ALL_FILTERS: TodoFilter[] = ['all', 'active', 'completed']

export function TodoList({
  todos,
  isLoading,
  filter,
  search,
  onToggle,
  onDelete,
  onClearCompleted,
  onFilterChange,
  onSearchChange,
}: TodoListProps) {
  const filteredTodos = useMemo(() => {
    let list = todos
    if (search) {
      const lower = search.toLowerCase()
      list = list.filter((t) => t.text.toLowerCase().includes(lower))
    }
    if (filter === 'active') list = list.filter((t) => !t.completed)
    if (filter === 'completed') list = list.filter((t) => t.completed)
    return list
  }, [todos, filter, search])

  const completedCount = todos.filter((t) => t.completed).length
  const activeCount = todos.filter((t) => !t.completed).length

  return (
    <>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        <Input
          id="todo-search"
          placeholder="Search todos…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Tabs value={filter} onValueChange={(v) => onFilterChange(v as TodoFilter)} id="todo-tabs">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all" id="tab-all">
              All ({todos.length})
            </TabsTrigger>
            <TabsTrigger value="active" id="tab-active">
              Active ({activeCount})
            </TabsTrigger>
            <TabsTrigger value="completed" id="tab-completed">
              Done ({completedCount})
            </TabsTrigger>
          </TabsList>

          {completedCount > 0 && (
            <button
              onClick={onClearCompleted}
              className="text-xs text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
              id="clear-completed-btn"
            >
              Clear completed
            </button>
          )}
        </div>

        {ALL_FILTERS.map((tabVal) => (
          <TabsContent key={tabVal} value={tabVal}>
            {isLoading ? (
              <SkeletonList />
            ) : filteredTodos.length === 0 ? (
              <EmptyState filter={tabVal} hasSearch={!!search} />
            ) : (
              <div className="space-y-2">
                {filteredTodos.map((todo) => (
                  <TodoRow
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggle}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </>
  )
}

function SkeletonList() {
  return (
    <div className="space-y-2">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div
          key={i}
          className="h-16 rounded-xl bg-white/5 border border-white/10 animate-pulse"
        />
      ))}
    </div>
  )
}

function EmptyState({ filter, hasSearch }: { filter: TodoFilter; hasSearch: boolean }) {
  const isCompleted = filter === 'completed'
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
        {isCompleted ? (
          <Trophy className="w-7 h-7 text-emerald-400" />
        ) : (
          <Target className="w-7 h-7 text-slate-500" />
        )}
      </div>
      <p className="text-slate-400 font-medium">
        {isCompleted
          ? 'No completed tasks yet'
          : hasSearch
            ? 'No tasks match your search'
            : 'No tasks yet — add one above!'}
      </p>
      <p className="text-slate-600 text-sm mt-1">
        {isCompleted
          ? 'Complete a task to see it here.'
          : 'Tip: Press Enter to quickly add a task.'}
      </p>
    </div>
  )
}
