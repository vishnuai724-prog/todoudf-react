"use no memo"

import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type ColumnDef,
} from '@tanstack/react-table'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Badge } from '@/shared/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/tabs'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useTodos } from '../hooks/useTodos'
import { useTodoStore } from '../store/todoUiStore'
import { createTodoSchema, type CreateTodoFormData } from '../schemas/todo.schema'
import { ROUTES } from '@/shared/constants/routes'
import type { Todo, Priority, TodoFilter } from '../types/todo.types'
import {
  CheckSquare, Plus, Trash2, LogOut, Home, ListTodo,
  Sparkles, Trophy, Target, TrendingUp, Search,
} from 'lucide-react'

dayjs.extend(relativeTime)

// ─── Priority config ──────────────────────────────────────────────────────────
const PRIORITY_CONFIG: Record<Priority, { label: string; dot: string; color: string; badge: 'default' | 'warning' | 'destructive' }> = {
  low:    { label: 'Low',    dot: 'bg-slate-400',  color: 'text-slate-400',  badge: 'secondary' as 'default' },
  medium: { label: 'Medium', dot: 'bg-amber-400',  color: 'text-amber-400',  badge: 'warning' },
  high:   { label: 'High',   dot: 'bg-red-400',    color: 'text-red-400',    badge: 'destructive' },
}

