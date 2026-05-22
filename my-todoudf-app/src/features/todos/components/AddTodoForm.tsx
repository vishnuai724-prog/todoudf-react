import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { createTodoSchema, type CreateTodoFormData } from '../schemas/todo.schema'
import { PRIORITY_CONFIG } from '../constants/priorityConfig'
import type { Priority } from '../types/todo.types'
import { Plus } from 'lucide-react'

interface AddTodoFormProps {
  onCreate: (data: CreateTodoFormData) => void
  isCreating: boolean
}

export function AddTodoForm({ onCreate, isCreating }: AddTodoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateTodoFormData>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: { text: '', priority: 'medium' },
  })

  const selectedPriority = useWatch({ control, name: 'priority' })

  const onSubmit = (data: CreateTodoFormData) => {
    onCreate(data)
    reset()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-5 rounded-2xl bg-white/5 border border-white/10 mb-6"
      id="add-todo-form"
    >
      <div className="flex gap-3 mb-3">
        <div className="flex-1">
          <Input
            id="add-todo-input"
            placeholder="What needs to be done?"
            className={errors.text ? 'border-red-500/50' : ''}
            {...register('text')}
          />
          {errors.text && (
            <p className="text-xs text-red-400 mt-1">{errors.text.message}</p>
          )}
        </div>
        <Button
          id="add-todo-btn"
          variant="gradient"
          type="submit"
          disabled={isCreating}
          className="px-5"
        >
          <Plus className="w-4 h-4" /> Add
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">Priority:</span>
        {(['low', 'medium', 'high'] as Priority[]).map((p) => {
          const cfg = PRIORITY_CONFIG[p]
          const isActive = selectedPriority === p
          return (
            <button
              key={p}
              type="button"
              onClick={() => setValue('priority', p)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border transition-all cursor-pointer ${
                isActive
                  ? `${cfg.color} border-current bg-current/10`
                  : 'border-white/10 text-slate-500 hover:border-white/20'
              }`}
              id={`priority-${p}`}
              aria-pressed={isActive}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </button>
          )
        })}
      </div>
    </form>
  )
}
