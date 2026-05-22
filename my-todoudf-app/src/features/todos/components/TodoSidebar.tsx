import { Link } from 'react-router-dom'
import { useLogout } from '@/features/auth'
import { ROUTES } from '@/shared/constants/routes'
import { CheckSquare, Home, ListTodo, LogOut } from 'lucide-react'
import type { User } from '@/features/auth'
import type { Todo } from '../types/todo.types'

interface TodoSidebarProps {
  user: User | null
  todos: Todo[]
}

export function TodoSidebar({ user, todos }: TodoSidebarProps) {
  const logoutMutation = useLogout()

  const completedCount = todos.filter((t) => t.completed).length
  const progress = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0

  return (
    <aside className="relative z-10 hidden md:flex flex-col w-64 border-r border-white/5 px-5 py-8">
      <Link to={ROUTES.HOME} className="flex items-center gap-2 mb-10 group">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
          <CheckSquare className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
          TodoFlow
        </span>
      </Link>

      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg mb-3">
          {user?.name?.[0]?.toUpperCase() ?? 'U'}
        </div>
        <div className="text-white font-medium text-sm truncate">{user?.name}</div>
        <div className="text-slate-500 text-xs truncate">{user?.email}</div>
      </div>

      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400">Daily Progress</span>
          <span className="text-xs font-bold text-violet-400">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-linear-to-r from-violet-500 to-indigo-500 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="text-center">
            <div className="text-lg font-bold text-white">{todos.length}</div>
            <div className="text-xs text-slate-500">Total</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-400">{completedCount}</div>
            <div className="text-xs text-slate-500">Done</div>
          </div>
        </div>
      </div>

      <nav className="space-y-1 flex-1">
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm"
        >
          <Home className="w-4 h-4" /> Home
        </Link>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white bg-violet-500/20 border border-violet-500/30 text-sm font-medium">
          <ListTodo className="w-4 h-4 text-violet-400" /> My Todos
        </div>
      </nav>

      <button
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm mt-4 cursor-pointer disabled:opacity-50"
        id="sidebar-logout-btn"
      >
        <LogOut className="w-4 h-4" />
        {logoutMutation.isPending ? 'Signing out…' : 'Sign Out'}
      </button>
    </aside>
  )
}
