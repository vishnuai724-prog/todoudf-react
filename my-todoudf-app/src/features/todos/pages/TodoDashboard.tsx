import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { useAuthStore, useLogout } from '@/features/auth'
import { Button } from '@/shared/components/ui/button'
import { ROUTES } from '@/shared/constants/routes'
import { useTodos } from '../hooks/useTodos'
import { useTodoStore } from '../store/todoUiStore'
import { TodoSidebar } from '../components/TodoSidebar'
import { TodoStats } from '../components/TodoStats'
import { AddTodoForm } from '../components/AddTodoForm'
import { TodoList } from '../components/TodoList'
import { CheckSquare, Sparkles, LogOut } from 'lucide-react'

export default function TodoDashboard() {
  const user = useAuthStore((s) => s.user)
  const { filter, search, setFilter, setSearch, reset: resetUiStore } = useTodoStore()
  const {
    todos,
    isLoading,
    createTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    isCreating,
  } = useTodos(user?.id ?? '')

  const logoutMutation = useLogout()

  useEffect(() => () => resetUiStore(), [resetUiStore])

  const completedCount = todos.filter((t) => t.completed).length
  const progress = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white flex">
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-[-10%] left-[-5%] w-100 h-100 rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-87.5 h-87.5 rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <TodoSidebar user={user} todos={todos} />

      <main className="relative z-10 flex-1 flex flex-col min-h-screen">
        <header className="md:hidden flex items-center justify-between px-5 py-4 border-b border-white/5">
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <CheckSquare className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              TodoFlow
            </span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logoutMutation.mutate()}
            className="text-slate-400"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </header>

        <div className="flex-1 p-6 md:p-8 max-w-3xl mx-auto w-full">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              {dayjs().format('dddd, MMMM D, YYYY')}
            </div>
            <h1 className="text-3xl font-black text-white">
              {progress === 100 && todos.length > 0 ? (
                '🎉 All done!'
              ) : (
                <>
                  💪 Let's go,{' '}
                  <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                    {user?.name?.split(' ')[0]}
                  </span>
                </>
              )}
            </h1>
          </div>

          <TodoStats todos={todos} />

          <AddTodoForm onCreate={createTodo} isCreating={isCreating} />

          <TodoList
            todos={todos}
            isLoading={isLoading}
            filter={filter}
            search={search}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onClearCompleted={clearCompleted}
            onFilterChange={setFilter}
            onSearchChange={setSearch}
          />
        </div>
      </main>
    </div>
  )
}