export default function TodoDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { filter, search, setFilter, setSearch } = useTodoStore()
  const { todos, isLoading, createTodo, toggleTodo, deleteTodo, clearCompleted, isCreating } = useTodos(user?.id ?? '')

  // ─── React Hook Form for add-todo ─────────────────────────────────────────
  const { register, handleSubmit, reset, control, setValue, formState: { errors } } = useForm<CreateTodoFormData>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: { text: '', priority: 'medium' },
  })
  const selectedPriority = useWatch({ control, name: 'priority' })

  const onAddTodo = (data: CreateTodoFormData) => {
    createTodo(data)
    reset()
  }

  // ─── Filtered todos (for tab counts) ──────────────────────────────────────
  const filteredTodos = useMemo(() => {
    let list = todos
    if (search) list = list.filter((t) => t.text.toLowerCase().includes(search.toLowerCase()))
    if (filter === 'active') list = list.filter((t) => !t.completed)
    if (filter === 'completed') list = list.filter((t) => t.completed)
    return list
  }, [todos, filter, search])

  const completedCount = todos.filter((t) => t.completed).length
  const progress = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0

  // ─── TanStack Table columns ───────────────────────────────────────────────
  const columns = useMemo<ColumnDef<Todo>[]>(
    () => [
      {
        id: 'check',
        size: 40,
        cell: ({ row }) => (
          <Checkbox
            id={`todo-check-${row.original.id}`}
            checked={row.original.completed}
            onCheckedChange={() => toggleTodo({ id: row.original.id, completed: !row.original.completed })}
          />
        ),
      },
      {
        accessorKey: 'text',
        header: 'Task',
        cell: ({ row }) => (
          <span className={`text-sm ${row.original.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
            {row.original.text}
          </span>
        ),
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        size: 100,
        cell: ({ row }) => {
          const p = PRIORITY_CONFIG[row.original.priority]
          return (
            <span className={`flex items-center gap-1.5 text-xs ${p.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
              {p.label}
            </span>
          )
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Added',
        size: 110,
        cell: ({ row }) => (
          <span className="text-xs text-slate-500">
            {dayjs(row.original.createdAt).fromNow()}
          </span>
        ),
      },
      {
        id: 'status',
        size: 80,
        cell: ({ row }) =>
          row.original.completed ? (
            <Badge variant="success" className="text-xs">Done</Badge>
          ) : null,
      },
      {
        id: 'actions',
        size: 50,
        cell: ({ row }) => (
          <button
            onClick={() => deleteTodo(row.original.id)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer opacity-0 group-hover/row:opacity-100"
            id={`todo-delete-${row.original.id}`}
            aria-label="Delete todo"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        ),
      },
    ],
    [toggleTodo, deleteTodo],
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredTodos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const handleLogout = () => { logout(); navigate(ROUTES.HOME) }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white flex">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-100 h-100 rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-87.5 h-87.5 rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      {/* Sidebar */}
      <aside className="relative z-10 hidden md:flex flex-col w-64 border-r border-white/5 px-5 py-8">
        <Link to={ROUTES.HOME} className="flex items-center gap-2 mb-10 group">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <CheckSquare className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            TodoFlow
          </span>
        </Link>

        {/* User card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg mb-3">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="text-white font-medium text-sm truncate">{user?.name}</div>
          <div className="text-slate-500 text-xs truncate">{user?.email}</div>
        </div>

        {/* Progress */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Daily Progress</span>
            <span className="text-xs font-bold text-violet-400">{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-linear-to-r from-violet-500 to-indigo-500 transition-all duration-700" style={{ width: `${progress}%` }} />
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
          <Link to={ROUTES.HOME} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm">
            <Home className="w-4 h-4" /> Home
          </Link>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white bg-violet-500/20 border border-violet-500/30 text-sm font-medium">
            <ListTodo className="w-4 h-4 text-violet-400" /> My Todos
          </div>
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm mt-4 cursor-pointer" id="sidebar-logout-btn">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </aside>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col min-h-screen">
        <header className="md:hidden flex items-center justify-between px-5 py-4 border-b border-white/5">
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <CheckSquare className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">TodoFlow</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-400">
            <LogOut className="w-4 h-4" />
          </Button>
        </header>

        <div className="flex-1 p-6 md:p-8 max-w-3xl mx-auto w-full">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              {dayjs().format('dddd, MMMM D, YYYY')}
            </div>
            <h1 className="text-3xl font-black text-white">
              {progress === 100 && todos.length > 0 ? '🎉 All done!' : '💪 Let\'s go,'}
              {!(progress === 100 && todos.length > 0) && (
                <span className="ml-2 bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  {user?.name?.split(' ')[0]}
                </span>
              )}
            </h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { icon: Target, label: 'Total', value: todos.length, color: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/20' },
              { icon: TrendingUp, label: 'Active', value: todos.filter((t) => !t.completed).length, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
              { icon: Trophy, label: 'Done', value: completedCount, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
            ].map((s) => (
              <div key={s.label} className={`p-4 rounded-2xl border ${s.bg} text-center`}>
                <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
                <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Add todo form */}
          <form onSubmit={handleSubmit(onAddTodo)} className="p-5 rounded-2xl bg-white/5 border border-white/10 mb-6" id="add-todo-form">
            <div className="flex gap-3 mb-3">
              <div className="flex-1">
                <Input
                  id="add-todo-input"
                  placeholder="What needs to be done?"
                  className={errors.text ? 'border-red-500/50' : ''}
                  {...register('text')}
                />
                {errors.text && <p className="text-xs text-red-400 mt-1">{errors.text.message}</p>}
              </div>
              <Button id="add-todo-btn" variant="gradient" type="submit" disabled={isCreating} className="px-5">
                <Plus className="w-4 h-4" /> Add
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Priority:</span>
              {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setValue('priority', p)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border transition-all cursor-pointer ${
                    selectedPriority === p
                      ? `${PRIORITY_CONFIG[p].color} border-current bg-current/10`
                      : 'border-white/10 text-slate-500 hover:border-white/20'
                  }`}
                  id={`priority-${p}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_CONFIG[p].dot}`} />
                  {PRIORITY_CONFIG[p].label}
                </button>
              ))}
            </div>
          </form>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <Input id="todo-search" placeholder="Search todos…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>

          {/* Tabs + TanStack Table */}
          <Tabs value={filter} onValueChange={(v) => setFilter(v as TodoFilter)} id="todo-tabs">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all" id="tab-all">All ({todos.length})</TabsTrigger>
                <TabsTrigger value="active" id="tab-active">Active ({todos.filter((t) => !t.completed).length})</TabsTrigger>
                <TabsTrigger value="completed" id="tab-completed">Done ({completedCount})</TabsTrigger>
              </TabsList>
              {completedCount > 0 && (
                <button onClick={() => clearCompleted()} className="text-xs text-slate-500 hover:text-red-400 transition-colors cursor-pointer" id="clear-completed-btn">
                  Clear completed
                </button>
              )}
            </div>

            {(['all', 'active', 'completed'] as TodoFilter[]).map((tabVal) => (
              <TabsContent key={tabVal} value={tabVal}>
                {isLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 rounded-xl bg-white/5 border border-white/10 animate-pulse" />
                    ))}
                  </div>
                ) : table.getRowModel().rows.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                      {tabVal === 'completed' ? <Trophy className="w-7 h-7 text-emerald-400" /> : <Target className="w-7 h-7 text-slate-500" />}
                    </div>
                    <p className="text-slate-400 font-medium">
                      {tabVal === 'completed' ? 'No completed tasks yet' : search ? 'No tasks match your search' : 'No tasks yet — add one above!'}
                    </p>
                    <p className="text-slate-600 text-sm mt-1">
                      {tabVal === 'completed' ? 'Complete a task to see it here.' : 'Tip: Press Enter to quickly add a task.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {table.getRowModel().rows.map((row) => (
                      <div
                        key={row.id}
                        className={`group/row flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                          row.original.completed
                            ? 'bg-white/2 border-white/5 opacity-60'
                            : 'bg-white/5 border-white/10 hover:border-violet-500/30 hover:bg-violet-500/5'
                        }`}
                        id={`todo-item-${row.original.id}`}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <div key={cell.id} style={{ width: cell.column.getSize() === 150 ? 'auto' : cell.column.getSize(), flex: cell.column.id === 'text' ? '1' : undefined }}>
                            {cell.column.id === 'text'
                              ? <span className={`text-sm ${row.original.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>{row.original.text}</span>
                              : cell.column.id === 'check'
                              ? <Checkbox id={`todo-check-${row.original.id}`} checked={row.original.completed} onCheckedChange={() => toggleTodo({ id: row.original.id, completed: !row.original.completed })} />
                              : cell.column.id === 'priority'
                              ? <span className={`flex items-center gap-1.5 text-xs ${PRIORITY_CONFIG[row.original.priority].color}`}><span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_CONFIG[row.original.priority].dot}`} />{PRIORITY_CONFIG[row.original.priority].label}</span>
                              : cell.column.id === 'createdAt'
                              ? <span className="text-xs text-slate-500">{dayjs(row.original.createdAt).fromNow()}</span>
                              : cell.column.id === 'status'
                              ? row.original.completed ? <Badge variant="success" className="text-xs">Done</Badge> : null
                              : cell.column.id === 'actions'
                              ? <button onClick={() => deleteTodo(row.original.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer opacity-0 group-hover/row:opacity-100" id={`todo-delete-${row.original.id}`} aria-label="Delete todo"><Trash2 className="w-3.5 h-3.5" /></button>
                              : null}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  )
}
